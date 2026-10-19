(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const root = document.documentElement;
  const app = $('app');
  const solar = globalThis.SkySolar;
  const storageKey = 'sky-window.preferences.v2';
  const cities = {
    shanghai: { name:'上海', latitude:31.2304, longitude:121.4737, timeZone:'Asia/Shanghai' },
    beijing: { name:'北京', latitude:39.9042, longitude:116.4074, timeZone:'Asia/Shanghai' },
    chengdu: { name:'成都', latitude:30.5728, longitude:104.0668, timeZone:'Asia/Shanghai' },
    shenzhen: { name:'深圳', latitude:22.5431, longitude:114.0579, timeZone:'Asia/Shanghai' },
    tokyo: { name:'东京', latitude:35.6762, longitude:139.6503, timeZone:'Asia/Tokyo' },
    london: { name:'伦敦', latitude:51.5072, longitude:-0.1276, timeZone:'Europe/London' },
    newyork: { name:'纽约', latitude:40.7128, longitude:-74.0060, timeZone:'America/New_York' },
    sydney: { name:'悉尼', latitude:-33.8688, longitude:151.2093, timeZone:'Australia/Sydney' }
  };
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const state = {
    city:'shanghai', custom:null, intensity:75, motion:!reducedMotion.matches,
    minutes:null, date:null, looking:false, messages:[], playback:null, focusBeforeLook:null
  };
  const timesCache = new Map();
  let currentContext;
  let toastTimer;
  let lastFrame = 0;

  const clamp = (value, min=0, max=1) => Math.max(min, Math.min(max, value));
  const smooth = (min, max, value) => { const x=clamp((value-min)/(max-min)); return x*x*(3-2*x); };
  const dateKey = parts => `${parts.year}-${String(parts.month).padStart(2,'0')}-${String(parts.day).padStart(2,'0')}`;
  const rgb = hex => hex.match(/[a-f\d]{2}/gi).map(value => parseInt(value,16));
  const mix = (a,b,t) => a.map((value,index) => value+(b[index]-value)*clamp(t));
  const cssColor = values => `rgb(${values.map(value=>Math.round(value)).join(', ')})`;
  const luminance = values => values.map(value => { const x=value/255; return x<=.04045 ? x/12.92 : ((x+.055)/1.055)**2.4; }).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);
  const contrast = (a,b) => { const x=luminance(a),y=luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
  function readable(preferred, background, minimum=4.6) {
    if (contrast(preferred,background)>=minimum) return preferred;
    const target=contrast([0,0,0],background)>contrast([255,255,255],background)?[0,0,0]:[255,255,255];
    let low=0,high=1;
    for(let i=0;i<14;i++){const middle=(low+high)/2;if(contrast(mix(preferred,target,middle),background)<minimum)low=middle;else high=middle;}
    return mix(preferred,target,high);
  }

  function loadPreferences() {
    try {
      const saved=JSON.parse(localStorage.getItem(storageKey)||'null');
      if(!saved)return;
      if(saved.custom && Number.isFinite(saved.custom.latitude) && Math.abs(saved.custom.latitude)<=90 && Number.isFinite(saved.custom.longitude) && Math.abs(saved.custom.longitude)<=180) {
        new Intl.DateTimeFormat('en',{timeZone:saved.custom.timeZone});
        state.custom={name:'当前位置',latitude:saved.custom.latitude,longitude:saved.custom.longitude,timeZone:saved.custom.timeZone};
      }
      if(cities[saved.city] || (saved.city==='custom'&&state.custom))state.city=saved.city;
      if(Number.isFinite(saved.intensity))state.intensity=clamp(saved.intensity,25,100);
      if(typeof saved.motion==='boolean')state.motion=saved.motion&&!reducedMotion.matches;
    } catch { /* A blocked storage API or old preference must not stop the sky. */ }
  }
  function savePreferences() {
    try { localStorage.setItem(storageKey,JSON.stringify({city:state.city,custom:state.custom,intensity:state.intensity,motion:state.motion})); } catch { /* Private/file browsing may disable storage. */ }
  }
  const location = () => state.city==='custom' ? state.custom : cities[state.city];
  function sunTimes(parts,city=location()) {
    const key=`${city.latitude},${city.longitude},${city.timeZone},${dateKey(parts)}`;
    if(!timesCache.has(key)) {
      if(timesCache.size>40)timesCache.clear();
      timesCache.set(key,solar.getSunTimes(parts,city.latitude,city.longitude,city.timeZone));
    }
    return timesCache.get(key);
  }
  function nextDay(parts) {
    const date=new Date(Date.UTC(parts.year,parts.month-1,parts.day+1));
    return {year:date.getUTCFullYear(),month:date.getUTCMonth()+1,day:date.getUTCDate()};
  }
  function getContext() {
    const city=location(),now=new Date(),local=solar.getZonedDateParts(now,city.timeZone);
    const requestedParts=state.date||local,requestedMinutes=state.minutes??(local.hour*60+local.minute+local.second/60);
    const instant=state.minutes===null&&!state.date?now:solar.dateAtMinutes(requestedParts,requestedMinutes,city.timeZone);
    // A skipped DST wall time moves forward; labels and atmosphere use that same instant.
    const parts=solar.getZonedDateParts(instant,city.timeZone),minutes=parts.hour*60+parts.minute+parts.second/60;
    const times=sunTimes(parts,city),position=solar.getSunPosition(instant,city.latitude,city.longitude);
    return {city,parts,minutes,instant,times,altitude:position.altitude,morning:minutes<times.noon,preview:state.minutes!==null||!!state.date};
  }

  // Interpolated atmospheric stops use solar elevation, so long summer evenings
  // and short winter dawns inherit their natural duration.
  const morningStops = [
    [-18,'17263e','35435b','636d81','506176','64768a','3f5863','315159','294b50'],
    [-10,'454d75','8989a5','d4afb2','9291aa','c5b8c1','8b929c','71878c','5f7b7e'],
    [-3,'9695b4','dcbbc0','f8d7b4','d4bdc4','ffe5d0','a5b5ad','8da8a1','7f9d95'],
    [4,'a8bfce','e3d4ce','f5dfbd','e0d5d1','fff4dc','b3c3af','91b2a1','7aa697'],
    [14,'9bc6d9','d3e5e4','eee7ca','dcebe5','fffdf0','a5beb7','8aafa2','78a393'],
    [35,'8abbd4','c5e1e7','e8e6d1','dfede9','fffef3','a4beba','8bb0a8','79a59c']
  ];
  const eveningStops = [
    [-18,'17263e','35435b','636d81','506176','64768a','3f5863','315159','294b50'],
    [-10,'4a4c70','8d819b','d8a4ad','91829b','c6a5b0','8b8a96','717d88','607681'],
    [-3,'8f849e','d8acb4','f1bf9f','c9a5b3','f5cbb9','b0a9a4','929e97','7d948a'],
    [4,'a2b5c8','e2c6c2','f5d4a8','e0c3bf','ffe3c5','b5b7a7','a1ad94','889f87'],
    [14,'9bc6d9','d3e5e4','eee7ca','dcebe5','fffdf0','a5beb7','8aafa2','78a393'],
    [35,'8abbd4','c5e1e7','e8e6d1','dfede9','fffef3','a4beba','8bb0a8','79a59c']
  ];
  function atmosphere(context) {
    function sample(stops) {
      let low=stops[0],high=stops.at(-1);
      if(context.altitude<=low[0])high=low;
      else if(context.altitude>=high[0])low=high;
      else for(let i=1;i<stops.length;i++)if(context.altitude<stops[i][0]){low=stops[i-1];high=stops[i];break;}
      const t=high===low?0:smooth(low[0],high[0],context.altitude);
      return low.slice(1).map((color,index)=>mix(rgb(color),rgb(high[index+1]),t));
    }
    const am=sample(morningStops),pm=sample(eveningStops);
    const eveningMix=.5+.5*Math.sin((context.minutes-context.times.noon)*Math.PI/720);
    const keys=['--sky-top','--sky-mid','--sky-low','--cloud','--cloud-top','--hill-far','--hill-mid','--hill-near'];
    const sky=keys.map((key,index)=>{const color=mix(am[index],pm[index],eveningMix);root.style.setProperty(key,cssColor(color));return color;});
    const night=1-smooth(-10,4,context.altitude);
    // The sky fades continuously; working surfaces keep a clear light/dark
    // palette. Blending ivory and navy for the entire dawn made muddy grey cards.
    const uiNight=context.altitude<-8?1:0;
    const warmTone=Math.exp(-(((context.altitude-1)/10)**2));
    const daySurface=mix(rgb('f5f8f3'),rgb('fff6ec'),warmTone*.8);
    const daySidebar=mix(rgb('edf3ee'),rgb('f4eadd'),warmTone*.8);
    const surface=mix(daySurface,rgb('202e3d'),uiNight),sidebar=mix(daySidebar,rgb('1c2c3b'),uiNight);
    const rawInk=mix(rgb('263f49'),rgb('e3ece5'),uiNight),rawSecondary=mix(rgb('526a73'),rgb('b1c3bd'),uiNight);
    function workingInk(preferred) {
      const adjusted=readable(preferred,sidebar);
      return contrast(adjusted,surface)>=4.6?adjusted:readable(adjusted,surface);
    }
    const ink=workingInk(rawInk),secondary=workingInk(rawSecondary),muted=workingInk(mix(rgb('637982'),rgb('96afa9'),uiNight));
    const accent=readable(mix(rgb('315d62'),rgb('b9d5c7'),uiNight),surface);
    const sceneInk=mix(rgb('263f49'),rgb('e3ece5'),night),sceneSecondary=mix(rgb('526a73'),rgb('b1c3bd'),night);
    const outside=mix(sky[2],sky[6],.16);
    const properties={
      '--panel':`rgba(${surface.map(Math.round).join(',')},.96)`, '--panel-solid':cssColor(surface),
      '--sidebar':`rgba(${sidebar.map(Math.round).join(',')},.96)`, '--ink':cssColor(ink),
      '--secondary':cssColor(secondary),'--muted':cssColor(muted),'--accent':cssColor(accent),
      '--accent-ink':cssColor(readable(surface,accent)), '--line':`rgba(${ink.map(Math.round).join(',')},.13)`,
      '--highlight':uiNight?'rgba(205,225,224,.16)':'rgba(255,255,255,.68)',
      '--hover':uiNight?'rgba(201,222,221,.065)':'rgba(255,255,255,.38)',
      '--code-bg':cssColor(mix(surface,uiNight?[0,0,0]:rgb('b7ccc2'),.14)),
      '--code-ink':cssColor(ink), '--scene-ink':cssColor(readable(sceneInk,outside)),
      '--scene-muted':cssColor(readable(sceneSecondary,outside)), '--header-ink':cssColor(readable(sceneSecondary,sky[0])),
      '--nightness':night.toFixed(4), '--stars':(1-smooth(-14,-5,context.altitude)).toFixed(4),
      '--moon-visibility':(1-smooth(-10,-4,context.altitude)).toFixed(4),
      '--warmth':(Math.exp(-(((context.altitude-1)/10)**2))*.55).toFixed(4),
      '--intensity':state.intensity/100
    };
    Object.entries(properties).forEach(([key,value])=>root.style.setProperty(key,value));
    root.style.colorScheme=uiNight?'dark':'light';
  }

  function phaseCopy(context) {
    if(context.times.polar==='day')return {label:'极昼，长长的日光',title:'太阳还在这片天空里。',description:'这里的白昼很长，光也慢慢地走。',detail:'今天没有日出日落，太阳整日留在地平线上方。'};
    if(context.times.polar==='night')return {label:'极夜，也在流动',title:'长夜里，也有天空。',description:'天空也有自己的节奏，今天让它静静陪着你。',detail:'今天没有太阳升起。地平线附近仍可能有短暂的暮光。'};
    if(context.altitude<-8)return {label:'月色，安静地陪着',title:'夜深了，天空还在。',description:'把屏幕调柔一点，给思绪留一片安静的夜空。',detail:'月亮和星星留在这里。想歇一会儿，就看一会儿。'};
    if(context.altitude<7&&context.morning)return {label:'晨光，慢慢铺开',title:'早安，天空醒来了。',description:'日光正在一点点靠近，今天也可以慢慢开始。',detail:'地平线先亮了起来，云朵也染上一点暖色。'};
    if(context.altitude<7&&!context.morning)return {label:'晚霞，正在经过',title:'先停一会儿，看看晚霞。',description:'忙碌之间，也留意一下今天最后一段暖光。',detail:context.altitude<-.833?'太阳已经落下，云上的余晖还会再停留一会儿。':'太阳正慢慢走向地平线，光也变得柔软了。'};
    return {label:'晴空，正好',title:'今天，也抬头看看天。',description:'把思路交给这里，给目光留一片天空。',detail:'云朵走得很慢。你也可以，先不用着急。'};
  }
  function duration(minutes) {const value=Math.max(0,Math.round(minutes));return value>=60?`${Math.floor(value/60)} 小时 ${value%60} 分钟`:`${value} 分钟`;}
  function skyStatus(context) {
    const {times,minutes,parts}=context,fmt=solar.formatTime;
    if(times.polar==='day')return '极昼 · 太阳整日留在地平线上方';
    if(times.polar==='night')return '极夜 · 天空也有自己的漫长夜晚';
    if(times.sunrise!==null&&minutes<times.sunrise)return `日出 ${fmt(times.sunrise)} · 还有 ${duration(times.sunrise-minutes)}`;
    if(times.sunset!==null&&minutes<times.sunset)return `日落 ${fmt(times.sunset)} · 白昼还剩 ${duration(times.sunset-minutes)}`;
    if(context.altitude>-8)return `日落 ${fmt(times.sunset)} · 余晖慢慢散去`;
    const tomorrow=sunTimes(nextDay(parts));
    return tomorrow.sunrise!==null?`明早 ${fmt(tomorrow.sunrise)} 日出 · 今晚也有星光`:'夜色正安静地流动';
  }
  function syncCelestial(element,visible) {
    element.setAttribute('tabindex',visible?'0':'-1');
    element.setAttribute('aria-hidden',visible?'false':'true');
    element.style.pointerEvents=visible?'all':'none';
  }
  function render() {
    const context=currentContext=getContext(),copy=phaseCopy(context),fmt=solar.formatTime;
    atmosphere(context);
    const {times,minutes}=context;
    const hasEvents=times.sunrise!==null&&times.sunset!==null&&times.sunset>times.sunrise;
    let progress=hasEvents?(minutes-times.sunrise)/(times.sunset-times.sunrise):((minutes-times.noon)/1440+.5);
    progress=clamp(progress,-.12,1.12);
    const angle=Math.PI*(1-progress);
    const x=times.polar==='day'?500+270*Math.sin((minutes-times.noon)*Math.PI/720):500+350*Math.cos(angle);
    const y=times.polar==='day'?245-155*clamp(context.altitude/45):315-252*Math.sin(angle);
    $('sunPosition').style.transform=`translate(${x.toFixed(3)}px,${y.toFixed(3)}px)`;
    const sunVisibility=times.polar==='day'?1:times.polar==='night'?0:smooth(-3,-.7,context.altitude);
    root.style.setProperty('--sun-visibility',sunVisibility.toFixed(4));
    root.style.setProperty('--light-x',`${(x/10).toFixed(2)}%`);
    syncCelestial($('sunPosition'),sunVisibility>.05);
    syncCelestial($('moonPosition'),1-smooth(-10,-4,context.altitude)>.05);
    $('orbitProgress').style.strokeDasharray=`${clamp(progress)} 1`;
    $('sunriseLabel').textContent=$('sunriseCard').textContent=fmt(times.sunrise);
    $('sunsetLabel').textContent=$('sunsetCard').textContent=fmt(times.sunset);
    $('headerTime').textContent=$('previewTimeValue').textContent=fmt(minutes);
    $('headerCity').textContent=context.city.name;
    $('phaseLabel').textContent=$('expandedPhase').textContent=copy.label;
    $('greeting').textContent=copy.title;
    $('skyDescription').textContent=copy.description;
    $('lookUpTitle').textContent=copy.title;
    $('lookUpDetail').textContent=copy.detail;
    $('skyStatusText').textContent=skyStatus(context);
    $('orbitCenter').textContent=times.polar==='day'?'极昼 · 全天有光':times.polar==='night'?'极夜 · 等待下一次日出':context.altitude<-8?'星光之下，时间慢慢走':'每一刻，都有自己的光';
    $('expandedDate').textContent=new Intl.DateTimeFormat('zh-CN',{timeZone:context.city.timeZone,month:'long',day:'numeric',weekday:'long'}).format(context.instant);
    $('locationHelp').textContent=`${context.city.timeZone} · ${state.city==='custom'?'定位使用设备时区':'按城市当地时间计算'}`;
    $('dayLength').textContent=times.polar==='day'?'全天日照':times.polar==='night'?'全天无日出':hasEvents?`白昼 ${duration(times.sunset-times.sunrise)}`:'今日太阳事件不完整';
    $('timeSlider').value=Math.floor(minutes);
    $('previewDate').value=dateKey(context.parts);
    $('previewBanner').hidden=!context.preview;
    $('previewText').textContent=`${state.playback?'一天掠过':'时间预览'} · ${fmt(minutes)}`;
    $('pausePlayback').hidden=!state.playback;
    $('liveButton').textContent=context.preview?'回到此刻的天空':'此刻，正在实时流动';
    root.classList.toggle('is-previewing',context.preview);
    root.classList.toggle('is-playing',!!state.playback);
    root.classList.toggle('is-polar',!!times.polar);
    root.classList.toggle('motion-paused',!state.motion||reducedMotion.matches);
  }

  function toast(message) {
    clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;
    toastTimer=setTimeout(()=>$('toast').hidden=true,4000);
  }
  function openSettings() {stopPlayback();render();const dialog=$('settingsDialog');if(!dialog.open)dialog.showModal();}
  function closeSettings() {if($('settingsDialog').open)$('settingsDialog').close();}
  function setLooking(value,trigger) {
    if(!value&&state.playback){stopPlayback();render();}
    if(value&&!state.looking)state.focusBeforeLook=trigger||document.activeElement;
    state.looking=value;app.classList.toggle('is-looking-up',value);
    document.querySelector('.workspace').inert=value;
    $('lookUpUi').inert=!value;
    if(value)$('returnToWork').focus({preventScroll:true});
    else if(state.focusBeforeLook?.isConnected)state.focusBeforeLook.focus({preventScroll:true});
  }
  function stopPlayback() {
    if(!state.playback)return;
    cancelAnimationFrame(state.playback.frame);state.playback=null;
    $('playDay').querySelector('span').textContent='看一天';
    root.classList.remove('is-playing');
  }
  function restoreLive() {
    stopPlayback();state.minutes=null;state.date=null;render();
  }
  function setPreview(minutes) {
    stopPlayback();if(!state.date)state.date={...currentContext.parts};
    state.minutes=clamp(minutes,0,1439);render();
  }
  function playDay() {
    if(state.playback){stopPlayback();render();return;}
    state.date={...currentContext.parts};state.minutes=0;
    state.playback={started:performance.now(),frame:0};lastFrame=0;
    $('playDay').querySelector('span').textContent='暂停';
    closeSettings();setLooking(true,$('lookUpButton'));
    render();
    function tick(now) {
      if(!state.playback)return;
      if(now-lastFrame>=65){state.minutes=Math.min(1439,(now-state.playback.started)/24000*1440);render();lastFrame=now;}
      if(state.minutes>=1439){stopPlayback();render();return;}
      state.playback.frame=requestAnimationFrame(tick);
    }
    state.playback.frame=requestAnimationFrame(tick);
  }

  const responses={
    idea:{prompt:'我想给长时间在室内工作的 AI worker，留一片能感受时间的天空。',paragraphs:['可以从一个很轻的体验开始：工作一阵，再抬头时，发现光线已经变了。','把太阳的位置留在背景里，让云朵缓慢经过；输入框和正文保持安稳。人可以继续专注，也能感到白昼正在流动。'],list:['晨间：地平线先亮，云朵慢慢染上暖色。','白天：太阳沿半圆移动，轨道在对话时淡下去。','傍晚：日落之后，云上的余晖仍停留片刻。','夜间：界面一起变暗，留下一弯月亮与少量星光。']},
    code:{prompt:'给我一小段代码，看看白天和夜间的阅读效果。',paragraphs:['试着打开右上角的天空设置，在日出、正午、日落和夜空之间切换。文字、代码块和输入框会跟随光线调整。'],code:true},
    local:{paragraphs:['这里已显示你刚刚写下的内容。你可以继续输入，看看长对话里的文字、面板与天空是否舒服。','也可以点击右下角「抬头看看」，暂时展开完整天空，再回到这段对话。']}
  };
  function element(tag,className,text) {
    const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;
  }
  function addMessage(role,text,content) {
    const article=element('article',`message ${role}`),header=element('div','message-header');
    header.append(element('span','message-avatar',role==='user'?'G':'✦'),element('span','',role==='user'?'你':'天空窗'));
    if(role==='assistant')header.append(element('small','','本地演示'));
    const body=element('div','message-content');
    if(role==='user')body.textContent=text;
    else {
      content.paragraphs.forEach(text=>body.append(element('p','',text)));
      if(content.list){const list=element('ul');content.list.forEach(text=>list.append(element('li','',text)));body.append(list);}
      if(content.code){const pre=element('pre'),code=element('code');code.append(element('span','code-comment','// 让工作区，跟着天空慢慢变化\n'),element('span','code-key','function '),document.createTextNode('makeRoomForSky(time) {\n  '),element('span','code-key','const '),document.createTextNode('light = sky.at(time);\n\n  workspace.setTheme({\n    background: light.color,\n    readability: '),element('span','code-string','"always"'),document.createTextNode(',\n    motion: '),element('span','code-string','"gentle"'),document.createTextNode('\n  });\n}'));pre.append(code);body.append(pre);}
      body.append(element('p','demo-note','此回复为固定的本地示例，用于体验换肤；尚未连接 DSH 或模型。'));
    }
    article.append(header,body);$('thread').append(article);state.messages.push({role,text});
    app.classList.add('has-messages');$('thread').scrollTop=$('thread').scrollHeight;
  }
  function send(text,kind='local') {
    if(!text.trim())return;
    if(state.looking)setLooking(false);
    addMessage('user',text.trim());addMessage('assistant','',responses[kind]);
    $('messageInput').value='';$('messageInput').style.height='';$('sendButton').disabled=true;
  }
  function sample(kind) {send(responses[kind].prompt,kind);}
  function newChat() {
    stopPlayback();
    state.messages=[];$('thread').replaceChildren();app.classList.remove('has-messages');
    $('messageInput').value='';$('messageInput').style.height='';$('sendButton').disabled=true;
    if(state.looking)setLooking(false);$('messageInput').focus({preventScroll:true});render();
  }

  loadPreferences();
  if(state.custom)$('citySelect').querySelector('[value="custom"]').disabled=false;
  $('citySelect').value=state.city;
  $('intensitySlider').value=state.intensity;$('intensityValue').textContent=`${state.intensity}%`;
  $('motionToggle').checked=state.motion;
  $('lookUpUi').inert=true;
  $('previewDate').min='1900-01-01';$('previewDate').max='2100-12-31';

  for(let index=0;index<46;index++){
    const star=element('i',`star ${index%7===0?'twinkle':''}`),size=index%6===0?2:1;
    star.style.left=`${(index*61.73+7)%100}%`;star.style.top=`${(index*29.41+11)%87}%`;
    star.style.width=star.style.height=`${size}px`;
    star.style.setProperty('--star-opacity',(.24+(index%5)*.12).toFixed(2));star.style.setProperty('--delay',`${-index*.7}s`);
    $('stars').append(star);
  }
  ['openSettings','sidebarSettings','timeChip','skyStatus'].forEach(id=>$(id).addEventListener('click',openSettings));
  $('closeSettings').addEventListener('click',closeSettings);
  $('settingsDialog').addEventListener('click',event=>{if(event.target!==$('settingsDialog'))return;const rect=$('settingsDialog').getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeSettings();});
  ['lookUpButton','lookUpWelcome','sunPosition','moonPosition'].forEach(id=>{
    $(id).addEventListener('click',()=>setLooking(!state.looking,$(id)));
    if(id.endsWith('Position'))$(id).addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setLooking(!state.looking,$(id));}});
  });
  $('returnToWork').addEventListener('click',()=>{stopPlayback();setLooking(false);render();});
  $('citySelect').addEventListener('change',()=>{stopPlayback();state.city=$('citySelect').value;if(state.city==='custom'&&!state.custom)state.city='shanghai';state.minutes=null;state.date=null;savePreferences();render();});
  $('timeSlider').addEventListener('input',event=>setPreview(Number(event.target.value)));
  document.querySelectorAll('[data-moment]').forEach(button=>button.addEventListener('click',()=>{
    const times=currentContext.times,moment=button.dataset.moment;
    const minutes={sunrise:times.sunrise,noon:times.noon,sunset:times.sunset,night:22*60}[moment];
    if(minutes===null){toast('这个日期没有对应的日出或日落。');return;}setPreview(minutes);
  }));
  $('previewDate').addEventListener('change',event=>{
    const [year,month,day]=event.target.value.split('-').map(Number);
    if(!year||!month||!day||year<1900||year>2100){render();return;}
    stopPlayback();state.date={year,month,day};state.minutes=currentContext.minutes;render();
  });
  ['liveButton','restoreLive'].forEach(id=>$(id).addEventListener('click',restoreLive));
  $('pausePlayback').addEventListener('click',()=>{stopPlayback();render();});
  $('playDay').addEventListener('click',playDay);
  $('intensitySlider').addEventListener('input',event=>{state.intensity=Number(event.target.value);$('intensityValue').textContent=`${state.intensity}%`;root.style.setProperty('--intensity',state.intensity/100);savePreferences();});
  $('motionToggle').addEventListener('change',event=>{state.motion=event.target.checked;savePreferences();render();if(state.motion&&reducedMotion.matches)toast('系统已开启减少动态效果，云朵会保持静止。');});
  reducedMotion.addEventListener('change',()=>render());
  $('locateButton').addEventListener('click',()=>{
    if(!navigator.geolocation){$('locationHelp').textContent='此浏览器无法定位，可以直接选择城市。';return;}
    $('locateButton').disabled=true;$('locationHelp').textContent='正在等待位置授权…';
    navigator.geolocation.getCurrentPosition(position=>{
      state.custom={name:'当前位置',latitude:position.coords.latitude,longitude:position.coords.longitude,timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone};
      state.city='custom';state.minutes=null;state.date=null;stopPlayback();
      $('citySelect').querySelector('[value="custom"]').disabled=false;$('citySelect').value='custom';
      $('locateButton').disabled=false;savePreferences();render();toast('已切换到你所在的天空。');
    },()=>{$('locateButton').disabled=false;render();$('locationHelp').textContent='定位未成功，仍保留当前城市；也可以手动选择。';},{enableHighAccuracy:false,timeout:10000,maximumAge:3600000});
  });
  $('messageInput').addEventListener('input',()=>{const input=$('messageInput');$('sendButton').disabled=!input.value.trim();input.style.height='auto';input.style.height=`${Math.min(input.scrollHeight,150)}px`;});
  $('messageInput').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();send($('messageInput').value);}});
  $('chatForm').addEventListener('submit',event=>{event.preventDefault();send($('messageInput').value);});
  document.querySelectorAll('[data-prompt]').forEach(button=>button.addEventListener('click',()=>sample(button.dataset.prompt)));
  $('sampleCode').addEventListener('click',()=>sample('code'));
  $('sampleConversation').addEventListener('click',()=>{newChat();sample('idea');});
  ['newChat','homeButton'].forEach(id=>$(id).addEventListener('click',newChat));
  document.querySelector('.brand').addEventListener('click',event=>{event.preventDefault();newChat();});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!$('settingsDialog').open&&state.looking){stopPlayback();setLooking(false);render();}
    if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='n'&&!$('settingsDialog').open){event.preventDefault();newChat();}
  });
  document.addEventListener('visibilitychange',()=>{
    root.classList.toggle('page-hidden',document.hidden);
    if(document.hidden)stopPlayback();else render();
  });
  render();
  setInterval(()=>{if(!document.hidden&&!state.playback)render();},15000);
})();
