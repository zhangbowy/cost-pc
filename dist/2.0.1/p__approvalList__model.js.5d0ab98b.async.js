(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{aigb:function(e,a,t){"use strict";t.r(a);var n=t("p0pE"),p=t.n(n),s=t("d6i3"),r=t.n(s),i=t("t3Un"),o=t("ydnR"),u=t("6h6F"),l=o["r"].PAGE_SIZE;a["default"]={namespace:"approvalList",state:{list:[],query:{pageNo:1,pageSize:l},total:0},effects:{list:r.a.mark(function e(a,t){var n,p,s,o;return r.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=a.payload,p=t.call,s=t.put,e.next=4,p(i["a"],u["default"].list,n);case 4:return o=e.sent,e.next=7,s({type:"save",payload:{list:o.list||[],query:{pageSize:n.pageSize,pageNo:n.pageNo},total:o.page?o.page.total:0,sum:o.sum||0}});case 7:case"end":return e.stop()}},e)})},reducers:{save:function(e,a){var t=a.payload;return p()({},e,t)}}}}}]);