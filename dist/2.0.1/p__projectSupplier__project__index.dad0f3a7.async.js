(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[51],{"2u/T":function(t,n,e){"use strict";e.r(n);var r,o,a,c=e("2Taf"),u=e.n(c),i=e("vZ4D"),s=e.n(i),p=e("MhPg"),l=e.n(p),f=e("l4Ni"),y=e.n(f),h=e("ujKo"),v=e.n(h),d=e("q1tI"),g=e.n(d),m=e("Kwg6"),w=e("/MKj");function b(t){var n=j();return function(){var e,r=v()(t);if(n){var o=v()(this).constructor;e=Reflect.construct(r,arguments,o)}else e=r.apply(this,arguments);return y()(this,e)}}function j(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}var R=(r=Object(w["c"])(function(t){var n=t.global;return{list:n._projectList}}),r((a=function(t){l()(e,t);var n=b(e);function e(t){var r;return u()(this,e),r=n.call(this,t),r.countType=function(){var t=r.props.history.location.pathname,n=t.split("/").pop();r.setState({type:n})},r.onQuery=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};r.props.dispatch({type:"global/project_list",payload:t}).then(function(){r.setState({data:r.props.list})})},r.state={type:"",data:[]},r}return s()(e,[{key:"componentDidMount",value:function(){this.countType(),this.onQuery()}},{key:"render",value:function(){var t=this.state,n=t.type,e=t.data;return g.a.createElement(g.a.Fragment,null,n?g.a.createElement(m["a"],{type:n,list:e,onQuery:this.onQuery}):null)}}]),e}(d["Component"]),o=a))||o);n["default"]=R}}]);