window.__ModuleLoader__.load({
  id: 'dsh-sky-window',
  factory(require) {
    'use strict';
    const React = require('react');
    const h = React.createElement;
    const UI_CSS = __UI_CSS__;
    const SCENE_HTML = __SCENE_HTML__;
    const SCENE_CSS = __SCENE_CSS__;
    // Embed the tested solar engine in private scope; no CDN or global override.
    const solar = (() => {
      const globalThis = {};
      /*__SOLAR_SOURCE__*/
      return globalThis.SkySolar;
    })();
    const CITIES = {
      shanghai:{name:'上海',latitude:31.2304,longitude:121.4737,timeZone:'Asia/Shanghai'},
      beijing:{name:'北京',latitude:39.9042,longitude:116.4074,timeZone:'Asia/Shanghai'},
      chengdu:{name:'成都',latitude:30.5728,longitude:104.0668,timeZone:'Asia/Shanghai'},
      shenzhen:{name:'深圳',latitude:22.5431,longitude:114.0579,timeZone:'Asia/Shanghai'},
      tokyo:{name:'东京',latitude:35.6762,longitude:139.6503,timeZone:'Asia/Tokyo'},
      london:{name:'伦敦',latitude:51.5072,longitude:-.1276,timeZone:'Europe/London'},
      newyork:{name:'纽约',latitude:40.7128,longitude:-74.006,timeZone:'America/New_York'},
      sydney:{name:'悉尼',latitude:-33.8688,longitude:151.2093,timeZone:'Australia/Sydney'}
    };
    const AM = [
      [-18,'17263e','35435b','636d81','506176','64768a','3f5863','315159','294b50'],
      [-10,'454d75','8989a5','d4afb2','9291aa','c5b8c1','8b929c','71878c','5f7b7e'],
      [-3,'9695b4','dcbbc0','f8d7b4','d4bdc4','ffe5d0','a5b5ad','8da8a1','7f9d95'],
      [4,'a8bfce','e3d4ce','f5dfbd','e0d5d1','fff4dc','b3c3af','91b2a1','7aa697'],
      [14,'9bc6d9','d3e5e4','eee7ca','dcebe5','fffdf0','a5beb7','8aafa2','78a393'],
      [35,'8abbd4','c5e1e7','e8e6d1','dfede9','fffef3','a4beba','8bb0a8','79a59c']
    ];
    const PM = [
      [-18,'17263e','35435b','636d81','506176','64768a','3f5863','315159','294b50'],
      [-10,'4a4c70','8d819b','d8a4ad','91829b','c6a5b0','8b8a96','717d88','607681'],
      [-3,'8f849e','d8acb4','f1bf9f','c9a5b3','f5cbb9','b0a9a4','929e97','7d948a'],
      [4,'a2b5c8','e2c6c2','f5d4a8','e0c3bf','ffe3c5','b5b7a7','a1ad94','889f87'],
      [14,'9bc6d9','d3e5e4','eee7ca','dcebe5','fffdf0','a5beb7','8aafa2','78a393'],
      [35,'8abbd4','c5e1e7','e8e6d1','dfede9','fffef3','a4beba','8bb0a8','79a59c']
    ];
    const clamp = (n,a=0,b=1) => Math.max(a,Math.min(b,n));
    const smooth = (a,b,n) => { const x=clamp((n-a)/(b-a));return x*x*(3-2*x); };
    const rgb = hex => hex.match(/[a-f\d]{2}/gi).map(x=>parseInt(x,16));
    const mix = (a,b,n) => a.map((x,i)=>x+(b[i]-x)*clamp(n));
    const css = color => `rgb(${color.map(Math.round).join(', ')})`;
    const rgba = (color,alpha) => `rgba(${color.map(Math.round).join(', ')}, ${alpha})`;
    const key = parts => `${parts.year}-${String(parts.month).padStart(2,'0')}-${String(parts.day).padStart(2,'0')}`;
    const isCity = value => Object.hasOwn(CITIES,value);
    function dayLength(times) {
      if(times.polar==='day')return '极昼';
      if(times.polar==='night')return '极夜';
      if(times.sunrise===null||times.sunset===null||times.sunset<=times.sunrise)return '—';
      const minutes=Math.round(times.sunset-times.sunrise);
      return `${Math.floor(minutes/60)}小时${minutes%60}分`;
    }
    const lum = color => color.map(n=>{const x=n/255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;}).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);
    const contrast = (a,b) => {const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
    function readable(ink,background) {
      if(contrast(ink,background)>=4.6)return ink;
      const target=contrast([0,0,0],background)>contrast([255,255,255],background)?[0,0,0]:[255,255,255];
      let a=0,b=1;for(let i=0;i<14;i++){const t=(a+b)/2;if(contrast(mix(ink,target,t),background)<4.6)a=t;else b=t;}
      return mix(ink,target,b);
    }
    function palette(context) {
      function sample(stops) {
        let a=stops[0],b=stops.at(-1);
        if(context.altitude<=a[0])b=a;
        else if(context.altitude>=b[0])a=b;
        else for(let i=1;i<stops.length;i++)if(context.altitude<stops[i][0]){a=stops[i-1];b=stops[i];break;}
        const t=a===b?0:smooth(a[0],b[0],context.altitude);
        return a.slice(1).map((color,i)=>mix(rgb(color),rgb(b[i+1]),t));
      }
      const am=sample(AM),pm=sample(PM),t=.5+.5*Math.sin((context.minutes-context.times.noon)*Math.PI/720);
      const sky=am.map((color,i)=>mix(color,pm[i],t));
      const night=1-smooth(-10,4,context.altitude),dark=context.altitude<-8;
      const warmth=Math.exp(-(((context.altitude-1)/10)**2));
      const surface=dark?rgb('202e3d'):mix(rgb('f5f8f3'),rgb('fff6ec'),warmth*.8);
      const sidebar=dark?rgb('1c2c3b'):mix(rgb('edf3ee'),rgb('f4eadd'),warmth*.8);
      const ink=readable(dark?rgb('e3ece5'):rgb('263f49'),sidebar);
      const secondary=readable(dark?rgb('b1c3bd'):rgb('526a73'),sidebar);
      const muted=readable(dark?rgb('96afa9'):rgb('637982'),sidebar);
      const accent=readable(dark?rgb('b9d5c7'):rgb('315d62'),surface);
      const sceneInk=readable(mix(rgb('263f49'),rgb('e3ece5'),night),mix(sky[2],sky[6],.16));
      return {sky,night,dark,warmth,surface,sidebar,ink,secondary,muted,accent,sceneInk};
    }
    function copy(context) {
      if(context.times.polar==='day')return {label:'极昼 · 长长的日光',title:'太阳还在这片天空里。',detail:'今天没有日出日落，太阳整日留在地平线上方。'};
      if(context.times.polar==='night')return {label:'极夜 · 也在流动',title:'长夜里，也有天空。',detail:'今天没有太阳升起。地平线附近仍可能有短暂的暮光。'};
      if(context.altitude<-8)return {label:'月色，安静地陪着',title:'夜深了，天空还在。',detail:'月亮和星星留在这里。想歇一会儿，就看一会儿。'};
      if(context.altitude<7)return context.minutes<context.times.noon
        ?{label:'晨光，慢慢铺开',title:'早安，天空醒来了。',detail:'地平线先亮了起来，云朵也染上一点暖色。'}
        :{label:'晚霞，正在经过',title:'先停一会儿，看看晚霞。',detail:context.altitude<-.833?'太阳已经落下，云上的余晖还会再停留一会儿。':'太阳正慢慢走向地平线，光也变得柔软了。'};
      return {label:'晴空，正好',title:'今天，也抬头看看天。',detail:'云朵走得很慢。你也可以，先不用着急。'};
    }
    function createController(ctx) {
      const STORAGE='dsh-sky-window.preferences.v1';
      const media=matchMedia('(prefers-reduced-motion: reduce)');
      const state={enabled:true,city:'shanghai',custom:null,intensity:75,motion:true,minutes:null,date:null,looking:false,panelOpen:false,playback:null,notice:'',locating:false};
      try {
        const saved=JSON.parse(localStorage.getItem(STORAGE)||'null');
        if(saved) {
          if(saved.custom&&Number.isFinite(saved.custom.latitude)&&Math.abs(saved.custom.latitude)<=90&&Number.isFinite(saved.custom.longitude)&&Math.abs(saved.custom.longitude)<=180&&typeof saved.custom.timeZone==='string') {
            new Intl.DateTimeFormat('en',{timeZone:saved.custom.timeZone});state.custom={...saved.custom,name:'当前位置'};
          }
          if(isCity(saved.city)||(saved.city==='custom'&&state.custom))state.city=saved.city;
          if(typeof saved.enabled==='boolean')state.enabled=saved.enabled;
          if(typeof saved.motion==='boolean')state.motion=saved.motion;
          if(Number.isFinite(saved.intensity))state.intensity=clamp(saved.intensity,25,100);
        }
      } catch { /* A blocked or old local preference must not break native DSH. */ }
      const listeners=new Set(),scenes=new Set(),cache=new Map(),inertBefore=new Map();
      let revision=0,view,background,backgroundDispose,styleNode,timer,previousTheme=ctx.theme.getTheme().preference;
      let overrideDispose=null,overrideSignature='',applyingTheme=false,disposed=false,themeSyncQueued=false,focusBefore=null,offTheme;
      const city=()=>state.city==='custom'?state.custom:CITIES[state.city];
      const persist=()=>{try{localStorage.setItem(STORAGE,JSON.stringify({enabled:state.enabled,city:state.city,custom:state.custom,intensity:state.intensity,motion:state.motion}));}catch{}};
      function context() {
        const location=city(),now=new Date(),local=solar.getZonedDateParts(now,location.timeZone);
        const instant=state.minutes===null&&!state.date?now:solar.dateAtMinutes(state.date||local,state.minutes??(local.hour*60+local.minute+local.second/60),location.timeZone);
        const parts=solar.getZonedDateParts(instant,location.timeZone),minutes=parts.hour*60+parts.minute+parts.second/60;
        const cacheKey=`${location.latitude},${location.longitude},${location.timeZone},${key(parts)}`;
        if(!cache.has(cacheKey)){if(cache.size>40)cache.clear();cache.set(cacheKey,solar.getSunTimes(parts,location.latitude,location.longitude,location.timeZone));}
        const times=cache.get(cacheKey),position=solar.getSunPosition(instant,location.latitude,location.longitude);
        const result={city:location,parts,minutes,instant,times,altitude:position.altitude,preview:state.minutes!==null||!!state.date};
        result.palette=palette(result);result.copy=copy(result);return result;
      }
      function applyTheme() {
        const p=view.palette,scheme=p.dark?'sky-night':'sky-day';
        const line=rgba(p.ink,.14),hover=p.dark?'rgba(205,225,224,.09)':'rgba(255,255,255,.44)';
        const values={
          '--dsw-alias-bg-base':css(p.surface),'--dsw-alias-bg-layer-1':css(p.surface),
          '--dsw-alias-bg-layer-2':css(mix(p.surface,p.sidebar,.5)),'--dsw-alias-bg-layer-3':css(p.surface),
          '--dsw-alias-bg-module-platform':css(p.surface),'--dsw-alias-bg-overlay':css(p.surface),
          '--dsw-specific-sidebar-fill':rgba(p.sidebar,.94),'--dsw-specific-input-major':rgba(p.surface,.96),
          '--dsw-specific-menu':css(p.surface),'--dsw-specific-selector':css(mix(p.surface,p.sidebar,.65)),
          '--dsw-specific-bubble':rgba(p.surface,.90),'--dsw-specific-tip':css(p.surface),
          '--dsw-alias-label-primary':css(p.ink),'--dsw-alias-label-primary-bluish':css(p.ink),
          '--dsw-alias-label-secondary':css(p.secondary),'--dsw-alias-label-tertiary':css(p.muted),
          '--dsw-alias-label-caption':css(p.muted),'--dsw-alias-label-dimmed':css(p.muted),
          '--dsw-alias-label-primary-inverted':css(p.surface),'--dsw-alias-label-primary-foreground':css(p.surface),
          '--dsw-alias-brand-primary':css(p.accent),'--dsw-alias-brand-text':css(p.accent),
          '--dsw-alias-state-business-primary':css(p.accent),'--dsw-alias-border-l1':line,
          '--dsw-alias-border-l2':line,'--dsw-alias-border-l2-darkmode-thin':line,
          '--dsw-alias-border-l3':rgba(p.ink,.24),'--dsw-alias-border-l4':rgba(p.ink,.22),
          '--dsw-alias-border-inverted':line,'--dsw-alias-interactive-bg-hover':hover,
          '--dsw-alias-interactive-bg-hover-solid':css(mix(p.surface,p.sidebar,.65)),
          '--dsw-alias-button-floating-fill':css(p.surface),'--dsw-alias-button-floating-hover':css(p.sidebar),
          '--dsw-alias-markdown-code-block':css(mix(p.surface,p.dark?[0,0,0]:rgb('b7ccc2'),.14)),
          '--dsw-alias-markdown-inline-code':css(mix(p.surface,p.sidebar,.65)),
          '--dsw-specific-sidebar-nav-item-active':hover,'--dsw-specific-sidebar-nav-item-hover':hover,
          '--sw-look-background':css(p.sky[1]),'--sw-look-ink':css(p.sceneInk),
          '--sw-glass-fill':rgba(mix(p.surface,p.sky[1],.48),p.dark?.56:.48),
          '--sw-glass-border':rgba(p.sceneInk,p.dark?.18:.12),
          '--sw-glass-accent':rgba(p.sceneInk,p.dark?.18:.14),
          '--sw-glass-shadow':rgba(p.dark?[0,0,0]:rgb('263f49'),p.dark?.18:.08)
        };
        const signature=JSON.stringify(values);
        applyingTheme=true;
        try {
          if(ctx.theme.getTheme().preference!==scheme)ctx.theme.setTheme(scheme);
          if(signature!==overrideSignature){overrideDispose=ctx.theme.overrideTokens('dsh-sky-window',Object.fromEntries(Object.entries(values).map(([name,value])=>[name,{light:value,dark:value}])));overrideSignature=signature;}
        } finally {applyingTheme=false;}
      }
      function paintScene(scene) {
        const p=view.palette,root=scene.host;
        const keys=['--sky-top','--sky-mid','--sky-low','--cloud','--cloud-top','--hill-far','--hill-mid','--hill-near'];
        keys.forEach((name,i)=>root.style.setProperty(name,css(p.sky[i])));
        const hasEvents=view.times.sunrise!==null&&view.times.sunset!==null&&view.times.sunset>view.times.sunrise;
        const progress=clamp(hasEvents?(view.minutes-view.times.sunrise)/(view.times.sunset-view.times.sunrise):(view.minutes-view.times.noon)/1440+.5,-.12,1.12);
        const angle=Math.PI*(1-progress),polarDay=view.times.polar==='day';
        const x=polarDay?500+270*Math.sin((view.minutes-view.times.noon)*Math.PI/720):500+350*Math.cos(angle);
        const y=polarDay?245-155*clamp(view.altitude/45):315-252*Math.sin(angle);
        scene.sun.style.transform=`translate(${x.toFixed(3)}px,${y.toFixed(3)}px)`;
        scene.progress.style.strokeDasharray=`${clamp(progress)} 1`;
        scene.rise.textContent=solar.formatTime(view.times.sunrise);scene.set.textContent=solar.formatTime(view.times.sunset);
        scene.caption.textContent=view.times.polar==='day'?'极昼 · 全天有光':view.times.polar==='night'?'极夜 · 等待下一次日出':'半圆 · 日出到日落';
        const sidebar=document.querySelector('.pI_x6G_sidebarCol');
        const variables={
          '--scene-ink':css(p.sceneInk),'--intensity':state.intensity/100,'--nightness':p.night,
          '--stars':1-smooth(-14,-5,view.altitude),'--moon-visibility':1-smooth(-10,-4,view.altitude),
          '--sun-visibility':polarDay?1:view.times.polar==='night'?0:smooth(-3,-.7,view.altitude),
          '--warmth':p.warmth*.55,'--light-x':`${x/10}%`,'--reading-veil':css(p.surface),
          '--sw-sidebar':`${sidebar?sidebar.getBoundingClientRect().width:240}px`
        };
        Object.entries(variables).forEach(([name,value])=>root.style.setProperty(name,String(value)));
        root.toggleAttribute('data-preview',view.preview);root.toggleAttribute('data-playing',!!state.playback);
        root.toggleAttribute('data-paused',!state.motion||media.matches||document.hidden);
        root.toggleAttribute('data-polar',!!view.times.polar);
      }
      function attachScene(host) {
        const shadow=host.shadowRoot||host.attachShadow({mode:'open'});
        // All markup is a fixed local build asset; user input never reaches HTML.
        shadow.innerHTML=`<style>${SCENE_CSS}</style>${SCENE_HTML}`;
        const stars=shadow.querySelector('.stars');
        for(let i=0;i<46;i++){
          const star=document.createElement('i');star.className='star';star.style.left=`${(i*61.73+7)%100}%`;star.style.top=`${(i*29.41+11)%87}%`;
          star.style.width=star.style.height=`${i%6===0?2:1}px`;star.style.setProperty('--star-opacity',String(.24+i%5*.12));star.style.setProperty('--delay',`${-i*.7}s`);stars.append(star);
        }
        const scene={host,sun:shadow.querySelector('.sun'),progress:shadow.querySelector('.progress'),rise:shadow.querySelector('.rise'),set:shadow.querySelector('.set'),caption:shadow.querySelector('.center-caption')};
        scenes.add(scene);if(view)paintScene(scene);return()=>scenes.delete(scene);
      }
      function ensureBackground() {
        if(background)return;
        background=document.createElement('div');background.id='dsh-sky-window-background';background.setAttribute('aria-hidden','true');
        Object.assign(background.style,{position:'fixed',inset:'0',zIndex:'-1',pointerEvents:'none'});
        document.body.prepend(background);backgroundDispose=attachScene(background);document.body.setAttribute('data-sky-window','on');
      }
      function restoreInert() {for(const [node,value]of inertBefore)if(node.isConnected)node.inert=value;inertBefore.clear();}
      function clearVisual(restore=true) {
        backgroundDispose?.();backgroundDispose=null;background?.remove();background=null;document.body.removeAttribute('data-sky-window');
        applyingTheme=true;
        try {
          overrideDispose?.();overrideDispose=null;overrideSignature='';
          const selected=ctx.theme.getTheme().preference;
          if(restore&&(selected==='sky-day'||selected==='sky-night')) {
            const themes=ctx.theme.getTheme().themes;
            ctx.theme.setTheme(previousTheme==='system'||themes.some(theme=>theme.id===previousTheme)?previousTheme:'system');
          }
        } finally {applyingTheme=false;}
        restoreInert();
      }
      function emit() {
        if(disposed)return;view=context();
        if(state.enabled){ensureBackground();applyTheme();for(const scene of scenes)paintScene(scene);}
        revision++;for(const listener of listeners)listener();
      }
      function stop() {if(state.playback){cancelAnimationFrame(state.playback.frame);state.playback=null;}}
      function enabled(value) {
        if(state.enabled===value)return;
        if(value){const preference=ctx.theme.getTheme().preference;if(preference!=='sky-day'&&preference!=='sky-night')previousTheme=preference;state.enabled=true;}
        else {stop();state.looking=false;state.enabled=false;clearVisual();}
        persist();emit();
      }
      function looking(value) {
        if(value&&!state.enabled)enabled(true);
        if(value&&!state.looking){
          focusBefore=document.activeElement;
          const overlay=document.querySelector('[data-shell-overlay]');
          if(overlay?.parentElement)for(const node of overlay.parentElement.children)if(node!==overlay){inertBefore.set(node,node.inert);node.inert=true;}
        }
        if(!value){stop();restoreInert();}
        state.looking=value;if(value)state.panelOpen=false;emit();
        if(!value&&focusBefore?.isConnected)focusBefore.focus({preventScroll:true});
      }
      function preview(minutes) {
        if(minutes===null){state.notice='这个日期没有对应的日出或日落。';emit();return;}
        if(!state.enabled)enabled(true);stop();if(!state.date)state.date={...view.parts};state.minutes=clamp(minutes,0,1439);emit();
      }
      function live() {stop();state.minutes=null;state.date=null;emit();}
      function play() {
        if(state.playback){stop();emit();return;}
        if(!state.enabled)enabled(true);state.date={...view.parts};state.minutes=0;
        state.playback={started:performance.now(),frame:0,last:-100};looking(true);
        function tick(now) {
          const playback=state.playback;if(!playback||disposed)return;
          if(now-playback.last>=75){state.minutes=Math.min(1439,(now-playback.started)/24000*1440);playback.last=now;emit();}
          if(state.minutes>=1439){stop();emit();return;}playback.frame=requestAnimationFrame(tick);
        }
        state.playback.frame=requestAnimationFrame(tick);
      }
      function locate() {
        if(!navigator.geolocation){state.notice='此浏览器无法定位，可以直接选择城市。';emit();return;}
        state.locating=true;state.notice='正在等待位置授权…';emit();
        navigator.geolocation.getCurrentPosition(result=>{
          if(disposed)return;state.custom={name:'当前位置',latitude:result.coords.latitude,longitude:result.coords.longitude,timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone};
          state.city='custom';state.locating=false;state.minutes=null;state.date=null;stop();
          state.notice='已切换到你的位置。定位时间采用设备时区。';persist();emit();
        },()=>{if(disposed)return;state.locating=false;state.notice='定位未成功，仍保留当前城市；也可以手动选择。';emit();},{enableHighAccuracy:false,timeout:10000,maximumAge:3600000});
      }
      const visibility=()=>{if(document.hidden)stop();emit();};
      const keyboard=event=>{if(event.key==='Escape'){if(state.panelOpen){state.panelOpen=false;emit();}else if(state.looking)looking(false);}};
      const onMotion=()=>emit(),resize=()=>emit();
      return {
        state,get view(){return view;},subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);},getSnapshot:()=>revision,
        attachScene,enabled,looking,preview,live,play,locate,
        pause(){stop();emit();},panel(value){stop();state.panelOpen=value;emit();},
        city(value){if(!isCity(value)&&!(value==='custom'&&state.custom))return;stop();state.city=value;state.minutes=null;state.date=null;state.notice='';persist();emit();},
        intensity(value){state.intensity=clamp(Number(value),25,100);persist();emit();},
        motion(value){state.motion=value;persist();emit();},
        date(value){if(!/^\d{4}-\d\d-\d\d$/.test(value))return;const [year,month,day]=value.split('-').map(Number);if(year<1900||year>2100)return;stop();state.date={year,month,day};state.minutes=view.minutes;emit();},
        start(){
          styleNode=document.createElement('style');styleNode.id='dsh-sky-window-style';styleNode.textContent=UI_CSS;document.head.append(styleNode);
          emit();timer=setInterval(()=>{if(!document.hidden&&!state.playback)emit();},15000);
          document.addEventListener('visibilitychange',visibility);document.addEventListener('keydown',keyboard);window.addEventListener('resize',resize);media.addEventListener('change',onMotion);
          offTheme=ctx.on('theme/change',snapshot=>{
            if(disposed||applyingTheme)return;
            if(state.enabled&&snapshot.preference!=='sky-day'&&snapshot.preference!=='sky-night') {
              // Host settings hydrate asynchronously. Preserve the native
              // preference for restoration while the explicit sky switch owns
              // the running palette; reapply outside the current event stack.
              previousTheme=snapshot.preference;
              if(!themeSyncQueued){
                themeSyncQueued=true;
                queueMicrotask(()=>{themeSyncQueued=false;if(!disposed&&state.enabled)applyTheme();});
              }
            }
          });
        },
        dispose(){disposed=true;stop();clearInterval(timer);offTheme?.();document.removeEventListener('visibilitychange',visibility);document.removeEventListener('keydown',keyboard);window.removeEventListener('resize',resize);media.removeEventListener('change',onMotion);clearVisual();styleNode?.remove();scenes.clear();listeners.clear();}
      };
    }

    function apply(ctx) {
      const registrations=[ctx.theme.register({id:'sky-day',colorScheme:'light',tokens:{}}),ctx.theme.register({id:'sky-night',colorScheme:'dark',tokens:{}})];
      const controller=createController(ctx);
      function useSky() {React.useSyncExternalStore(controller.subscribe,controller.getSnapshot,controller.getSnapshot);return {state:controller.state,view:controller.view};}
      function button(text,onClick,props={}) {return h('button',{type:'button',className:'sw-button sw-small',onClick,...props},text);}
      function Controls({closeNative}) {
        const {state,view}=useSky();if(!view)return null;
        const {times}=view,fmt=solar.formatTime;
        const openLook=()=>{closeNative?.();controller.looking(true);};
        const startDay=()=>{closeNative?.();controller.play();};
        return h('div',{className:'sw-settings'},
          h('p',{className:'sw-description'},'一扇朝向天空的窗。日光跟着当地时间流动，原生对话与工作区都留在这里。'),
          h('section',{className:'sw-section'},h('label',{className:'sw-row'},h('span',null,'启用天空窗'),h('input',{type:'checkbox',className:'sw-checkbox',checked:state.enabled,onChange:event=>controller.enabled(event.target.checked)}))),
          h('section',{className:'sw-section'},h('div',{className:'sw-label'},'天空所在的位置'),
            h('div',{className:'sw-control-row'},h('select',{'aria-label':'天空所在城市',value:state.city,onChange:event=>controller.city(event.target.value)},Object.entries(CITIES).map(([id,city])=>h('option',{key:id,value:id},city.name)),state.custom?h('option',{value:'custom'},'当前位置'):null),button(state.locating?'定位中…':'定位',controller.locate,{disabled:state.locating})),
            h('p',{className:'sw-help'},`${view.city.timeZone} · ${state.city==='custom'?'定位采用设备时区':'按城市当地时间计算'}`),
            h('div',{className:'sw-times'},h('div',null,'日出',h('strong',null,fmt(times.sunrise))),h('div',null,'日落',h('strong',null,fmt(times.sunset))),h('div',null,'今天的日光',h('strong',null,dayLength(times))))),
          h('section',{className:'sw-section'},h('div',{className:'sw-row'},h('label',null,'沿着时间，看看天空'),h('span',{className:'sw-time'},fmt(view.minutes))),
            h('input',{type:'range',min:0,max:1439,step:1,value:Math.floor(view.minutes),'aria-label':'预览当地时间',onChange:event=>controller.preview(Number(event.target.value))}),
            h('div',{className:'sw-range-labels'},h('span',null,'00:00'),h('span',null,'12:00'),h('span',null,'24:00')),
            h('div',{className:'sw-presets'},[['日出',times.sunrise],['正午',times.noon],['日落',times.sunset],['夜空',1320]].map(([label,minutes])=>button(label,()=>controller.preview(minutes),{key:label,disabled:minutes===null}))),
            h('div',{className:'sw-control-row'},h('input',{type:'date',min:'1900-01-01',max:'2100-12-31',value:key(view.parts),'aria-label':'预览日期',onChange:event=>controller.date(event.target.value)}),button(state.playback?'暂停':'看一天',startDay)),
            button(view.preview?'回到此刻的天空':'此刻，正在实时流动',controller.live,{className:`sw-button sw-small sw-live${view.preview?' sw-return-now':''}`,disabled:!view.preview})),
          h('section',{className:'sw-section'},h('div',{className:'sw-row'},h('label',null,'天空浓度'),h('span',{className:'sw-muted'},`${state.intensity}%`)),
            h('input',{type:'range',min:25,max:100,value:state.intensity,'aria-label':'天空浓度',onChange:event=>controller.intensity(event.target.value)}),
            h('div',{className:'sw-range-labels'},h('span',null,'更安静'),h('span',null,'更鲜明')),
            h('label',{className:'sw-row',style:{marginTop:18}},h('span',null,'云朵缓慢飘动'),h('input',{type:'checkbox',className:'sw-checkbox',checked:state.motion,onChange:event=>controller.motion(event.target.checked)})),
            h('p',{className:'sw-help'},'系统开启减少动态效果时，云朵会保持静止。切走页面后动效自动暂停。')),
          h('div',{className:'sw-section'},button('抬头看一会儿 ↗',openLook,{className:'sw-button sw-live'})),
          state.notice?h('p',{className:'sw-alert',role:'status'},state.notice):null,
          h('p',{className:'sw-note'},'半圆表示日出到日落的时间进度。天空为晴天插画，天文时间为估算。位置与偏好仅保存在本机；定位只在点击时请求。')
        );
      }
      function ImmersiveScene() {
        const ref=React.useRef(null);
        React.useLayoutEffect(()=>{if(ref.current)return controller.attachScene(ref.current);},[]);
        return h('div',{className:'sw-immersive-scene',ref,'data-expanded':''});
      }
      function Immersive() {
        const {view,state}=useSky(),ref=React.useRef(null);
        React.useEffect(()=>{ref.current?.focus({preventScroll:true});},[]);
        return h('div',{className:'sw-immersive',role:'dialog','aria-modal':'true','aria-label':'抬头看看天空',tabIndex:-1,ref},h(ImmersiveScene),
          h('div',{className:'sw-look-settings'},
            h('button',{type:'button',className:'sw-sky-action sw-settings-icon',onClick:()=>controller.panel(!state.panelOpen),'aria-label':'天空设置',title:'天空设置'},
              h('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none','aria-hidden':'true'},
                h('path',{d:'M4 7h10m4 0h2M4 17h2m4 0h10M14 4v6M7 14v6',stroke:'currentColor',strokeWidth:1.6,strokeLinecap:'round'})))),
          h('div',{className:'sw-look-copy'},h('h2',null,'抬头，看看天。')),
          h('div',{className:'sw-look-actions'},button('回到工作 ↙',()=>controller.looking(false),{className:'sw-sky-action'}),
            h('button',{type:'button',className:'sw-sky-action sw-day-play',onClick:controller.play,'aria-label':state.playback?'暂停一天预览':'看一天',title:state.playback?'暂停一天预览':'看一天'},
              h('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none','aria-hidden':'true'},state.playback?h('path',{d:'M9 5v14M15 5v14',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round'}):h('path',{d:'M8 5l11 7-11 7Z',stroke:'currentColor',strokeWidth:1.5,strokeLinejoin:'round'})))));
      }
      function Overlay() {
        const {state,view}=useSky();if(!view)return null;
        return h('div',{className:'sw-ui',style:{pointerEvents:'none'}},
          state.looking&&state.enabled?h(Immersive):null,
          !state.looking?h('div',{className:'sw-dock'},
            h('button',{type:'button',className:'sw-pill',onClick:()=>controller.panel(!state.panelOpen),'aria-expanded':state.panelOpen,'aria-label':'打开天空窗设置'},
              h('span',{className:'sw-sun-dot'}),h('span',null,'天空窗'),state.enabled?h(React.Fragment,null,h('span',{className:'sw-dock-divider'}),h('span',{className:'sw-dock-time'},solar.formatTime(view.minutes)),h('span',{className:'sw-dock-city sw-muted'},view.city.name)):h('span',{className:'sw-muted'},'已关闭')),
            state.enabled?button('抬头看看 ↗',()=>controller.looking(true),{className:'sw-pill'}):null):null,
          state.enabled&&state.looking&&view.preview?h('div',{className:'sw-preview sw-over-look'},h('span',null,`${state.playback?'一天掠过':'时间预览'} · ${solar.formatTime(view.minutes)}`),state.playback?button('暂停',controller.pause):null,button('回到此刻',controller.live,{className:'sw-return-now'})):null,
          state.panelOpen?h('div',{className:`sw-popover${state.looking?' sw-over-look':''}`,role:'dialog','aria-label':'天空设置'},h('div',{className:'sw-popover-head'},h('h2',null,'天空设置'),button('×',()=>controller.panel(false),{className:'sw-close','aria-label':'关闭天空设置'})),h(Controls)):null);
      }
      function SettingsSection(props) {return h('section',{className:'sw-settings'},h('h2',null,'天空窗'),h(Controls,{closeNative:props.close}));}
      ctx.effect(()=>{controller.start();return()=>{controller.dispose();registrations.reverse().forEach(dispose=>dispose());};},'sky-window: local sky, theme and lifecycle');
      ctx.slots.inject('shell.overlay',()=>ctx.slots.register({name:'shell.overlay',id:'sky-window',order:40},Overlay));
      ctx.slots.inject('settings.section',()=>ctx.slots.register({name:'settings.section',id:'sky-window',order:40,label:()=> '天空窗'},SettingsSection));
    }
    return {inject:['slots','theme'],apply};
  }
});
