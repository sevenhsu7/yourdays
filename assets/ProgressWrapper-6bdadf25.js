import{_ as Y}from"./_plugin-vue_export-helper-c27b6911.js";import{c as l,b as r,d as o,i as h,e as c,t as d,F as D,k as m,l as A,n as u,m as P}from"./index-42588570.js";const b={props:{item:{type:Object,required:!0},isActive:{type:Boolean,default:!1}},setup(s,{slots:a}){console.log("ProgressWrapper props:",s);const i=n=>{const e=new Date(n);return`${e.getFullYear()}年${e.getMonth()+1}月${e.getDate()}日`},t=l(()=>{switch(s.item.type){case"month":return"本月";case"quarter":return"本季";case"year":return"今年";default:return""}}),y=l(()=>{const n=new Date(s.item.startDate),e=new Date(s.item.deadline),g=Math.ceil((e.getTime()-n.getTime())/(1e3*60*60*24));return Math.max(1,g+1)}),w=l(()=>{const n=new Date(s.item.startDate),g=Math.ceil((new Date().getTime()-n.getTime())/(1e3*60*60*24));return Math.min(y.value,Math.max(0,g))}),_=l(()=>{const n=new Date(s.item.deadline).getTime(),e=new Date().getTime();return Math.ceil((n-e)/(1e3*60*60*24))}),x=l(()=>{const n=new Date(s.item.startDate).getTime(),e=new Date(s.item.deadline).getTime(),g=new Date().getTime(),M=e-n,F=g-n;return g>=e?100:g<=n?0:Math.min(100,Math.max(0,Math.round(F/M*100)))}),T=l(()=>!!a.actions),k=l(()=>{const n=new Date,e=new Date(s.item.deadline);return e.setHours(23,59,59,999),n.getTime()>e.getTime()}),f=l(()=>{const n=new Date,e=new Date(s.item.deadline);return n.getFullYear()===e.getFullYear()&&n.getMonth()===e.getMonth()&&n.getDate()===e.getDate()}),v=l(()=>{const n=new Date,e=new Date(s.item.startDate);return n.getFullYear()===e.getFullYear()&&n.getMonth()===e.getMonth()&&n.getDate()===e.getDate()});return{formatDate:i,periodText:t,totalDays:y,passedDays:w,remainingDays:_,progress:x,hasActions:T,isExpired:k,isLastDay:f,isFirstDay:v}}},B=["data-preset"],E={key:0,class:"crown-mark"},p={class:"head-container"},C={key:0},N={key:1},S={key:1,class:"description-container"},V={class:"description-text"},W={class:"progress-container"};function q(s,a,i,t,y,w){return r(),o("div",{class:u(["progress-wrapper",{active:i.isActive,"has-actions":t.hasActions}]),"data-preset":i.item.id<0,onClick:a[0]||(a[0]=_=>s.$emit("toggle"))},[i.item.addedFromYours&&!i.item.fromYoursPlan?(r(),o("span",E,"👑")):h("",!0),c("div",p,[c("h2",null,d(i.item.title),1),i.item.type==="task"?(r(),o("p",C," 截止日期: "+d(t.formatDate(i.item.deadline)),1)):(r(),o("p",N,[!t.isExpired&&t.progress<66.7?(r(),o(D,{key:0},[t.isFirstDay?(r(),o(D,{key:0},[m(d(t.periodText)+"的第",1),a[1]||(a[1]=c("strong",null,"1",-1)),a[2]||(a[2]=m("天 "))],64)):(r(),o(D,{key:1},[m(d(t.periodText)+"已经过了",1),c("strong",null,d(t.passedDays),1),a[3]||(a[3]=m("天 "))],64))],64)):(r(),o(D,{key:1},[t.isExpired?(r(),o(D,{key:0},[m(d(t.periodText)+"已经到期咯 ",1)],64)):t.isLastDay?(r(),o(D,{key:1},[m(d(t.periodText)+"的最后一天 ",1)],64)):(r(),o(D,{key:2},[m(d(t.periodText)+"还剩",1),c("strong",null,d(t.remainingDays),1),a[4]||(a[4]=m("天 "))],64))],64))]))]),i.item.description?(r(),o("div",S,[c("p",V,d(i.item.description),1)])):h("",!0),c("div",W,[c("div",{class:"progress-bar",style:A({width:t.progress+"%"})},[c("span",{class:u({"inside-text":t.progress>=10,"outside-text":t.progress<10})},d(t.progress.toFixed(1))+"% ",3)],4)]),c("div",{class:u(["action-buttons",{show:i.isActive&&t.hasActions}])},[P(s.$slots,"actions",{},void 0,!0)],2)],10,B)}const j=Y(b,[["render",q],["__scopeId","data-v-9725501c"]]);export{j as P};
