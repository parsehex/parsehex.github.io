import{h as n}from"./vue-tippy.esm-browser.ZDwAwoqY.js";/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),p=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,c,o)=>o?o.toUpperCase():c.toLowerCase()),y=t=>{const e=p(t);return e.charAt(0).toUpperCase()+e.slice(1)},g=(...t)=>t.filter((e,c,o)=>!!e&&e.trim()!==""&&o.indexOf(e)===c).join(" ").trim(),k=t=>t==="";/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=({name:t,iconNode:e,absoluteStrokeWidth:c,"absolute-stroke-width":o,strokeWidth:a,"stroke-width":l,size:s=r.width,color:w=r.stroke,...h},{slots:d})=>n("svg",{...r,...h,width:s,height:s,stroke:w,"stroke-width":k(c)||k(o)||c===!0||o===!0?Number(a||l||r["stroke-width"])*24/Number(s):a||l||r["stroke-width"],class:g("lucide",h.class,...t?[`lucide-${u(y(t))}-icon`,`lucide-${u(t)}`]:["lucide-icon"])},[...e.map(m=>n(...m)),...d.default?[d.default()]:[]]);/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=(t,e)=>(c,{slots:o,attrs:a})=>n(C,{...a,...c,iconNode:e,name:t},o);/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=i("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=i("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-vue-next v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=i("github",[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]]);export{x as C,M as G,f as a,i as c};
