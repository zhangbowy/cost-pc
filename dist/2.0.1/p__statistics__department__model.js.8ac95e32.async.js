(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[61],{eqpG:function(e,t,n){"use strict";n.r(t);var u=n("p0pE"),r=n.n(u),l=n("d6i3"),a=n.n(l),s=(n("miYZ"),n("tsqr")),o=n("gWZ8"),i=n.n(o),c=n("t3Un"),p=n("ydnR"),d=n("fztW"),m=p["r"].PAGE_SIZE;t["default"]={namespace:"department",state:{list:[],detailList:[],query:{pageNo:1,pageSize:m},total:0,isNoRole:!1},effects:{list:a.a.mark(function e(t,n){var u,r,l,o,p,m,b,f,g,h,y;return a.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return u=t.payload,r=n.call,l=n.put,e.next=4,r(c["b"],d["default"].list,u,{withCode:!0});case 4:return o=e.sent,console.log("*list -> response",o),p=[],m=!1,200===o.code?(p=o.result,p&&p.length>1&&(b=p&&p.length?p.reduce(function(e,t){return e+t.submitSumAll},0):0,f=p&&p.length?p.reduce(function(e,t){return e+t.submitSumAnnulusAll},0):0,g=f?Number((100*((b-f)/f).toFixed(2)).toFixed(0)):0,h=p&&p.length?p.reduce(function(e,t){return e+t.submitSumYearAll},0):0,y=h?Number((100*((b-h)/h).toFixed(2)).toFixed(0)):0,p.unshift({deptName:"\u5408\u8ba1",id:-1,submitSum:b,submitSumAll:b,submitSumAnnulus:f,submitSumAnnulusAll:0,submitSumYear:h,submitSumYearAll:0,submitUserCount:p&&p.length?p.reduce(function(e,t){return e+t.submitUserCountAll},0):0,submitUserCountAll:p&&p.length?p.reduce(function(e,t){return e+t.submitUserCountAll},0):0,submitCount:p&&p.length?p.reduce(function(e,t){return e+t.submitCountAll},0):0,submitCountAll:p&&p.length?p.reduce(function(e,t){return e+t.submitCountAll},0):0,categoryCount:p&&p.length?p.reduce(function(e,t){return e+t.categoryCountAll},0):0,categoryCountAll:p&&p.length?p.reduce(function(e,t){return e+t.categoryCountAll},0):0,yearOnYear:Math.abs(y),annulus:Math.abs(g),yearOnYearSymbolType:0===h?null:y>0?0:1,annulusSymbolType:0===f?null:g>0?0:1,children:[],childrens:i()(p)}))):90065===o.code?m=!0:s["a"].error(o.message),e.next=11,l({type:"save",payload:{list:p||[],isNoRole:m}});case 11:case"end":return e.stop()}},e)}),detailList:a.a.mark(function e(t,n){var u,r,l,s;return a.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return u=t.payload,r=n.call,l=n.put,e.next=4,r(c["b"],d["default"].detailList,u);case 4:return s=e.sent,console.log("*list -> response",s),e.next=8,l({type:"save",payload:{detailList:s.list||[],total:s.page.total||0,query:{pageNo:u.pageNo,pageSize:u.pageSize}}});case 8:case"end":return e.stop()}},e)}),export:a.a.mark(function e(t,n){var u,r;return a.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return u=t.payload,r=n.call,Object.assign(u,{exportType:"export",fileName:"\u90e8\u95e8\u652f\u51fa\u8868"}),e.next=5,r(c["b"],d["default"].export,u);case 5:case"end":return e.stop()}},e)})},reducers:{save:function(e,t){var n=t.payload;return r()({},e,n)}}}}}]);