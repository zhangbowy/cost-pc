(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[67],{fwHm:function(e,t,n){"use strict";n.r(t);var u=n("d6i3"),r=n.n(u),l=n("p0pE"),a=n.n(l),s=n("t3Un"),i=n("ydnR"),o=n("5QBv"),c=i["r"].PAGE_SIZE;t["default"]={namespace:"projectS",state:{list:[],detailList:[],query:{pageNo:1,pageSize:c},total:0,chartList:[]},effects:{list:r.a.mark(function e(t,n){var u,l,i,c;return r.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return u=t.payload,l=n.call,i=n.put,e.next=4,l(s["b"],o["default"].list,u);case 4:return c=e.sent,console.log("*list -> response",c),c.unshift({projectName:"\u5408\u8ba1",id:-1,submitSum:c&&c.length?c.reduce(function(e,t){return e+t.submitSumAll},0):0,submitSumAll:c&&c.length?c.reduce(function(e,t){return e+t.submitSumAll},0):0,submitSumAnnulus:c&&c.length?c.reduce(function(e,t){return e+t.submitSumAnnulusAll},0):0,submitSumAnnulusAll:c&&c.length?c.reduce(function(e,t){return e+t.submitSumAnnulusAll},0):0,submitSumYear:c&&c.length?c.reduce(function(e,t){return e+t.submitSumYearAll},0):0,submitSumYearAll:c&&c.length?c.reduce(function(e,t){return e+t.submitSumYearAll},0):0,submitUserCount:c&&c.length?c.reduce(function(e,t){return e+t.submitUserCountAll},0):0,submitUserCountAll:c&&c.length?c.reduce(function(e,t){return e+t.submitUserCountAll},0):0,submitCount:c&&c.length?c.reduce(function(e,t){return e+t.submitCountAll},0):0,submitCountAll:c&&c.length?c.reduce(function(e,t){return e+t.submitCountAll},0):0,categoryCount:c&&c.length?c.reduce(function(e,t){return e+t.categoryCountAll},0):0,categoryCountAll:c&&c.length?c.reduce(function(e,t){return e+t.categoryCountAll},0):0,yearOnYear:c&&c.length?c[0].yearOnYear:0,annulus:c&&c.length?c[0].annulus:0,yearOnYearSymbolType:c&&c.length?c[0].yearOnYearSymbolType:0,annulusSymbolType:c&&c.length?c[0].annulusSymbolType:0,children:[]}),e.next=9,i({type:"save",payload:{list:c.map(function(e){return a()({},e,{submitSum:e.submitSumAll})})||[]}});case 9:case"end":return e.stop()}},e)}),detailList:r.a.mark(function e(t,n){var u,l,a,i;return r.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return u=t.payload,l=n.call,a=n.put,e.next=4,l(s["b"],o["default"].detailList,u);case 4:return i=e.sent,console.log("*list -> response",i),e.next=8,a({type:"save",payload:{detailList:i.list||[],query:{pageNo:u.pageNo,pageSize:u.pageSize},total:i.page.total||0}});case 8:case"end":return e.stop()}},e)}),chart:r.a.mark(function e(t,n){var u,l,a,i;return r.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return u=t.payload,l=n.call,a=n.put,e.next=4,l(s["b"],o["default"].chart,u);case 4:return i=e.sent,console.log("*list -> response",i),e.next=8,a({type:"save",payload:{chartList:i||[]}});case 8:case"end":return e.stop()}},e)}),export:r.a.mark(function e(t,n){var u,l;return r.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return u=t.payload,l=n.call,Object.assign(u,{exportType:"export",fileName:"\u9879\u76ee\u652f\u51fa\u8868"}),e.next=5,l(s["b"],o["default"].export,u);case 5:case"end":return e.stop()}},e)})},reducers:{save:function(e,t){var n=t.payload;return a()({},e,n)}}}}}]);