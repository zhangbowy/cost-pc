(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[70],{CbRA:function(e,t,a){"use strict";a.r(t);a("g9YV");var n=a("wCAj"),r=(a("Awhp"),a("KrTs")),o=(a("5Dmo"),a("3S7+")),l=(a("miYZ"),a("tsqr")),c=a("p0pE"),s=a.n(c),i=a("2Taf"),u=a.n(i),d=a("vZ4D"),p=a.n(d),m=a("MhPg"),f=a.n(m),h=a("l4Ni"),y=a.n(h),v=a("ujKo"),S=a.n(v),g=(a("y8nQ"),a("Vl3Y")),x=a("q1tI"),E=a.n(x),w=a("wd/R"),b=a.n(w),N=a("/MKj"),C=a("l59Y"),k=a("e9Pg"),D=a.n(k),I=a("z0WU"),R=a("ydnR"),O=(a("14J3"),a("BMrR")),V=(a("Pwec"),a("CtXQ")),T=a("jehZ"),K=a.n(T),M=a("eHn4"),Y=a.n(M),P=a("d6i3"),_=a.n(P),L=a("1l/V"),j=a.n(L),A=(a("OaEy"),a("2fM7")),B=(a("iQDF"),a("+eQT")),z=(a("nRaC"),a("5RzL")),F=a("2g+w"),Q=(a("5NDa"),a("5rEg")),q=(a("ozfa"),a("MJZm")),U=a("o4C9"),J=a.n(U);function Z(e){var t=H();return function(){var a,n=S()(e);if(t){var r=S()(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return y()(this,a)}}function H(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var W=function(e){f()(a,e);var t=Z(a);function a(e){var n;return u()(this,a),n=t.call(this,e),n.state={},n}return p()(a,[{key:"render",value:function(){var e=this.props.visible;return console.log(e),E.a.createElement("div",{className:J.a.ModalBox,style:{display:e?"block":"none"}},E.a.createElement("div",{className:J.a.Modal,style:{position:"fiexd"}},this.props.children))}}]),a}(x["Component"]),G=W;function X(e){var t=$();return function(){var a,n=S()(e);if(t){var r=S()(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return y()(this,a)}}function $(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var ee,te,ae,ne,re=q["a"].TreeNode,oe=Q["a"].Search,le=function(e){f()(a,e);var t=X(a);function a(e){var n;return u()(this,a),n=t.call(this,e),n.onChange=function(e){var t=e.target.value,a=n.props.treeData;console.log(t);var r=n.returnTree(a,t);console.log("Arr========",r),n.setState({treeData:r,autoExpandParent:!0})},n.showModel=function(){var e=n.state.visible;e?n.setState({visible:!1}):n.setState({visible:!0})},n.onExpand=function(e){console.log("onExpand",e),n.setState({expandedKeys:e,autoExpandParent:!1})},n.onCheck=function(e){console.log("onCheck",e),n.setState({checkedKeys:e})},n.onSelect=function(e,t){console.log("onSelect",t),n.setState({selectedKeys:e})},n.renderTreeNodes=function(e){return e.map(function(e){return e.children?E.a.createElement(re,{title:e.title,key:e.key,dataRef:e},n.renderTreeNodes(e.children)):E.a.createElement(re,K()({key:e.key},e))})},n.state={expandedKeys:["0-0-0","0-0-1"],autoExpandParent:!0,checkedKeys:["0-0-0"],selectedKeys:[],treeData:e.treeData,visible:!1},n}return p()(a,[{key:"componentDidMount",value:function(){}},{key:"returnTree",value:function(e,t){var a=this,n=e.filter(function(e){if(-1!==e.title.indexOf(t))return e;if(e.children){var n={},r=a.returnTree(e.children,t);if(r.length)return n=s()({},e),n}return!1});return n}},{key:"render",value:function(){var e=this.state,t=e.treeData,a=e.visible;return console.log(a),console.log("treeData=======",t),E.a.createElement("span",null,E.a.createElement(Q["a"],{type:"Group",onClick:this.showModel}),E.a.createElement(G,{visible:a},E.a.createElement(oe,{style:{marginBottom:8},placeholder:"Search",onChange:this.onChange}),E.a.createElement(q["a"],{checkable:!0,onExpand:this.onExpand,switcherIcon:E.a.createElement(V["a"],{type:"down"}),expandedKeys:this.state.expandedKeys,autoExpandParent:this.state.autoExpandParent,onCheck:this.onCheck,checkedKeys:this.state.checkedKeys,onSelect:this.onSelect,selectedKeys:this.state.selectedKeys},this.renderTreeNodes(t))))}}]),a}(x["Component"]),ce=le,se=a("x8NF"),ie=a.n(se),ue=a("Ybk9");function de(e){var t=pe();return function(){var a,n=S()(e);if(t){var r=S()(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return y()(this,a)}}function pe(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var me,fe,he,ye,ve=z["a"].TreeNode,Se=B["a"].RangePicker,ge=A["a"].Option,xe=z["a"].SHOW_CHILD,Ee=(ee=g["a"].create(),te=Object(N["c"])(function(e){var t=e.global;return{costCategoryList:t.costCategoryList,invoiceList:t.invoiceList,projectList:t.projectList,supplierList:t.supplierList}}),ee(ae=te((ne=function(e){f()(a,e);var t=de(a);function a(e){var n;return u()(this,a),n=t.call(this,e),n.onShow=j()(_.a.mark(function e(){var t;return _.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(t=n.state.visible,console.log(11111,t),!t){e.next=5;break}return n.setState({visible:!1}),e.abrupt("return");case 5:return e.next=7,n.props.dispatch({type:"global/projectList",payload:{}});case 7:return e.next=9,n.props.dispatch({type:"global/supplierList",payload:{}});case 9:return e.next=11,n.props.dispatch({type:"global/costList",payload:{}}).then(function(){n.props.dispatch({type:"global/invoiceList",payload:{}}).then(function(){var e=n.props.details;if(e){var t=e.userVOS,a=e.deptVOS,r=e.createUserVOS,o=e.createDeptVOS;n.setState({userVOS:t,deptVOS:a,createUserVOS:r,createDeptVOS:o,details:e})}n.setState({visible:!0})})});case 11:case"end":return e.stop()}},e)})),n.onSubmit=function(){var e=n.state,t=e.deptVOS,a=e.userVOS,r=e.createUserVOS,o=e.createDeptVOS;n.props.form.validateFieldsAndScroll(function(e,l){if(!e){var c=l.time,i="",u="";c&&c.length>0&&(i=b()(c[0]).format("x"),u=b()(c[1]).format("x")),l.time&&delete l.time;var d=s()({},l,{userVOS:a,deptVOS:t,createUserVOS:r,createDeptVOS:o,payEndTime:u,payStartTime:i});n.onCancel(),n.props.onOk(d)}})},n.selectPle=function(e,t,a){var r;console.log(n.state.visible),n.setState({visible:!0}),n.setState((r={},Y()(r,"".concat(t,"VOS"),e.users||[]),Y()(r,"".concat(a,"VOS"),e.depts||[]),r)),n.onSubmit()},n.onReset=function(){n.setState({deptVOS:[],userVOS:[],createUserVOS:[],createDeptVOS:[],details:{}}),n.props.form.resetFields(),n.onSubmit()},n.onCancel=function(){console.log(555555),n.setState({visible:!1})},n.renderTreeNodes=function(e){return e.map(function(e){return e.children?E.a.createElement(ve,{title:e.title,key:e.value,dataRef:e},n.renderTreeNodes(e.children)):E.a.createElement(ve,K()({key:e.value},e))})},n.onExpand=function(e){n.setState({expandedKeys:e})},n.getParentKey=function(e,t){for(var a,r=0;r<t.length;r++){var o=t[r];o.children&&(o.children.some(function(t){return t.key===e})?a=o.key:n.getParentKey(e,o.children)&&(a=n.getParentKey(e,o.children)))}return a},n.onSearch=function(e){var t=n.props.invoiceList,a=e.target.value,r=t.map(function(e){return e.title.indexOf(a)>-1?n.getParentKey(e.key,n.state.invList):null}).filter(function(e,t,a){return e&&a.indexOf(e)===t});n.setState({expandedKeys:r})},n.state={visible:!1,deptVOS:[],userVOS:[],createUserVOS:[],createDeptVOS:[],details:{},expandedKeys:[]},n}return p()(a,[{key:"componentDidMount",value:function(){var e=this;window.onclick=function(t){var a=document.getElementsByClassName(ie.a.model),n=document.getElementsByClassName(ie.a.modelBox),r=!0;console.log(1111,t),Array.prototype.forEach.call(a,function(e){-1!==t.path.indexOf(e)&&(r=!1)}),Array.prototype.forEach.call(n,function(e){-1!==t.path.indexOf(e)&&(r=!1)}),r&&e.onCancel()}}},{key:"render",value:function(){var e=this,t=this.props,a=t.children,n=t.form.getFieldDecorator,r=t.costCategoryList,o=t.invoiceList,l=t.projectList,c=t.supplierList,s=this.state.expandedKeys;console.log(s);var i={labelCol:{xs:{span:24},sm:{span:7}},wrapperCol:{xs:{span:24},sm:{span:15}}},u=r,d=Object(F["a"])({rootId:0,pId:"parentId",name:"costName",tName:"title",tId:"value"},u);console.log("lists",d);var p=Object(F["a"])({rootId:0,pId:"parentId",name:"name",tName:"title",tId:"value"},o),m=Object(F["a"])({rootId:0,pId:"parentId",name:"name",tName:"title",tId:"value"},l),f=this.state,h=f.visible,y=f.userVOS,v=f.deptVOS,S=f.details;return E.a.createElement("span",null,E.a.createElement("span",{className:ie.a.modelBox,onClick:this.onShow},a||E.a.createElement("div",{className:"head_rg",style:{cursor:"pointer",verticalAlign:"middle"}},E.a.createElement("div",{className:"".concat(ie.a.iconBox," m-r-8 ").concat(h?" active-bg":"")},E.a.createElement(V["a"],{className:"sub-color",type:"filter"})),E.a.createElement("span",{className:"fs-14 sub-color"},"\u7b5b\u9009")),E.a.createElement("div",{className:ie.a.model,style:{display:h?"block":"none"},onClick:function(e){e.stopPropagation()}},E.a.createElement(g["a"],{className:"formItem"},E.a.createElement(O["a"],null,E.a.createElement(g["a"].Item,K()({label:"\u627f\u62c5\u4eba/\u90e8\u95e8"},i),E.a.createElement(ue["a"],{users:y,depts:v,isinput:!1,onChange:this.onChange,placeholder:E.a.createElement("div",{className:"c-black-50 cur-p"},E.a.createElement(V["a"],{className:"fs-20 m-r-4 c-black-50",type:"user-add"}),"\u5f85\u9009\u62e9"),onSelectPeople:function(t){return e.selectPle(t,"user","dept")},invalid:!1,disabled:!1,flag:"useApep"}))),E.a.createElement(O["a"],null,E.a.createElement(g["a"].Item,K()({label:"\u4ed8\u6b3e\u65f6\u95f4"},i),n("time",{initialValue:S.payStartTime&&S.payEndTime?[b()(b()(Number(S.payStartTime)).format("YYYY-MM-DD"),"YYYY-MM-DD"),b()(b()(Number(S.payEndTime)).format("YYYY-MM-DD"),"YYYY-MM-DD")]:[]})(E.a.createElement(Se,null)))),E.a.createElement(O["a"],null,E.a.createElement(g["a"].Item,K()({label:"\u5355\u636e\u7c7b\u578b"},i),n("invoiceTemplateIds",{initialValue:S.invoiceTemplateIds||[]})(E.a.createElement(ce,{onChange:this.onChange,treeData:p})))),E.a.createElement(O["a"],null,E.a.createElement(g["a"].Item,K()({label:"\u5ba1\u6279\u72b6\u6001"},i),n("approveStatus",{initialValue:S.approveStatus||""})(E.a.createElement(A["a"],{placeholder:"\u8bf7\u9009\u62e9"},R["g"].map(function(e){return E.a.createElement(ge,{key:e.key},e.value)}))))),E.a.createElement(O["a"],null,E.a.createElement(g["a"].Item,K()({label:"\u9879\u76ee"},i),n("projectIds",{initialValue:S.projectIds||[]})(E.a.createElement(z["a"],{treeData:m,placeholder:"\u8bf7\u9009\u62e9\u9879\u76ee",treeCheckable:!0,style:{width:"100%"},showCheckedStrategy:xe,dropdownStyle:{height:"300px"}})))),E.a.createElement(O["a"],null,E.a.createElement(g["a"].Item,K()({label:"\u4f9b\u5e94\u5546"},i),n("supplierIds",{initialValue:S.supplierIds||[]})(E.a.createElement(z["a"],{treeData:c,placeholder:"\u8bf7\u9009\u62e9\u4f9b\u5e94\u5546",treeCheckable:!0,style:{width:"100%"},showCheckedStrategy:xe,dropdownStyle:{height:"300px"}}))))),E.a.createElement("div",{className:"".concat(ie.a.modelBottom," cur-p"),onClick:this.onReset},E.a.createElement("span",{className:"iconfont iconshanchu fs-24 vt-m"}),"\u6e05\u7a7a\u6240\u6709\u7b5b\u9009\u6761\u4ef6"))))}}]),a}(x["Component"]),ae=ne))||ae)||ae),we=Ee,be=a("MlUV"),Ne=a("FMVj"),Ce=a.n(Ne);function ke(e){var t=De();return function(){var a,n=S()(e);if(t){var r=S()(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return y()(this,a)}}function De(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var Ie=R["r"].APP_API,Re=(me=g["a"].create(),fe=Object(N["c"])(function(e){var t=e.loading,a=e.summary;return{loading:t.effects["summary/list"]||!1,list:a.list,query:a.query,total:a.total,exportData:a.exportData}}),me(he=fe((ye=function(e){f()(a,e);var t=ke(a);function a(e){var n;return u()(this,a),n=t.call(this,e),n.onOk=function(){var e=n.props.query,t=n.props.form.getFieldValue("createTime"),a="",r="";t&&t.length>0&&(a=b()(t[0]).format("x"),r=b()(t[1]).format("x"));var o=n.state,l=o.searchContent,c=o.leSearch;n.onQuery(s()({},e,{pageNo:1,startTime:a,endTime:r,content:l},c))},n.handChange=function(e){if(!e){var t=n.state,a=t.searchContent,r=t.leSearch,o=n.props.query;n.onQuery(s()({},o,{content:a},r))}},n.onLink=function(e){n.props.history.push("/system/auth/".concat(e))},n.onQuery=function(e){n.props.dispatch({type:"summary/list",payload:e})},n.onSelectAll=function(e,t,a){var r=I["o"].onSelectAll(n.state,e,a),o=r.selectedRows,l=r.selectedRowKeys,c=0;o.forEach(function(e){c+=e.submitSum}),n.setState({selectedRows:o,selectedRowKeys:l,sumAmount:c})},n.onSelect=function(e,t){var a=I["o"].onSelect(n.state,e,t),r=a.selectedRows,o=a.selectedRowKeys,l=0;r.forEach(function(e){l+=e.submitSum}),n.setState({selectedRows:r,selectedRowKeys:o,sumAmount:l})},n.onDelete=function(e){var t=I["o"].onDelete(n.state,e),a=t.selectedRows,r=t.selectedRowKeys,o=0;a.forEach(function(e){o+=e.submitSum}),n.setState({selectedRows:a,selectedRowKeys:r,sumAmount:o})},n.onSearch=function(e){var t=n.props.query,a=n.props.form.getFieldValue("createTime"),r="",o="";a&&a.length>0&&(r=b()(a[0]).format("x"),o=b()(a[1]).format("x")),n.setState({searchContent:e});var l=n.state.leSearch;n.onQuery(s()({},t,{pageNo:1,content:e,startTime:r,endTime:o},l))},n.print=function(){var e=n.state.selectedRows;e.length>1?l["a"].error("\u53ea\u652f\u6301\u6253\u5370\u4e00\u6761\u6570\u636e"):0!==e.length?window.location.href="".concat(Ie,"/cost/export/pdfDetail?token=").concat(localStorage.getItem("token"),"&id=").concat(e[0].invoiceSubmitId):l["a"].error("\u8bf7\u9009\u62e9\u4e00\u6761\u6570\u636e\u6253\u5370")},n.handleSearch=function(e){var t=n.props.query,a=n.props.form.getFieldValue("createTime"),r="",o="";a&&a.length>0&&(r=b()(a[0]).format("x"),o=b()(a[1]).format("x")),n.setState({leSearch:e});var l=n.state.searchContent;n.onQuery(s()({},t,{pageNo:1,content:l},e,{startTime:r,endTime:o}))},n.export=function(e){var t=n.state.selectedRowKeys;if(0!==t.length||"1"!==e){var a=n.props.form.getFieldValue("createTime"),r="",o="";a&&a.length>0&&(r=b()(a[0]).format("x"),o=b()(a[1]).format("x"));var c=n.state,i=c.searchContent,u=c.leSearch,d={};"1"===e?d={ids:t}:"2"===e&&(d=s()({searchContent:i},u,{startTime:r,endTime:o})),n.props.dispatch({type:"summary/export",payload:s()({},d)})}else l["a"].error("\u8bf7\u9009\u62e9\u8981\u5bfc\u51fa\u7684\u6570\u636e")},n.state={selectedRowKeys:[],count:0,sumAmount:0,searchContent:"",leSearch:{},selectedRows:[]},n}return p()(a,[{key:"componentDidMount",value:function(){var e=this.props.query;this.onQuery(s()({},e))}},{key:"render",value:function(){var e=this,t=this.state,a=t.selectedRowKeys,l=t.sumAmount,c=t.leSearch,i=this.props,u=i.list,d=i.query,p=i.total,m=i.loading,f=[{title:"\u652f\u51fa\u7c7b\u522b",dataIndex:"categoryName",width:100,render:function(e){return E.a.createElement("span",null,E.a.createElement(o["a"],{placement:"topLeft",title:e||""},E.a.createElement("span",{className:"eslips-2"},e)))}},{title:"\u91d1\u989d\uff08\u5143\uff09",dataIndex:"submitSum",render:function(e){return E.a.createElement("span",null,e?e/100:0)},width:100},{title:"\u62a5\u9500\u4eba",dataIndex:"userName",width:130},{title:"\u62a5\u9500\u90e8\u95e8",dataIndex:"deptName",width:130},{title:"\u9879\u76ee",dataIndex:"projectName",width:130},{title:"\u62a5\u9500\u4e8b\u7531",dataIndex:"reason",width:150,render:function(e){return E.a.createElement("span",null,E.a.createElement(o["a"],{placement:"topLeft",title:e||"",arrowPointAtCenter:!0},E.a.createElement("span",{className:"eslips-2"},e)))}},{title:"\u5355\u53f7",dataIndex:"invoiceNo",width:140},{title:"\u5355\u636e\u7c7b\u578b",dataIndex:"invoiceTemplateName",width:100,render:function(e){return E.a.createElement("span",null,e||"-")}},{title:"\u63d0\u4ea4\u4eba",dataIndex:"createUserName",width:100},{title:"\u63d0\u4ea4\u4eba\u90e8\u95e8",dataIndex:"createDeptName",width:100},{title:"\u63d0\u4ea4\u65f6\u95f4",dataIndex:"createTime",render:function(e){return E.a.createElement("span",null,e&&b()(e).format("YYYY-MM-DD"))},width:120},{title:"\u53d1\u653e\u4eba",dataIndex:"payUserName",width:100},{title:"\u4ed8\u6b3e\u65f6\u95f4",dataIndex:"payTime",render:function(e){return E.a.createElement("span",null,e&&b()(e).format("YYYY-MM-DD"))},width:100},{title:"\u5ba1\u6279\u72b6\u6001",dataIndex:"approveStatus",render:function(e){return E.a.createElement("span",null,Object(R["z"])(e,R["g"]))},width:100},{title:"\u53d1\u653e\u72b6\u6001",dataIndex:"status",render:function(e){return E.a.createElement("span",null,2===Number(e)||3===Number(e)?E.a.createElement(r["a"],{color:2===Number(e)?"rgba(255, 148, 62, 1)":"rgba(0, 0, 0, 0.25)",text:Object(R["z"])(e,R["C"])}):E.a.createElement("span",null,Object(R["z"])(e,R["C"])))},width:100},{title:"\u64cd\u4f5c",dataIndex:"ope",render:function(e,t){return E.a.createElement("span",null,E.a.createElement(C["a"],{id:t.invoiceSubmitId,templateType:0},E.a.createElement("a",null,"\u67e5\u770b")))},width:80,fixed:"right",className:"fixCenter"}],h={type:"checkbox",selectedRowKeys:a,onSelect:this.onSelect,onSelectAll:this.onSelectAll,columnWidth:"24px"};return E.a.createElement("div",{className:"content-dt",style:{padding:0}},E.a.createElement("div",{className:Ce.a.payContent},E.a.createElement("div",{className:"cnt-header",style:{display:"flex"}},E.a.createElement("div",{className:"head_lf"},E.a.createElement(be["a"],{selectKeys:a,total:p,className:"m-l-8",onExport:function(t){return e.export(t)}},"\u5bfc\u51fa"),E.a.createElement(g["a"],{style:{display:"flex",marginLeft:"8px"}},E.a.createElement(D.a,{placeholder:"\u5355\u53f7 \u4e8b\u7531 \u6536\u6b3e\u4eba",style:{width:"272px",marginLeft:"8px"},onSearch:function(t){return e.onSearch(t)}}))),E.a.createElement(we,{onOk:this.handleSearch,details:c})),E.a.createElement("p",{className:"c-black-85 fw-500 fs-14",style:{marginBottom:"8px"}},"\u5df2\u9009",a.length,"\u7b14\u8d39\u7528\uff0c\u5171\u8ba1\xa5",l/100),E.a.createElement(n["a"],{columns:f,dataSource:u,scroll:{x:2200},rowKey:"id",rowSelection:h,loading:m,pagination:{current:d.pageNo,onChange:function(t){var a=e.props.form.getFieldValue("createTime"),n="",r="";a&&a.length>0&&(n=b()(a[0]).format("x"),r=b()(a[1]).format("x"));var o=e.state.searchContent;e.onQuery(s()({pageNo:t,pageSize:d.pageSize,content:o,endTime:r,startTime:n},c))},total:p,size:"small",showTotal:function(){return"\u5171".concat(p,"\u6761\u6570\u636e")},showSizeChanger:!0,showQuickJumper:!0,onShowSizeChange:function(t,a){var n=e.props.form.getFieldValue("createTime"),r="",o="";n&&n.length>0&&(r=b()(n[0]).format("x"),o=b()(n[1]).format("x"));var l=e.state.searchContent;e.onQuery(s()({pageNo:1,pageSize:a,content:l,endTime:o,startTime:r},c))}}})))}}]),a}(E.a.PureComponent),he=ye))||he)||he);t["default"]=Re},o4C9:function(e,t,a){e.exports={ModalBox:"ModalBox___52w2_",Modal:"Modal___17MZ6"}},x8NF:function(e,t,a){e.exports={footerBtn:"footerBtn___2pbxp",iconBox:"iconBox___2V1Iz",modelBox:"modelBox___NPlOY",model:"model___2we3j",modelBottom:"modelBottom___3ethK"}}}]);