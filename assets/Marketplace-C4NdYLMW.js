import{e as ae,r as n,o as bt,c as Tt,p as Be,f as L,j as e,A as jt,P as _,h as I,a as G,q as Ve,s as It,t as Rt,R as Pt,v as Et,F as _t,D as Mt,w as At,x as _e,y as Dt,V as Ot,u as kt,z as Ae,E as Lt,G as Bt,b as $,N as Vt,U as Ht,n as De,H as Ft,I as Ut,J as Wt,L as we}from"./index-tCJOb0bq.js";import{c as Oe}from"./index-BdQq_4o_.js";import{u as Kt,T as zt,a as Gt,b as ye,c as Ce}from"./tabs-BobLoQyd.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $t=ae("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const He=ae("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qt=ae("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yt=ae("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xt=ae("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);function Zt(t){const r=n.useRef({value:t,previous:t});return n.useMemo(()=>(r.current.value!==t&&(r.current.previous=r.current.value,r.current.value=t),r.current.previous),[t])}var Jt=[" ","Enter","ArrowUp","ArrowDown"],Qt=[" ","Enter"],le="Select",[ue,pe,eo]=bt(le),[oe,_o]=Tt(le,[eo,Be]),fe=Be(),[to,q]=oe(le),[oo,no]=oe(le),Fe=t=>{const{__scopeSelect:r,children:o,open:a,defaultOpen:c,onOpenChange:p,value:l,defaultValue:i,onValueChange:s,dir:f,name:g,autoComplete:w,disabled:T,required:j,form:b}=t,d=fe(r),[x,y]=n.useState(null),[u,h]=n.useState(null),[M,A]=n.useState(!1),ne=Kt(f),[R=!1,O]=Ae({prop:a,defaultProp:c,onChange:p}),[W,X]=Ae({prop:l,defaultProp:i,onChange:s}),B=n.useRef(null),V=x?b||!!x.closest("form"):!0,[K,H]=n.useState(new Set),F=Array.from(K).map(P=>P.props.value).join(";");return e.jsx(Lt,{...d,children:e.jsxs(to,{required:j,scope:r,trigger:x,onTriggerChange:y,valueNode:u,onValueNodeChange:h,valueNodeHasChildren:M,onValueNodeHasChildrenChange:A,contentId:_e(),value:W,onValueChange:X,open:R,onOpenChange:O,dir:ne,triggerPointerDownPosRef:B,disabled:T,children:[e.jsx(ue.Provider,{scope:r,children:e.jsx(oo,{scope:t.__scopeSelect,onNativeOptionAdd:n.useCallback(P=>{H(k=>new Set(k).add(P))},[]),onNativeOptionRemove:n.useCallback(P=>{H(k=>{const U=new Set(k);return U.delete(P),U})},[]),children:o})}),V?e.jsxs(pt,{"aria-hidden":!0,required:j,tabIndex:-1,name:g,autoComplete:w,value:W,onChange:P=>X(P.target.value),disabled:T,form:b,children:[W===void 0?e.jsx("option",{value:""}):null,Array.from(K)]},F):null]})})};Fe.displayName=le;var Ue="SelectTrigger",We=n.forwardRef((t,r)=>{const{__scopeSelect:o,disabled:a=!1,...c}=t,p=fe(o),l=q(Ue,o),i=l.disabled||a,s=L(r,l.onTriggerChange),f=pe(o),g=n.useRef("touch"),[w,T,j]=ft(d=>{const x=f().filter(h=>!h.disabled),y=x.find(h=>h.value===l.value),u=mt(x,d,y);u!==void 0&&l.onValueChange(u.value)}),b=d=>{i||(l.onOpenChange(!0),j()),d&&(l.triggerPointerDownPosRef.current={x:Math.round(d.pageX),y:Math.round(d.pageY)})};return e.jsx(jt,{asChild:!0,...p,children:e.jsx(_.button,{type:"button",role:"combobox","aria-controls":l.contentId,"aria-expanded":l.open,"aria-required":l.required,"aria-autocomplete":"none",dir:l.dir,"data-state":l.open?"open":"closed",disabled:i,"data-disabled":i?"":void 0,"data-placeholder":ut(l.value)?"":void 0,...c,ref:s,onClick:I(c.onClick,d=>{d.currentTarget.focus(),g.current!=="mouse"&&b(d)}),onPointerDown:I(c.onPointerDown,d=>{g.current=d.pointerType;const x=d.target;x.hasPointerCapture(d.pointerId)&&x.releasePointerCapture(d.pointerId),d.button===0&&d.ctrlKey===!1&&d.pointerType==="mouse"&&(b(d),d.preventDefault())}),onKeyDown:I(c.onKeyDown,d=>{const x=w.current!=="";!(d.ctrlKey||d.altKey||d.metaKey)&&d.key.length===1&&T(d.key),!(x&&d.key===" ")&&Jt.includes(d.key)&&(b(),d.preventDefault())})})})});We.displayName=Ue;var Ke="SelectValue",ze=n.forwardRef((t,r)=>{const{__scopeSelect:o,className:a,style:c,children:p,placeholder:l="",...i}=t,s=q(Ke,o),{onValueNodeHasChildrenChange:f}=s,g=p!==void 0,w=L(r,s.onValueNodeChange);return G(()=>{f(g)},[f,g]),e.jsx(_.span,{...i,ref:w,style:{pointerEvents:"none"},children:ut(s.value)?e.jsx(e.Fragment,{children:l}):p})});ze.displayName=Ke;var ro="SelectIcon",Ge=n.forwardRef((t,r)=>{const{__scopeSelect:o,children:a,...c}=t;return e.jsx(_.span,{"aria-hidden":!0,...c,ref:r,children:a||"▼"})});Ge.displayName=ro;var so="SelectPortal",$e=t=>e.jsx(Bt,{asChild:!0,...t});$e.displayName=so;var Q="SelectContent",qe=n.forwardRef((t,r)=>{const o=q(Q,t.__scopeSelect),[a,c]=n.useState();if(G(()=>{c(new DocumentFragment)},[]),!o.open){const p=a;return p?Ve.createPortal(e.jsx(Ye,{scope:t.__scopeSelect,children:e.jsx(ue.Slot,{scope:t.__scopeSelect,children:e.jsx("div",{children:t.children})})}),p):null}return e.jsx(Xe,{...t,ref:r})});qe.displayName=Q;var D=10,[Ye,Y]=oe(Q),ao="SelectContentImpl",Xe=n.forwardRef((t,r)=>{const{__scopeSelect:o,position:a="item-aligned",onCloseAutoFocus:c,onEscapeKeyDown:p,onPointerDownOutside:l,side:i,sideOffset:s,align:f,alignOffset:g,arrowPadding:w,collisionBoundary:T,collisionPadding:j,sticky:b,hideWhenDetached:d,avoidCollisions:x,...y}=t,u=q(Q,o),[h,M]=n.useState(null),[A,ne]=n.useState(null),R=L(r,m=>M(m)),[O,W]=n.useState(null),[X,B]=n.useState(null),V=pe(o),[K,H]=n.useState(!1),F=n.useRef(!1);n.useEffect(()=>{if(h)return It(h)},[h]),Rt();const P=n.useCallback(m=>{const[N,...E]=V().map(S=>S.ref.current),[C]=E.slice(-1),v=document.activeElement;for(const S of m)if(S===v||(S==null||S.scrollIntoView({block:"nearest"}),S===N&&A&&(A.scrollTop=0),S===C&&A&&(A.scrollTop=A.scrollHeight),S==null||S.focus(),document.activeElement!==v))return},[V,A]),k=n.useCallback(()=>P([O,h]),[P,O,h]);n.useEffect(()=>{K&&k()},[K,k]);const{onOpenChange:U,triggerPointerDownPosRef:z}=u;n.useEffect(()=>{if(h){let m={x:0,y:0};const N=C=>{var v,S;m={x:Math.abs(Math.round(C.pageX)-(((v=z.current)==null?void 0:v.x)??0)),y:Math.abs(Math.round(C.pageY)-(((S=z.current)==null?void 0:S.y)??0))}},E=C=>{m.x<=10&&m.y<=10?C.preventDefault():h.contains(C.target)||U(!1),document.removeEventListener("pointermove",N),z.current=null};return z.current!==null&&(document.addEventListener("pointermove",N),document.addEventListener("pointerup",E,{capture:!0,once:!0})),()=>{document.removeEventListener("pointermove",N),document.removeEventListener("pointerup",E,{capture:!0})}}},[h,U,z]),n.useEffect(()=>{const m=()=>U(!1);return window.addEventListener("blur",m),window.addEventListener("resize",m),()=>{window.removeEventListener("blur",m),window.removeEventListener("resize",m)}},[U]);const[me,ce]=ft(m=>{const N=V().filter(v=>!v.disabled),E=N.find(v=>v.ref.current===document.activeElement),C=mt(N,m,E);C&&setTimeout(()=>C.ref.current.focus())}),he=n.useCallback((m,N,E)=>{const C=!F.current&&!E;(u.value!==void 0&&u.value===N||C)&&(W(m),C&&(F.current=!0))},[u.value]),xe=n.useCallback(()=>h==null?void 0:h.focus(),[h]),ee=n.useCallback((m,N,E)=>{const C=!F.current&&!E;(u.value!==void 0&&u.value===N||C)&&B(m)},[u.value]),ie=a==="popper"?be:Ze,re=ie===be?{side:i,sideOffset:s,align:f,alignOffset:g,arrowPadding:w,collisionBoundary:T,collisionPadding:j,sticky:b,hideWhenDetached:d,avoidCollisions:x}:{};return e.jsx(Ye,{scope:o,content:h,viewport:A,onViewportChange:ne,itemRefCallback:he,selectedItem:O,onItemLeave:xe,itemTextRefCallback:ee,focusSelectedItem:k,selectedItemText:X,position:a,isPositioned:K,searchRef:me,children:e.jsx(Pt,{as:Et,allowPinchZoom:!0,children:e.jsx(_t,{asChild:!0,trapped:u.open,onMountAutoFocus:m=>{m.preventDefault()},onUnmountAutoFocus:I(c,m=>{var N;(N=u.trigger)==null||N.focus({preventScroll:!0}),m.preventDefault()}),children:e.jsx(Mt,{asChild:!0,disableOutsidePointerEvents:!0,onEscapeKeyDown:p,onPointerDownOutside:l,onFocusOutside:m=>m.preventDefault(),onDismiss:()=>u.onOpenChange(!1),children:e.jsx(ie,{role:"listbox",id:u.contentId,"data-state":u.open?"open":"closed",dir:u.dir,onContextMenu:m=>m.preventDefault(),...y,...re,onPlaced:()=>H(!0),ref:R,style:{display:"flex",flexDirection:"column",outline:"none",...y.style},onKeyDown:I(y.onKeyDown,m=>{const N=m.ctrlKey||m.altKey||m.metaKey;if(m.key==="Tab"&&m.preventDefault(),!N&&m.key.length===1&&ce(m.key),["ArrowUp","ArrowDown","Home","End"].includes(m.key)){let C=V().filter(v=>!v.disabled).map(v=>v.ref.current);if(["ArrowUp","End"].includes(m.key)&&(C=C.slice().reverse()),["ArrowUp","ArrowDown"].includes(m.key)){const v=m.target,S=C.indexOf(v);C=C.slice(S+1)}setTimeout(()=>P(C)),m.preventDefault()}})})})})})})});Xe.displayName=ao;var lo="SelectItemAlignedPosition",Ze=n.forwardRef((t,r)=>{const{__scopeSelect:o,onPlaced:a,...c}=t,p=q(Q,o),l=Y(Q,o),[i,s]=n.useState(null),[f,g]=n.useState(null),w=L(r,R=>g(R)),T=pe(o),j=n.useRef(!1),b=n.useRef(!0),{viewport:d,selectedItem:x,selectedItemText:y,focusSelectedItem:u}=l,h=n.useCallback(()=>{if(p.trigger&&p.valueNode&&i&&f&&d&&x&&y){const R=p.trigger.getBoundingClientRect(),O=f.getBoundingClientRect(),W=p.valueNode.getBoundingClientRect(),X=y.getBoundingClientRect();if(p.dir!=="rtl"){const v=X.left-O.left,S=W.left-v,Z=R.left-S,J=R.width+Z,ge=Math.max(J,O.width),ve=window.innerWidth-D,Se=Oe(S,[D,Math.max(D,ve-ge)]);i.style.minWidth=J+"px",i.style.left=Se+"px"}else{const v=O.right-X.right,S=window.innerWidth-W.right-v,Z=window.innerWidth-R.right-S,J=R.width+Z,ge=Math.max(J,O.width),ve=window.innerWidth-D,Se=Oe(S,[D,Math.max(D,ve-ge)]);i.style.minWidth=J+"px",i.style.right=Se+"px"}const B=T(),V=window.innerHeight-D*2,K=d.scrollHeight,H=window.getComputedStyle(f),F=parseInt(H.borderTopWidth,10),P=parseInt(H.paddingTop,10),k=parseInt(H.borderBottomWidth,10),U=parseInt(H.paddingBottom,10),z=F+P+K+U+k,me=Math.min(x.offsetHeight*5,z),ce=window.getComputedStyle(d),he=parseInt(ce.paddingTop,10),xe=parseInt(ce.paddingBottom,10),ee=R.top+R.height/2-D,ie=V-ee,re=x.offsetHeight/2,m=x.offsetTop+re,N=F+P+m,E=z-N;if(N<=ee){const v=B.length>0&&x===B[B.length-1].ref.current;i.style.bottom="0px";const S=f.clientHeight-d.offsetTop-d.offsetHeight,Z=Math.max(ie,re+(v?xe:0)+S+k),J=N+Z;i.style.height=J+"px"}else{const v=B.length>0&&x===B[0].ref.current;i.style.top="0px";const Z=Math.max(ee,F+d.offsetTop+(v?he:0)+re)+E;i.style.height=Z+"px",d.scrollTop=N-ee+d.offsetTop}i.style.margin=`${D}px 0`,i.style.minHeight=me+"px",i.style.maxHeight=V+"px",a==null||a(),requestAnimationFrame(()=>j.current=!0)}},[T,p.trigger,p.valueNode,i,f,d,x,y,p.dir,a]);G(()=>h(),[h]);const[M,A]=n.useState();G(()=>{f&&A(window.getComputedStyle(f).zIndex)},[f]);const ne=n.useCallback(R=>{R&&b.current===!0&&(h(),u==null||u(),b.current=!1)},[h,u]);return e.jsx(io,{scope:o,contentWrapper:i,shouldExpandOnScrollRef:j,onScrollButtonChange:ne,children:e.jsx("div",{ref:s,style:{display:"flex",flexDirection:"column",position:"fixed",zIndex:M},children:e.jsx(_.div,{...c,ref:w,style:{boxSizing:"border-box",maxHeight:"100%",...c.style}})})})});Ze.displayName=lo;var co="SelectPopperPosition",be=n.forwardRef((t,r)=>{const{__scopeSelect:o,align:a="start",collisionPadding:c=D,...p}=t,l=fe(o);return e.jsx(At,{...l,...p,ref:r,align:a,collisionPadding:c,style:{boxSizing:"border-box",...p.style,"--radix-select-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-select-content-available-width":"var(--radix-popper-available-width)","--radix-select-content-available-height":"var(--radix-popper-available-height)","--radix-select-trigger-width":"var(--radix-popper-anchor-width)","--radix-select-trigger-height":"var(--radix-popper-anchor-height)"}})});be.displayName=co;var[io,Me]=oe(Q,{}),Te="SelectViewport",Je=n.forwardRef((t,r)=>{const{__scopeSelect:o,nonce:a,...c}=t,p=Y(Te,o),l=Me(Te,o),i=L(r,p.onViewportChange),s=n.useRef(0);return e.jsxs(e.Fragment,{children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:"[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}"},nonce:a}),e.jsx(ue.Slot,{scope:o,children:e.jsx(_.div,{"data-radix-select-viewport":"",role:"presentation",...c,ref:i,style:{position:"relative",flex:1,overflow:"hidden auto",...c.style},onScroll:I(c.onScroll,f=>{const g=f.currentTarget,{contentWrapper:w,shouldExpandOnScrollRef:T}=l;if(T!=null&&T.current&&w){const j=Math.abs(s.current-g.scrollTop);if(j>0){const b=window.innerHeight-D*2,d=parseFloat(w.style.minHeight),x=parseFloat(w.style.height),y=Math.max(d,x);if(y<b){const u=y+j,h=Math.min(b,u),M=u-h;w.style.height=h+"px",w.style.bottom==="0px"&&(g.scrollTop=M>0?M:0,w.style.justifyContent="flex-end")}}}s.current=g.scrollTop})})})]})});Je.displayName=Te;var Qe="SelectGroup",[uo,po]=oe(Qe),fo=n.forwardRef((t,r)=>{const{__scopeSelect:o,...a}=t,c=_e();return e.jsx(uo,{scope:o,id:c,children:e.jsx(_.div,{role:"group","aria-labelledby":c,...a,ref:r})})});fo.displayName=Qe;var et="SelectLabel",tt=n.forwardRef((t,r)=>{const{__scopeSelect:o,...a}=t,c=po(et,o);return e.jsx(_.div,{id:c.id,...a,ref:r})});tt.displayName=et;var de="SelectItem",[mo,ot]=oe(de),nt=n.forwardRef((t,r)=>{const{__scopeSelect:o,value:a,disabled:c=!1,textValue:p,...l}=t,i=q(de,o),s=Y(de,o),f=i.value===a,[g,w]=n.useState(p??""),[T,j]=n.useState(!1),b=L(r,u=>{var h;return(h=s.itemRefCallback)==null?void 0:h.call(s,u,a,c)}),d=_e(),x=n.useRef("touch"),y=()=>{c||(i.onValueChange(a),i.onOpenChange(!1))};if(a==="")throw new Error("A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");return e.jsx(mo,{scope:o,value:a,disabled:c,textId:d,isSelected:f,onItemTextChange:n.useCallback(u=>{w(h=>h||((u==null?void 0:u.textContent)??"").trim())},[]),children:e.jsx(ue.ItemSlot,{scope:o,value:a,disabled:c,textValue:g,children:e.jsx(_.div,{role:"option","aria-labelledby":d,"data-highlighted":T?"":void 0,"aria-selected":f&&T,"data-state":f?"checked":"unchecked","aria-disabled":c||void 0,"data-disabled":c?"":void 0,tabIndex:c?void 0:-1,...l,ref:b,onFocus:I(l.onFocus,()=>j(!0)),onBlur:I(l.onBlur,()=>j(!1)),onClick:I(l.onClick,()=>{x.current!=="mouse"&&y()}),onPointerUp:I(l.onPointerUp,()=>{x.current==="mouse"&&y()}),onPointerDown:I(l.onPointerDown,u=>{x.current=u.pointerType}),onPointerMove:I(l.onPointerMove,u=>{var h;x.current=u.pointerType,c?(h=s.onItemLeave)==null||h.call(s):x.current==="mouse"&&u.currentTarget.focus({preventScroll:!0})}),onPointerLeave:I(l.onPointerLeave,u=>{var h;u.currentTarget===document.activeElement&&((h=s.onItemLeave)==null||h.call(s))}),onKeyDown:I(l.onKeyDown,u=>{var M;((M=s.searchRef)==null?void 0:M.current)!==""&&u.key===" "||(Qt.includes(u.key)&&y(),u.key===" "&&u.preventDefault())})})})})});nt.displayName=de;var se="SelectItemText",rt=n.forwardRef((t,r)=>{const{__scopeSelect:o,className:a,style:c,...p}=t,l=q(se,o),i=Y(se,o),s=ot(se,o),f=no(se,o),[g,w]=n.useState(null),T=L(r,y=>w(y),s.onItemTextChange,y=>{var u;return(u=i.itemTextRefCallback)==null?void 0:u.call(i,y,s.value,s.disabled)}),j=g==null?void 0:g.textContent,b=n.useMemo(()=>e.jsx("option",{value:s.value,disabled:s.disabled,children:j},s.value),[s.disabled,s.value,j]),{onNativeOptionAdd:d,onNativeOptionRemove:x}=f;return G(()=>(d(b),()=>x(b)),[d,x,b]),e.jsxs(e.Fragment,{children:[e.jsx(_.span,{id:s.textId,...p,ref:T}),s.isSelected&&l.valueNode&&!l.valueNodeHasChildren?Ve.createPortal(p.children,l.valueNode):null]})});rt.displayName=se;var st="SelectItemIndicator",at=n.forwardRef((t,r)=>{const{__scopeSelect:o,...a}=t;return ot(st,o).isSelected?e.jsx(_.span,{"aria-hidden":!0,...a,ref:r}):null});at.displayName=st;var je="SelectScrollUpButton",lt=n.forwardRef((t,r)=>{const o=Y(je,t.__scopeSelect),a=Me(je,t.__scopeSelect),[c,p]=n.useState(!1),l=L(r,a.onScrollButtonChange);return G(()=>{if(o.viewport&&o.isPositioned){let i=function(){const f=s.scrollTop>0;p(f)};const s=o.viewport;return i(),s.addEventListener("scroll",i),()=>s.removeEventListener("scroll",i)}},[o.viewport,o.isPositioned]),c?e.jsx(it,{...t,ref:l,onAutoScroll:()=>{const{viewport:i,selectedItem:s}=o;i&&s&&(i.scrollTop=i.scrollTop-s.offsetHeight)}}):null});lt.displayName=je;var Ie="SelectScrollDownButton",ct=n.forwardRef((t,r)=>{const o=Y(Ie,t.__scopeSelect),a=Me(Ie,t.__scopeSelect),[c,p]=n.useState(!1),l=L(r,a.onScrollButtonChange);return G(()=>{if(o.viewport&&o.isPositioned){let i=function(){const f=s.scrollHeight-s.clientHeight,g=Math.ceil(s.scrollTop)<f;p(g)};const s=o.viewport;return i(),s.addEventListener("scroll",i),()=>s.removeEventListener("scroll",i)}},[o.viewport,o.isPositioned]),c?e.jsx(it,{...t,ref:l,onAutoScroll:()=>{const{viewport:i,selectedItem:s}=o;i&&s&&(i.scrollTop=i.scrollTop+s.offsetHeight)}}):null});ct.displayName=Ie;var it=n.forwardRef((t,r)=>{const{__scopeSelect:o,onAutoScroll:a,...c}=t,p=Y("SelectScrollButton",o),l=n.useRef(null),i=pe(o),s=n.useCallback(()=>{l.current!==null&&(window.clearInterval(l.current),l.current=null)},[]);return n.useEffect(()=>()=>s(),[s]),G(()=>{var g;const f=i().find(w=>w.ref.current===document.activeElement);(g=f==null?void 0:f.ref.current)==null||g.scrollIntoView({block:"nearest"})},[i]),e.jsx(_.div,{"aria-hidden":!0,...c,ref:r,style:{flexShrink:0,...c.style},onPointerDown:I(c.onPointerDown,()=>{l.current===null&&(l.current=window.setInterval(a,50))}),onPointerMove:I(c.onPointerMove,()=>{var f;(f=p.onItemLeave)==null||f.call(p),l.current===null&&(l.current=window.setInterval(a,50))}),onPointerLeave:I(c.onPointerLeave,()=>{s()})})}),ho="SelectSeparator",dt=n.forwardRef((t,r)=>{const{__scopeSelect:o,...a}=t;return e.jsx(_.div,{"aria-hidden":!0,...a,ref:r})});dt.displayName=ho;var Re="SelectArrow",xo=n.forwardRef((t,r)=>{const{__scopeSelect:o,...a}=t,c=fe(o),p=q(Re,o),l=Y(Re,o);return p.open&&l.position==="popper"?e.jsx(Dt,{...c,...a,ref:r}):null});xo.displayName=Re;function ut(t){return t===""||t===void 0}var pt=n.forwardRef((t,r)=>{const{value:o,...a}=t,c=n.useRef(null),p=L(r,c),l=Zt(o);return n.useEffect(()=>{const i=c.current,s=window.HTMLSelectElement.prototype,g=Object.getOwnPropertyDescriptor(s,"value").set;if(l!==o&&g){const w=new Event("change",{bubbles:!0});g.call(i,o),i.dispatchEvent(w)}},[l,o]),e.jsx(Ot,{asChild:!0,children:e.jsx("select",{...a,ref:p,defaultValue:o})})});pt.displayName="BubbleSelect";function ft(t){const r=kt(t),o=n.useRef(""),a=n.useRef(0),c=n.useCallback(l=>{const i=o.current+l;r(i),function s(f){o.current=f,window.clearTimeout(a.current),f!==""&&(a.current=window.setTimeout(()=>s(""),1e3))}(i)},[r]),p=n.useCallback(()=>{o.current="",window.clearTimeout(a.current)},[]);return n.useEffect(()=>()=>window.clearTimeout(a.current),[]),[o,c,p]}function mt(t,r,o){const c=r.length>1&&Array.from(r).every(f=>f===r[0])?r[0]:r,p=o?t.indexOf(o):-1;let l=go(t,Math.max(p,0));c.length===1&&(l=l.filter(f=>f!==o));const s=l.find(f=>f.textValue.toLowerCase().startsWith(c.toLowerCase()));return s!==o?s:void 0}function go(t,r){return t.map((o,a)=>t[(r+a)%t.length])}var vo=Fe,ht=We,So=ze,wo=Ge,yo=$e,xt=qe,Co=Je,gt=tt,vt=nt,No=rt,bo=at,St=lt,wt=ct,yt=dt;const ke=vo,Le=So,Pe=n.forwardRef(({className:t,children:r,...o},a)=>e.jsxs(ht,{ref:a,className:$("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",t),...o,children:[r,e.jsx(wo,{asChild:!0,children:e.jsx(He,{className:"h-4 w-4 opacity-50"})})]}));Pe.displayName=ht.displayName;const Ct=n.forwardRef(({className:t,...r},o)=>e.jsx(St,{ref:o,className:$("flex cursor-default items-center justify-center py-1",t),...r,children:e.jsx(qt,{className:"h-4 w-4"})}));Ct.displayName=St.displayName;const Nt=n.forwardRef(({className:t,...r},o)=>e.jsx(wt,{ref:o,className:$("flex cursor-default items-center justify-center py-1",t),...r,children:e.jsx(He,{className:"h-4 w-4"})}));Nt.displayName=wt.displayName;const Ee=n.forwardRef(({className:t,children:r,position:o="popper",...a},c)=>e.jsx(yo,{children:e.jsxs(xt,{ref:c,className:$("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",o==="popper"&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",t),position:o,...a,children:[e.jsx(Ct,{}),e.jsx(Co,{className:$("p-1",o==="popper"&&"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),children:r}),e.jsx(Nt,{})]})}));Ee.displayName=xt.displayName;const To=n.forwardRef(({className:t,...r},o)=>e.jsx(gt,{ref:o,className:$("py-1.5 pl-8 pr-2 text-sm font-semibold",t),...r}));To.displayName=gt.displayName;const te=n.forwardRef(({className:t,children:r,...o},a)=>e.jsxs(vt,{ref:a,className:$("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",t),...o,children:[e.jsx("span",{className:"absolute left-2 flex h-3.5 w-3.5 items-center justify-center",children:e.jsx(bo,{children:e.jsx($t,{className:"h-4 w-4"})})}),e.jsx(No,{children:r})]}));te.displayName=vt.displayName;const jo=n.forwardRef(({className:t,...r},o)=>e.jsx(yt,{ref:o,className:$("-mx-1 my-1 h-px bg-muted",t),...r}));jo.displayName=yt.displayName;const Ne=[{id:"1",title:"مساعدة في مشروع برمجي",type:"need",category:"برمجة",description:"أحتاج مساعدة في تطوير تطبيق موبايل باستخدام React Native لمشروع التخرج. المشروع عبارة عن تطبيق إدارة مهام.",hourlyRate:3,postedBy:{name:"أحمد محمد",university:"جامعة الملك سعود"}},{id:"2",title:"تصميم شعار للنادي العلمي",type:"need",category:"تصميم",description:"مطلوب تصميم شعار للنادي العلمي بكلية الحاسب. يجب أن يعكس الشعار التخصصات التقنية والابتكار.",hourlyRate:2,postedBy:{name:"منى الحربي",university:"جامعة الأميرة نورة"}},{id:"3",title:"تدريس الإحصاء التطبيقي",type:"offer",category:"تدريس",description:"أقدم دروس في الإحصاء التطبيقي وتحليل البيانات باستخدام R وSPSS للطلاب في التخصصات العلمية.",hourlyRate:2,postedBy:{name:"خالد العمري",university:"جامعة الملك فهد"}},{id:"4",title:"ترجمة بحث علمي",type:"offer",category:"ترجمة",description:"أقدم خدمة ترجمة الأبحاث العلمية من الإنجليزية إلى العربية وبالعكس. خبرة في المصطلحات الطبية والهندسية.",hourlyRate:3,postedBy:{name:"نورة السالم",university:"جامعة الملك عبدالعزيز"}},{id:"5",title:"تصميم عروض تقديمية",type:"offer",category:"تصميم",description:"أقدم خدمة تصميم العروض التقديمية الاحترافية للمشاريع والأبحاث باستخدام PowerPoint وCanva.",hourlyRate:1,postedBy:{name:"فهد العتيبي",university:"جامعة القصيم"}},{id:"6",title:"مساعدة في كتابة بحث تخرج",type:"need",category:"تحرير",description:"أحتاج مساعدة في تنسيق وتحرير بحث التخرج في تخصص إدارة الأعمال. البحث عن ريادة الأعمال في المملكة.",hourlyRate:4,postedBy:{name:"هدى الزهراني",university:"جامعة طيبة"}}],Io=["الكل","تدريس","برمجة","تصميم","ترجمة","تحرير"];function Mo(){return e.jsxs("div",{className:"min-h-screen bg-background flex flex-col",children:[e.jsx(Vt,{}),e.jsx("main",{className:"flex-1",children:e.jsxs("div",{className:"container mx-auto py-8",children:[e.jsxs("div",{className:"flex items-center justify-between mb-8",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(Ht,{className:"h-6 w-6 text-primary"}),e.jsx("h1",{className:"text-3xl font-bold",children:"سوق المهارات"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs(De,{children:[e.jsx(Ft,{className:"h-4 w-4 mr-1"}),"نشر عرض"]}),e.jsxs(De,{variant:"outline",children:[e.jsx(Ut,{className:"h-4 w-4 mr-1"}),"نشر طلب"]})]})]}),e.jsxs("div",{className:"flex flex-col md:flex-row gap-4 mb-8",children:[e.jsxs("div",{className:"relative flex-grow",children:[e.jsx(Xt,{className:"absolute left-3 top-3 h-4 w-4 text-muted-foreground"}),e.jsx(Wt,{placeholder:"ابحث في السوق...",className:"pl-10"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs(ke,{defaultValue:"الكل",children:[e.jsxs(Pe,{className:"w-[180px]",children:[e.jsx(Yt,{className:"h-4 w-4 mr-2"}),e.jsx(Le,{placeholder:"تصنيف"})]}),e.jsx(Ee,{children:Io.map(t=>e.jsx(te,{value:t,children:t},t))})]}),e.jsxs(ke,{defaultValue:"الأحدث",children:[e.jsx(Pe,{className:"w-[180px]",children:e.jsx(Le,{placeholder:"الترتيب"})}),e.jsxs(Ee,{children:[e.jsx(te,{value:"الأحدث",children:"الأحدث"}),e.jsx(te,{value:"الأقدم",children:"الأقدم"}),e.jsx(te,{value:"الأقل سعراً",children:"الأقل سعراً"}),e.jsx(te,{value:"الأعلى سعراً",children:"الأعلى سعراً"})]})]})]})]}),e.jsxs(zt,{defaultValue:"all",children:[e.jsxs(Gt,{className:"mb-6",children:[e.jsx(ye,{value:"all",children:"الكل"}),e.jsx(ye,{value:"offers",children:"العروض"}),e.jsx(ye,{value:"needs",children:"الطلبات"})]}),e.jsx(Ce,{value:"all",className:"mt-0",children:e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",children:Ne.map(t=>e.jsx(we,{...t},t.id))})}),e.jsx(Ce,{value:"offers",className:"mt-0",children:e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",children:Ne.filter(t=>t.type==="offer").map(t=>e.jsx(we,{...t},t.id))})}),e.jsx(Ce,{value:"needs",className:"mt-0",children:e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",children:Ne.filter(t=>t.type==="need").map(t=>e.jsx(we,{...t},t.id))})})]})]})})]})}export{Mo as default};
