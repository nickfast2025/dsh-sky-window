'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

// Contract smoke tests execute the browser module against a small host
// boundary. They never mount or replace the native conversation/sidebar slots.
function host(saved) {
  const effects=[],seats=new Map(),events=new Map(),frames=new Map(),storage=new Map(),microtasks=[];
  const registered=new Map([['light',{id:'light',colorScheme:'light',tokens:{}}],['dark',{id:'dark',colorScheme:'dark',tokens:{}}]]);
  let preference='system',layer=null,overrideCount=0,themeWrites=0,frame=0,clock=0,module;
  if(saved)storage.set('dsh-sky-window.preferences.v1',JSON.stringify(saved));
  class Element {
    constructor(tag='div'){this.tagName=tag;this.children=[];this.attributes=new Map();this.style={setProperty(name,value){this[name]=value;}};this.inert=false;this.isConnected=true;}
    append(node){this.children.push(node);node.parentElement=this;}
    prepend(node){this.children.unshift(node);node.parentElement=this;}
    remove(){this.isConnected=false;this.parentElement.children=this.parentElement.children.filter(child=>child!==this);}
    setAttribute(name,value){this.attributes.set(name,value);}
    removeAttribute(name){this.attributes.delete(name);}
    toggleAttribute(name,value){if(value)this.setAttribute(name,'');else this.removeAttribute(name);}
    getBoundingClientRect(){return {width:280};}
    focus(){document.activeElement=this;}
    attachShadow(){
      const found=new Map();
      this.shadowRoot={innerHTML:'',querySelector(selector){
        assert.ok(new RegExp(`class="[^"]*\\b${selector.slice(1)}\\b`).test(this.innerHTML),`Scene asset contains ${selector}`);
        if(!found.has(selector))found.set(selector,new Element());return found.get(selector);
      }};return this.shadowRoot;
    }
  }
  const native=new Element(),overlay=new Element(),frameNode=new Element();frameNode.append(native);frameNode.append(overlay);
  const document={body:new Element('body'),head:new Element('head'),hidden:false,activeElement:native,
    createElement:tag=>new Element(tag),querySelector:selector=>selector==='[data-shell-overlay]'?overlay:selector==='.pI_x6G_sidebarCol'?native:null,
    addEventListener(){},removeEventListener(){}};
  const snapshot=()=>({preference,themes:[...registered.values()],active:registered.get(preference==='system'?'light':preference)});
  const emit=()=>{for(const listener of events.get('theme/change')||[])listener(snapshot());};
  const ctx={
    effect(callback){effects.push(callback());},
    on(name,callback){if(!events.has(name))events.set(name,new Set());events.get(name).add(callback);return()=>events.get(name).delete(callback);},
    slots:{inject(name,callback){effects.push(callback());},register(options,Component){assert.ok(options.id);seats.set(options.name,{options,Component});return()=>seats.delete(options.name);}},
    theme:{getTheme:snapshot,setTheme(id){assert.ok(id==='system'||registered.has(id));preference=id;themeWrites++;emit();},
      register(theme){assert.equal(registered.has(theme.id),false);registered.set(theme.id,theme);emit();return()=>{registered.delete(theme.id);if(preference===theme.id)preference='system';emit();};},
      overrideTokens(source,tokens){assert.equal(source,'dsh-sky-window');Object.values(tokens).forEach(value=>{assert.equal(typeof value.light,'string');assert.equal(typeof value.dark,'string');});const own={tokens};layer=own;overrideCount++;emit();return()=>{if(layer===own){layer=null;emit();}};}}
  };
  const React={Fragment:Symbol('Fragment'),createElement(type,props,...children){return {type,props:{...props,children}};},useSyncExternalStore(){},useRef:()=>({current:null}),useEffect(){},useLayoutEffect(){}};
  const fixedTime=Date.parse('2026-10-17T04:00:00Z');
  class FixedDate extends Date{constructor(...args){super(...(args.length?args:[fixedTime]));}}
  const window={__ModuleLoader__:{load(spec){assert.equal(spec.id,'dsh-sky-window');module=spec.factory(name=>{assert.equal(name,'react');return React;});}},addEventListener(){},removeEventListener(){}};
  const environment=vm.createContext({window,document,Date:FixedDate,Intl,console,navigator:{},matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}}),
    performance:{now:()=>clock},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)},
    setInterval:()=>1,clearInterval(){},requestAnimationFrame:callback=>{frames.set(++frame,callback);return frame;},cancelAnimationFrame:id=>frames.delete(id),queueMicrotask:callback=>microtasks.push(callback)});
  // Compose assets in memory, so source changes can be checked before the
  // coordinating agent builds/reloads the shared running browser artifact.
  const read=filename=>fs.readFileSync(path.join(__dirname,filename),'utf8');
  // These host-contract tests do not decode decorative images. The packaging
  // gate independently verifies the built PNG bytes against the source asset.
  const scene=read('scene.html');
  const source=read('client.js').replace('/*__SOLAR_SOURCE__*/',read('../../sky-clock/solar.js'))
    .replace('__UI_CSS__',JSON.stringify(read('ui.css'))).replace('__SCENE_HTML__',JSON.stringify(scene)).replace('__SCENE_CSS__',JSON.stringify(read('scene.css')));
  vm.runInContext(source,environment);
  module.apply(ctx);
  function render(node){if(node==null||typeof node!=='object')return node;if(Array.isArray(node))return node.flatMap(item=>[render(item)]);if(typeof node.type==='function')return render(node.type(node.props));return {...node,props:{...node.props,children:node.props.children.map(render)}};}
  function walk(node){if(node==null||typeof node!=='object')return [];if(Array.isArray(node))return node.flatMap(walk);return [node,...node.props.children.flatMap(walk)];}
  function text(node){if(node==null)return '';if(typeof node!=='object')return String(node);if(Array.isArray(node))return node.map(text).join('');return node.props.children.map(text).join('');}
  const tree=seat=>render(seats.get(seat).Component({close(){}}));
  return {ctx,seats,registered,native,document,frames,tree,text,
    control(label,seat='settings.section'){return walk(tree(seat)).find(node=>node.props['aria-label']===label);},
    button(label,seat='settings.section'){const button=walk(tree(seat)).find(node=>node.type==='button'&&text(node)===label);assert.ok(button,`Button ${label}`);return button;},
    checkboxes(){return walk(tree('settings.section')).filter(node=>node.type==='input'&&node.props.type==='checkbox');},
    get preference(){return preference;},get tokens(){return layer?.tokens;},get overrideCount(){return overrideCount;},get themeWrites(){return themeWrites;},
    advance(ms){clock+=ms;const callbacks=[...frames.values()];frames.clear();callbacks.forEach(callback=>callback(clock));},
    flushMicrotasks(){while(microtasks.length)microtasks.shift()();},
    dispose(){effects.reverse().forEach(dispose=>dispose?.());}
  };
}

test('real DSH loader contributes only additive slots and restores theme on disable/unload',()=>{
  const app=host();
  assert.deepEqual([...app.seats.keys()].sort(),['settings.section','shell.overlay']);
  assert.equal(app.preference,'sky-day');
  assert.ok(app.tokens['--dsw-specific-input-major']);
  assert.equal(app.document.body.attributes.get('data-sky-window'),'on');
  assert.equal(app.overrideCount,1,'self theme/change events do not recursively reapply');
  app.checkboxes()[0].props.onChange({target:{checked:false}});
  assert.equal(app.preference,'system');assert.equal(app.tokens,undefined);
  assert.equal(app.document.body.attributes.has('data-sky-window'),false);
  assert.equal(app.document.body.children.length,0);
  app.checkboxes()[0].props.onChange({target:{checked:true}});
  assert.equal(app.preference,'sky-day');
  app.dispose();
  assert.equal(app.preference,'system');assert.equal(app.tokens,undefined);
  assert.equal(app.document.head.children.length,0);
  assert.equal(app.registered.has('sky-day'),false);assert.equal(app.registered.has('sky-night'),false);
});

test('city timezone, DST preview, night scheme and restoring live operate through controls',()=>{
  const app=host();
  app.control('天空所在城市').props.onChange({target:{value:'newyork'}});
  assert.equal(app.control('预览当地时间').props.value,0);
  app.control('预览日期').props.onChange({target:{value:'2026-03-08'}});
  app.control('预览当地时间').props.onChange({target:{value:'150'}});
  assert.equal(app.control('预览当地时间').props.value,210);
  assert.match(app.text(app.tree('shell.overlay')),/03:30/);
  app.button('夜空').props.onClick();assert.equal(app.preference,'sky-night');
  app.button('回到此刻的天空').props.onClick();
  assert.equal(app.control('预览当地时间').props.value,0);
  app.dispose();
});

test('look-up keeps native surfaces mounted and restores inert state; playback pauses',()=>{
  const app=host();
  app.button('抬头看一会儿 ↗').props.onClick();
  assert.equal(app.native.inert,true);assert.equal(app.native.isConnected,true);
  app.control('看一天','shell.overlay').props.onClick();
  assert.equal(app.frames.size,1);app.advance(6000);
  assert.match(app.text(app.tree('shell.overlay')),/一天掠过/);
  app.button('暂停','shell.overlay').props.onClick();
  assert.equal(app.frames.size,0);assert.match(app.text(app.tree('shell.overlay')),/时间预览/);
  app.button('回到工作 ↙','shell.overlay').props.onClick();assert.equal(app.native.inert,false);
  assert.doesNotMatch(app.text(app.tree('shell.overlay')),/时间预览|回到此刻/,'work view keeps the chosen sky without preview chrome');
  app.button('抬头看看 ↗','shell.overlay').props.onClick();
  assert.match(app.text(app.tree('shell.overlay')),/时间预览/);
  assert.match(app.text(app.tree('shell.overlay')),/回到此刻/);
  assert.doesNotMatch(app.text(app.tree('shell.overlay')),/天空窗 ·/,'immersive sky leaves the upper-left corner open');
  app.dispose();
});

test('corrupt city preferences safely fall back',()=>{
  const app=host({city:'__proto__'});
  assert.equal(app.control('天空所在城市').props.value,'shanghai');
  app.dispose();
});

test('asynchronous host theme hydration preserves enabled sky and restores the latest native preference on close',()=>{
  const app=host();
  assert.equal(app.preference,'sky-day');
  app.ctx.theme.setTheme('system');
  assert.equal(app.checkboxes()[0].props.checked,true);
  assert.ok(app.tokens,'host hydration keeps the sky layer');
  app.flushMicrotasks();
  assert.equal(app.preference,'sky-day');
  assert.equal(app.checkboxes()[0].props.checked,true);
  app.ctx.theme.setTheme('dark');app.flushMicrotasks();
  assert.equal(app.preference,'sky-day');
  app.checkboxes()[0].props.onChange({target:{checked:false}});
  assert.equal(app.preference,'dark');assert.equal(app.tokens,undefined);
  assert.equal(app.checkboxes()[0].props.checked,false);
  app.ctx.theme.setTheme('light');app.flushMicrotasks();
  assert.equal(app.preference,'light','disabled sky leaves the native theme alone');
  app.dispose();assert.equal(app.preference,'light');
});

test('queued theme reapply cannot re-enable sky after an explicit close or unload',()=>{
  const app=host();
  app.ctx.theme.setTheme('dark');
  app.checkboxes()[0].props.onChange({target:{checked:false}});
  app.flushMicrotasks();
  assert.equal(app.preference,'dark');assert.equal(app.tokens,undefined);
  app.dispose();assert.equal(app.preference,'dark');
  const unloading=host();unloading.ctx.theme.setTheme('dark');unloading.dispose();unloading.flushMicrotasks();
  assert.equal(unloading.preference,'dark');assert.equal(unloading.tokens,undefined);
});
