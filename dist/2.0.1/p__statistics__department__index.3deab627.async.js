(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[60],{"77+j":function(t,e,n){"use strict";n.r(e);var o,r,a,i=n("2Taf"),c=n.n(i),l=n("vZ4D"),u=n.n(l),s=n("MhPg"),p=n.n(s),d=n("l4Ni"),f=n.n(d),y=n("ujKo"),m=n.n(y),h=n("q1tI"),g=n.n(h),v=n("/MKj"),w=n("PeHD"),D=n("ItnA");function N(t){var e=R();return function(){var n,o=m()(t);if(e){var r=m()(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return f()(this,n)}}function R(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}var Q=function(t,e){var n=new Date(t,e,"0");return n.getDate()},T=Object(w["a"])((new Date).getTime()).split("-"),b="".concat(T[0],"-").concat(T[1],"-01 00:00:00"),j="".concat(T[0],"-").concat(T[1],"-").concat(Q(T[0],T[1])," 23:59:59"),x=(o=Object(v["c"])(function(t){var e=t.department,n=t.loading;return{loading:n.effects["department/list"]||!1,list:e.list,query:e.query,total:e.total,detailList:e.detailList,isNoRole:e.isNoRole}}),o((a=function(t){p()(n,t);var e=N(n);function n(t){var o;return c()(this,n),o=e.call(this,t),o.onQuery=function(t){o.props.dispatch({type:"department/list",payload:t})},o.inVoiceQuery=function(t){Object.assign(t,{deptId:t.id}),o.props.dispatch({type:"department/detailList",payload:t})},o.onExport=function(t){o.props.dispatch({type:"department/export",payload:t})},o.state={},o}return u()(n,[{key:"componentDidMount",value:function(){this.onQuery({startTime:new Date(b).getTime(),endTime:new Date(j).getTime(),dateType:0})}},{key:"render",value:function(){var t=this.props,e=t.loading,n=t.list,o=t.detailList,r=t.query,a=t.total,i=t.isNoRole;return console.log("Department -> render -> total",a),g.a.createElement(g.a.Fragment,null,g.a.createElement(D["a"],{onQuery:this.onQuery,list:n,detailList:o,loading:e,invoiceQuery:this.inVoiceQuery,query:r,total:a,type:"dept",onExport:this.onExport,chartName:"deptName",isNoRole:i,column:[{title:"\u90e8\u95e8",dataIndex:"deptName",width:150,render:function(t,e){return g.a.createElement("span",{style:{fontWeight:-1===e.id?"bolder":"normal"}},e.deptName)}}]}))}}]),n}(h["Component"]),r=a))||r);e["default"]=x}}]);