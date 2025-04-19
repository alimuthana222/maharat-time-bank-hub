import{c as T,r as d,j as e,P as u,u as E,a as N,b as f,B as v,S as M,C as b,d as y,N as U}from"./index-tCJOb0bq.js";import{T as $,a as F,b as h,c as g}from"./tabs-BobLoQyd.js";var p="Avatar",[B,se]=T(p),[q,w]=B(p),A=d.forwardRef((s,a)=>{const{__scopeAvatar:t,...r}=s,[i,l]=d.useState("idle");return e.jsx(q,{scope:t,imageLoadingStatus:i,onImageLoadingStatusChange:l,children:e.jsx(u.span,{...r,ref:a})})});A.displayName=p;var S="AvatarImage",R=d.forwardRef((s,a)=>{const{__scopeAvatar:t,src:r,onLoadingStatusChange:i=()=>{},...l}=s,n=w(S,t),o=O(r,l.referrerPolicy),m=E(x=>{i(x),n.onImageLoadingStatusChange(x)});return N(()=>{o!=="idle"&&m(o)},[o,m]),o==="loaded"?e.jsx(u.img,{...l,ref:a,src:r}):null});R.displayName=S;var L="AvatarFallback",k=d.forwardRef((s,a)=>{const{__scopeAvatar:t,delayMs:r,...i}=s,l=w(L,t),[n,o]=d.useState(r===void 0);return d.useEffect(()=>{if(r!==void 0){const m=window.setTimeout(()=>o(!0),r);return()=>window.clearTimeout(m)}},[r]),n&&l.imageLoadingStatus!=="loaded"?e.jsx(u.span,{...i,ref:a}):null});k.displayName=L;function O(s,a){const[t,r]=d.useState("idle");return N(()=>{if(!s){r("error");return}let i=!0;const l=new window.Image,n=o=>()=>{i&&r(o)};return r("loading"),l.onload=n("loaded"),l.onerror=n("error"),l.src=s,a&&(l.referrerPolicy=a),()=>{i=!1}},[s,a]),t}var C=A,I=R,P=k;const j=d.forwardRef(({className:s,...a},t)=>e.jsx(C,{ref:t,className:f("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",s),...a}));j.displayName=C.displayName;const D=d.forwardRef(({className:s,...a},t)=>e.jsx(I,{ref:t,className:f("aspect-square h-full w-full",s),...a}));D.displayName=I.displayName;const Q=d.forwardRef(({className:s,...a},t)=>e.jsx(P,{ref:t,className:f("flex h-full w-full items-center justify-center rounded-full bg-muted",s),...a}));Q.displayName=P.displayName;function V({name:s,university:a,major:t,level:r,avatarUrl:i,rating:l,availability:n}){const o=()=>{switch(n){case"available":return"bg-green-500";case"busy":return"bg-yellow-500";case"unavailable":return"bg-red-500"}};return e.jsxs("div",{className:"flex flex-col md:flex-row items-start md:items-center gap-6 p-6 border rounded-lg bg-card shadow-sm",children:[e.jsxs("div",{className:"relative",children:[e.jsx(j,{className:"h-24 w-24",children:e.jsx("img",{src:i||"/placeholder.svg",alt:s,className:"object-cover"})}),e.jsx("div",{className:`absolute bottom-0 left-0 w-4 h-4 rounded-full border-2 border-white ${o()}`})]}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-2",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-bold",children:s}),e.jsx("p",{className:"text-muted-foreground",children:a})]}),e.jsx("div",{className:"flex items-center gap-2",children:e.jsxs("div",{className:"flex items-center",children:[[...Array(5)].map((m,x)=>e.jsx("svg",{className:`w-4 h-4 ${x<l?"text-yellow-400":"text-gray-300"}`,fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{d:"M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"})},x)),e.jsxs("span",{className:"mr-2 text-sm font-medium text-gray-500",children:[l,"/5"]})]})})]}),e.jsxs("div",{className:"flex flex-wrap gap-2 mt-3",children:[e.jsx(v,{variant:"outline",className:"bg-primary/10",children:t}),e.jsx(v,{variant:"outline",children:r}),e.jsx(v,{variant:"outline",className:`${n==="available"?"bg-green-100 text-green-800":n==="busy"?"bg-yellow-100 text-yellow-800":"bg-red-100 text-red-800"}`,children:n==="available"?"متاح":n==="busy"?"مشغول جزئياً":"غير متاح"})]})]})]})}function z({skills:s}){return e.jsxs("div",{className:"mt-8",children:[e.jsx("h2",{className:"text-xl font-bold mb-4",children:"المهارات المقدمة"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:s.map(a=>e.jsx(M,{...a},a.id))})]})}function K({reviews:s}){return e.jsxs("div",{className:"mt-8",children:[e.jsx("h2",{className:"text-xl font-bold mb-4",children:"التقييمات والمراجعات"}),e.jsx("div",{className:"space-y-6",children:s.map(a=>e.jsx(b,{children:e.jsxs(y,{className:"pt-6",children:[e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(j,{children:e.jsx("img",{src:a.reviewer.avatarUrl||"/placeholder.svg",alt:a.reviewer.name})}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-medium",children:a.reviewer.name}),e.jsx("p",{className:"text-xs text-muted-foreground",children:a.date})]})]}),e.jsx("div",{className:"flex items-center",children:[...Array(5)].map((t,r)=>e.jsx("svg",{className:`w-4 h-4 ${r<a.rating?"text-yellow-400":"text-gray-300"}`,fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{d:"M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"})},r))})]}),e.jsx("p",{className:"mt-4",children:a.comment}),e.jsxs("div",{className:"grid grid-cols-3 gap-4 mt-4 text-center text-sm",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-muted-foreground",children:"الجودة"}),e.jsxs("div",{className:"font-medium",children:[a.categories.quality,"/5"]})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-muted-foreground",children:"السرعة"}),e.jsxs("div",{className:"font-medium",children:[a.categories.speed,"/5"]})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-muted-foreground",children:"التعاون"}),e.jsxs("div",{className:"font-medium",children:[a.categories.cooperation,"/5"]})]})]})]})},a.id))})]})}var G="AspectRatio",_=d.forwardRef((s,a)=>{const{ratio:t=1/1,style:r,...i}=s;return e.jsx("div",{style:{position:"relative",width:"100%",paddingBottom:`${100/t}%`},"data-radix-aspect-ratio-wrapper":"",children:e.jsx(u.div,{...i,ref:a,style:{...r,position:"absolute",top:0,right:0,bottom:0,left:0}})})});_.displayName=G;var H=_;const W=H;function J({portfolioItems:s}){return e.jsxs("div",{className:"mt-8",children:[e.jsx("h2",{className:"text-xl font-bold mb-4",children:"المحفظة (نماذج أعمال سابقة)"}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",children:s.map(a=>e.jsxs(b,{className:"overflow-hidden",children:[e.jsx(W,{ratio:16/9,children:e.jsx("img",{src:a.imageUrl,alt:a.title,className:"object-cover w-full h-full"})}),e.jsxs(y,{className:"p-4",children:[e.jsx("h3",{className:"font-medium",children:a.title}),e.jsx("p",{className:"text-sm text-muted-foreground mt-1",children:a.description}),a.link&&e.jsx("a",{href:a.link,target:"_blank",rel:"noopener noreferrer",className:"text-sm text-primary hover:underline mt-2 inline-block",children:"عرض المشروع"})]})]},a.id))})]})}const c={name:"أحمد محمد",university:"جامعة الملك سعود",major:"علوم الحاسب",level:"السنة الرابعة",avatarUrl:"/placeholder.svg",rating:4.5,availability:"available",bio:"طالب في كلية علوم الحاسب والمعلومات، متخصص في تطوير الويب وتطبيقات الجوال. أقدم خدمات برمجية متنوعة للطلاب والشركات الناشئة."},X=[{id:"1",title:"تطوير واجهات المستخدم",category:"برمجة",description:"تصميم وتطوير واجهات مستخدم تفاعلية باستخدام React و TypeScript. خبرة في إنشاء مواقع سريعة الاستجابة.",hourlyRate:3,provider:{name:c.name,university:c.university}},{id:"2",title:"تطوير تطبيقات الجوال",category:"برمجة",description:"إنشاء تطبيقات للهواتف الذكية باستخدام React Native. تطوير تطبيقات متوافقة مع أنظمة iOS وAndroid.",hourlyRate:4,provider:{name:c.name,university:c.university}},{id:"3",title:"تصميم قواعد البيانات",category:"برمجة",description:"تصميم وإدارة قواعد البيانات العلائقية باستخدام PostgreSQL و MySQL. تحسين استعلامات SQL للأداء الأمثل.",hourlyRate:3,provider:{name:c.name,university:c.university}}],Y=[{id:"1",reviewer:{name:"سارة العتيبي",avatarUrl:"/placeholder.svg"},rating:5,comment:"عمل ممتاز في تطوير موقع الويب الخاص بمشروعي. كان سريعاً ومتعاوناً جداً، وقدم اقتراحات مفيدة لتحسين المشروع.",date:"1 مايو 2025",categories:{quality:5,speed:5,cooperation:5}},{id:"2",reviewer:{name:"خالد الشمري",avatarUrl:"/placeholder.svg"},rating:4,comment:"ساعدني في إنشاء تطبيق جوال لمشروع التخرج. قام بإنجاز العمل قبل الموعد النهائي والنتيجة كانت رائعة.",date:"15 أبريل 2025",categories:{quality:4,speed:5,cooperation:4}},{id:"3",reviewer:{name:"نورة السالم",avatarUrl:"/placeholder.svg"},rating:4,comment:"قام بتصميم قاعدة بيانات لمشروعي بشكل احترافي ودقيق. أسلوب عمله منظم جداً.",date:"3 أبريل 2025",categories:{quality:5,speed:3,cooperation:4}}],Z=[{id:"1",title:"منصة تعليمية للطلاب",description:"تطبيق ويب لمساعدة الطلاب في تنظيم جداولهم الدراسية ومتابعة واجباتهم",imageUrl:"/placeholder.svg",link:"#"},{id:"2",title:"تطبيق مشاركة المواصلات",description:"تطبيق جوال يساعد طلاب الجامعة على مشاركة رحلات التنقل والمواصلات",imageUrl:"/placeholder.svg",link:"#"},{id:"3",title:"نظام إدارة المكتبة",description:"نظام قاعدة بيانات متكامل لإدارة عمليات الاستعارة والإرجاع في المكتبة",imageUrl:"/placeholder.svg",link:"#"},{id:"4",title:"موقع إلكتروني للنادي العلمي",description:"موقع تفاعلي للنادي العلمي في الجامعة مع نظام عضويات وإدارة فعاليات",imageUrl:"/placeholder.svg",link:"#"}];function re(){return e.jsxs("div",{className:"min-h-screen bg-background flex flex-col",children:[e.jsx(U,{}),e.jsx("main",{className:"flex-1",children:e.jsxs("div",{className:"container mx-auto py-8",children:[e.jsx(V,{...c}),e.jsxs("div",{className:"mt-6",children:[e.jsx("h2",{className:"text-xl font-bold mb-2",children:"نبذة تعريفية"}),e.jsx("p",{className:"text-muted-foreground",children:c.bio})]}),e.jsxs($,{defaultValue:"skills",className:"mt-8",children:[e.jsxs(F,{className:"w-full flex justify-start border-b",children:[e.jsx(h,{value:"skills",className:"flex-1 sm:flex-none",children:"المهارات المقدمة"}),e.jsx(h,{value:"portfolio",className:"flex-1 sm:flex-none",children:"المحفظة"}),e.jsx(h,{value:"reviews",className:"flex-1 sm:flex-none",children:"التقييمات"})]}),e.jsx(g,{value:"skills",children:e.jsx(z,{skills:X})}),e.jsx(g,{value:"portfolio",children:e.jsx(J,{portfolioItems:Z})}),e.jsx(g,{value:"reviews",children:e.jsx(K,{reviews:Y})})]})]})})]})}export{re as default};
