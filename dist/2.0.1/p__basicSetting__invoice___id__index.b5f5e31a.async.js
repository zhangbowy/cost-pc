(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[23],{"U/iS":function(e,t,a){"use strict";a.r(t);a("+L6B");var n,l,o,r=a("2/Rp"),i=a("jehZ"),s=a.n(i),c=(a("lUTK"),a("BvKs")),p=(a("h7lp"),a("bf48")),d=a("eHn4"),u=a.n(d),m=a("gWZ8"),f=a.n(m),h=a("p0pE"),y=a.n(h),g=a("2Taf"),v=a.n(g),E=a("vZ4D"),b=a.n(E),C=a("MhPg"),N=a.n(C),x=a("l4Ni"),_=a.n(x),L=a("ujKo"),I=a.n(L),S=a("q1tI"),k=a.n(S),R=a("/MKj"),A=a("TSYQ"),V=a.n(A),P=a("2g+w"),T=a("KtMI"),w=a("0AXd"),O=a("XohA"),F=(a("T2oS"),a("W9HT")),J=(a("BoS7"),a("Sdc0")),D=(a("sRBo"),a("kaz8")),j=(a("Pwec"),a("CtXQ")),B=(a("/zsF"),a("PArb")),M=(a("5Dmo"),a("3S7+")),U=(a("7Kak"),a("9yH6")),W=(a("5NDa"),a("5rEg")),z=(a("y8nQ"),a("Vl3Y")),H=(a("nRaC"),a("5RzL")),Q=(a("OaEy"),a("2fM7")),q=a("27j4"),K=a.n(q),Z=a("ydnR"),X=a("ctdo"),G=a.n(X),Y=a("vHfd"),$=a("Kc98"),ee=a("+Ixc"),te=a.n(ee);function ae(e){var t=ne();return function(){var a,n=I()(e);if(t){var l=I()(this).constructor;a=Reflect.construct(n,arguments,l)}else a=n.apply(this,arguments);return _()(this,a)}}function ne(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var le,oe,re,ie={name:"\u540d\u79f0",parentId:"\u6240\u5c5e\u5206\u7ec4",note:"\u63cf\u8ff0",isAllUse:"\u53ef\u7528\u4eba\u5458",isAllCostCategory:"\u53ef\u9009\u652f\u51fa\u7c7b\u522b",approveId:"\u5ba1\u6279\u6d41",icon:"\u56fe\u6807",status:"\u542f\u7528"},se=Q["a"].Option,ce=H["a"].SHOW_CHILD,pe=[{key:"0",value:"\u7981\u7528"},{key:"1",value:"\u542f\u7528\u975e\u5fc5\u586b"},{key:"2",value:"\u542f\u7528\u5fc5\u586b"}],de=(n=z["a"].create(),n((o=function(e){N()(a,e);var t=ae(a);function a(e){var n;return v()(this,a),n=t.call(this,e),n.getFormItem=function(){var e=n.props,t=e.form,a=e.costCategoryList,l=e.templateType,o={},r=n.state,i=r.category,s=r.users,c=r.deptJson;return t.validateFieldsAndScroll(function(e,t){if(e)o=null;else{console.log("Basic -> getFormItem -> values",t);var r=[];if(i&&i.length>0&&(console.log(i),i.forEach(function(e){r.push(n.findIndex(a,e))}),Object.assign(o,{costCategoryJson:r.length>0&&JSON.stringify(r)})),t.relation){var p={isRelationLoan:!1,isWriteByRelationLoan:!1};t.relation.forEach(function(e){p[e]=!0}),Object.assign(t,y()({},p))}if(t.relations){var d={isRelationApply:!1,isWriteByRelationApply:!1};t.relations.forEach(function(e){d[e]=!0}),Object.assign(t,y()({},d))}t.isAllUse||(s&&s.length>0&&Object.assign(o,{userJson:s}),c&&c.length>0&&Object.assign(o,{deptJson:c})),2===l&&Object.assign(t,{categoryStatus:Number(t.categoryStatus)}),Object.assign(o,y()({},o,t))}}),o},n.findIndex=function(e,t){var a={};function n(e){e.forEach(function(e){e.value!==t?e.children&&e.children.length>0&&n(e.children,t):a={id:e.value,costName:e.label}})}return n(e),a},n.onChange=function(e,t){n.setState(u()({},t,e.target.value)),"user"===t?n.setState({users:[],deptJson:[]}):"cost"===t?n.setState({category:[]}):"costStatus"===t&&"0"===e.target.value&&n.setState({category:[],cost:!0})},n.getChild=function(e){for(var t=[],a=0;a<e.length;a+=1)t.push(e[a].props.value),e[a].props.children.length>0&&t.push.apply(t,f()(n.getChild(e[a].props.children)));return t},n.onChangeTree=function(e,t,a){console.log(n.getChild(a.triggerNode.props.children)),console.log(a),n.setState({category:e})},n.selectPle=function(e){n.setState({users:e.users||[],deptJson:e.depts||[]})},n.onChangeSelect=function(e){n.onCancel();var t=n.props.templateType;n.props.dispatch({type:"addInvoice/approveList",payload:{templateType:t}}).then(function(){var t=n.props,a=t.approveList,l=t.onChangeData;console.log("Basic -> onChangeSelect -> approveList",a),l("approveList",a),n.setState({approveList:a},function(){if("add"===e){var t=a.length;n.setState({flowId:a[t-1].id})}})})},n.onCancel=function(){n.setState({visible:!1})},n.edit=function(e,t){console.log("\u70b9\u51fb\u4e00\u4e0b");var a=n.props.templateType,l=a?"".concat(Z["M"][a],"\u5ba1\u6279\u6d41"):"\u62a5\u9500\u5355\u5ba1\u6279\u6d41";"edit"===e&&(l=t.templateName),n.setState({visible:!0,name:l,title:e})},n.onChangeRelation=function(e,t){n.props.onChanges(t,e)},console.log(e.data.isAllUse),n.state={user:!(e.data&&(!e.data||void 0!==e.data.isAllUse))||e.data.isAllUse,cost:!(e.data&&(!e.data||void 0!==e.data.isAllCostCategory))||e.data.isAllCostCategory,category:e.category||[],users:e.data&&e.data.userJson||[],deptJson:e.data&&e.data.deptJson||[],flowId:e.data&&e.data.approveId||"",approveList:e.approveList||[],visible:!1,title:"add",name:"",costStatus:n.props.data&&n.props.data.categoryStatus?"".concat(n.props.data.categoryStatus):"0"},n}return b()(a,[{key:"componentDidUpdate",value:function(e){e.data!==this.props.data&&this.setState({user:!(this.props.data&&(!this.props.data||void 0!==this.props.data.isAllUse))||this.props.data.isAllUse,cost:!(this.props.data&&(!this.props.data||void 0!==this.props.data.isAllCostCategory))||this.props.data.isAllCostCategory,category:this.props.category||[],users:this.props.data&&this.props.data.userJson||[],deptJson:this.props.data&&this.props.data.deptJson||[],flowId:this.props.data&&this.props.data.approveId||"",title:"add",name:"",costStatus:this.props.data&&this.props.data.categoryStatus?"".concat(this.props.data.categoryStatus):"0"}),e.approveList.length!==this.props.approveList.length&&this.setState({approveList:this.props.approveList})}},{key:"onRest",value:function(){this.setState({user:!0,cost:!0,category:[],users:[],deptJson:[]}),this.props.form.resetFields()}},{key:"render",value:function(){var e=this,t=this.props,a=t.form.getFieldDecorator,n=t.data,l=t.list,o=t.costCategoryList,r=t.templateType,i=t.dispatch,c=t.reApply,p=t.reLoan,d=this.state,u=d.cost,m=d.user,f=d.category,h=d.users,y=d.deptJson,g=d.flowId,v=d.approveList,E=d.visible,b=d.name,C=d.title,N=d.costStatus;console.log("data",n);var x=l&&l.filter(function(e){return 0===Number(e.type)&&e.templateType==r})||[],_={labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:19}}};return k.a.createElement(F["a"],{spinning:this.props.detailLoading},k.a.createElement("div",{style:{width:"100%",paddingTop:"24px",overflowY:"scroll"}},k.a.createElement(z["a"],s()({},_,{className:"formItem",style:{width:"450px"}}),k.a.createElement(z["a"].Item,{label:ie.name},a("name",{initialValue:n&&n.name,rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u540d\u79f0"}]})(k.a.createElement(W["a"],{placeholder:"\u8bf7\u8f93\u5165\u540d\u79f0"}))),k.a.createElement(z["a"].Item,{label:ie.parentId},a("parentId",{initialValue:n&&n.parentId||"0"})(k.a.createElement(Q["a"],null,k.a.createElement(se,{key:"0"},"\u65e0"),x.map(function(e){return k.a.createElement(se,{key:e.id},e.name)})))),k.a.createElement(z["a"].Item,{label:ie.note},a("note",{initialValue:n&&n.note,rules:[{max:50,message:"\u4e0d\u80fd\u8d85\u8fc750\u5b57"}]})(k.a.createElement(K.a,{max:50}))),k.a.createElement(z["a"].Item,{label:ie.isAllUse},a("isAllUse",{initialValue:m})(k.a.createElement(G.a,{onChange:function(t){return e.onChange(t,"user")}},Z["F"].map(function(e){return k.a.createElement(U["a"],{key:e.key,value:e.key},e.value)}))),!m&&k.a.createElement(Y["a"],{users:h,depts:y,placeholder:"\u8bf7\u9009\u62e9",onSelectPeople:function(t){return e.selectPle(t)},invalid:!1,disabled:!1})),2===r&&k.a.createElement(z["a"].Item,{label:"\u652f\u51fa\u660e\u7ec6"},a("categoryStatus",{initialValue:N})(k.a.createElement(G.a,{onChange:function(t){return e.onChange(t,"costStatus")}},pe.map(function(e){return k.a.createElement(U["a"],{key:e.key,value:e.key},e.value,"0"===e.key&&k.a.createElement(M["a"],{title:"\u7981\u7528\u540e\uff0c\u8be5\u7533\u8bf7\u5355\u6a21\u7248\u4e0d\u652f\u6301\u6dfb\u52a0\u652f\u51fa\u660e\u7ec6"},k.a.createElement("i",{className:"iconfont iconIcon-yuangongshouce fs-14 m-l-8"})))})))),(!r||3===r||2===r&&"0"!==N)&&k.a.createElement(z["a"].Item,{label:ie.isAllCostCategory},a("isAllCostCategory",{initialValue:u})(k.a.createElement(G.a,{onChange:function(t){return e.onChange(t,"cost")}},Z["E"].map(function(e){return k.a.createElement(U["a"],{key:e.key,value:e.key},e.value)}))),!u&&a("costCategory",{initialValue:f})(k.a.createElement(H["a"],{onChange:function(t,a,n){return e.onChangeTree(t,a,n)},treeData:o,treeCheckable:!0,style:{width:"100%"},showCheckedStrategy:ce,dropdownStyle:{height:"300px"}}))),k.a.createElement(z["a"].Item,{label:ie.approveId},a("approveId",{initialValue:g,rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u5ba1\u6279\u6d41"}]})(k.a.createElement(Q["a"],{key:"flow",placeholder:"\u8bf7\u9009\u62e9",optionLabelProp:"label",getPopupContainer:function(e){return e.parentNode},dropdownClassName:te.a.addSel,onChange:function(t){e.setState({flowId:t})},dropdownStyle:{height:"300px"},dropdownRender:function(t){return k.a.createElement("div",null,k.a.createElement("span",{onMouseDown:function(e){e.preventDefault()}},t),v.length&&!v[0].processOperationPermission&&k.a.createElement(k.a.Fragment,null,k.a.createElement(B["a"],{style:{margin:"0"}}),k.a.createElement("div",{key:"event",style:{height:"50px",textAlign:"center",lineHeight:"50px"},onClick:function(){return e.edit("add")},onMouseDown:function(e){e.preventDefault()}},k.a.createElement(j["a"],{type:"plus",className:"sub-color m-r-8"}),k.a.createElement("a",{className:"fs-14"},"\u65b0\u5efa\u5ba1\u6279\u6d41"))))}},v.filter(function(e){return e.templateType===Number(r)}).map(function(t){return k.a.createElement(se,{key:t.id,label:t.templateName,className:te.a.flowOption},k.a.createElement("span",null,k.a.createElement("span",{className:"m-r-8"},t.templateName),e.state.flowId===t.id&&k.a.createElement("i",{className:"iconfont icondui sub-color"})),!t.processOperationPermission&&k.a.createElement("span",{key:"flowEdit"},k.a.createElement("a",{className:te.a.editFlow,onClick:function(){return e.edit("edit",t)},onMouseDown:function(e){e.preventDefault()}},"\u7f16\u8f91")))})))),!Number(r)&&k.a.createElement(z["a"].Item,{label:"\u501f\u6b3e\u6838\u9500"},a("relation",{initialValue:n&&n.relation?n.relation:[]})(k.a.createElement(D["a"].Group,{onChange:function(t){return e.onChangeRelation(t,"reLoan")}},k.a.createElement(D["a"],{value:"isRelationLoan"},"\u5141\u8bb8\u5173\u8054"),p.includes("isRelationLoan")&&k.a.createElement(D["a"],{value:"isWriteByRelationLoan"},"\u5fc5\u586b")))),2!==Number(r)&&3!==Number(r)&&k.a.createElement(z["a"].Item,{label:"\u7533\u8bf7\u5355"},a("relations",{initialValue:n&&n.relations?n.relations:[]})(k.a.createElement(D["a"].Group,{onChange:function(t){return e.onChangeRelation(t,"reApply")}},k.a.createElement(D["a"],{value:"isRelationApply"},"\u5141\u8bb8\u5173\u8054"),c.includes("isRelationApply")&&k.a.createElement(D["a"],{value:"isWriteByRelationApply"},"\u5fc5\u586b")))),k.a.createElement(z["a"].Item,{label:ie.status},a("status",{initialValue:void 0===n.status||!!n.status,valuePropName:"checked"})(k.a.createElement(J["a"],null)))),k.a.createElement($["a"],{templateType:r,title:C,name:b,processPersonId:g,onOk:function(){return e.onChangeSelect(C)},dispatch:i,visible:E,onCancel:function(){return e.onCancel()}})))}}]),a}(k.a.PureComponent),l=o))||l),ue=de,me=a("z0WU"),fe=a("DMXp"),he=a.n(fe),ye=a("xH7m"),ge=a.n(ye);function ve(e){var t=Ee();return function(){var a,n=I()(e);if(t){var l=I()(this).constructor;a=Reflect.construct(n,arguments,l)}else a=n.apply(this,arguments);return _()(this,a)}}function Ee(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var be=[{key:"2",value:"B5\u6a2a\u7248\u6253\u5370"},{key:"1",value:"A5\u6a2a\u7248\u6253\u5370"},{key:"0",value:"A4\u7ad6\u7248\u6253\u5370"}],Ce={0:[{key:"isQrCode",value:"\u5355\u636e\u8be6\u60c5\u4e8c\u7ef4\u7801"},{key:"isAssessRecord",value:"\u6838\u9500\u501f\u6b3e\u8bb0\u5f55"},{key:"isApplicationRecord",value:"\u5173\u8054\u7533\u8bf7\u5355\u8bb0\u5f55"}],1:[{key:"isQrCode",value:"\u5355\u636e\u8be6\u60c5\u4e8c\u7ef4\u7801"},{key:"isApplicationRecord",value:"\u5173\u8054\u7533\u8bf7\u5355\u8bb0\u5f55"}],2:[{key:"isQrCode",value:"\u5355\u636e\u8be6\u60c5\u4e8c\u7ef4\u7801"}],3:[{key:"isQrCode",value:"\u5355\u636e\u8be6\u60c5\u4e8c\u7ef4\u7801"}]},Ne=(le=z["a"].create(),le((re=function(e){N()(a,e);var t=ve(a);function a(e){var n;return v()(this,a),n=t.call(this,e),n.onChange=function(e,t){var a=y()({},n.props.templatePdfVo);Object.assign(a,u()({},t,e.target.checked)),n.props.onChange("templatePdfVo",a)},n.onChanges=function(e){console.log("Left -> op",e);var t=y()({},n.props.templatePdfVo);Object.assign(t,{paperType:e}),n.props.onChange("templatePdfVo",t)},n.onChangeBasic=function(e){console.log("Left -> checkValues",e);var t=n.props.expandList,a=t.filter(function(t){return e.includes(t.field)})||[];console.log("Left -> templatePdfExpandVos",a);var l=y()({},n.props.templatePdfVo);Object.assign(l,{templatePdfExpandVos:a}),n.props.onChange("templatePdfVo",l)},n.state={},n}return b()(a,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this,t=this.props,a=t.expandList,n=t.templatePdfVo,l=t.templateType;return k.a.createElement("div",{className:ge.a.left},k.a.createElement(z["a"],{style:{padding:"1px 0px"}},k.a.createElement(z["a"].Item,{label:"\u6253\u5370\u6a21\u677f",colon:!1,style:{marginBottom:"10px"}},k.a.createElement(Q["a"],{onChange:function(t){return e.onChanges(t)},value:n.paperType||0===n.paperType?"".concat(n.paperType):"2"},be.map(function(e){return k.a.createElement(Q["a"].Option,{key:e.key},e.value)}))),k.a.createElement(z["a"].Item,{label:"\u57fa\u7840\u8bbe\u7f6e",colon:!1},k.a.createElement("div",{className:ge.a.checkbox},Ce[l].map(function(t){return k.a.createElement(D["a"],{key:t.key,checked:n[t.key],onChange:function(a){return e.onChange(a,t.key)}},t.value)}))),k.a.createElement(B["a"],{type:"horizontal",style:{marginTop:"14px",marginBottom:"5px"}}),a&&a.length>0&&k.a.createElement(z["a"].Item,{label:"\u53ef\u914d\u7f6e\u5b57\u6bb5",colon:!1},k.a.createElement(he.a,{className:ge.a.checkbox,onChange:this.onChangeBasic,value:n.templatePdfExpandVos?n.templatePdfExpandVos.map(function(e){return e.field}):[]},a.map(function(e){return k.a.createElement(D["a"],{key:e.field,value:e.field},e.name)}))),a&&a.length>0&&k.a.createElement(B["a"],{type:"horizontal",style:{marginTop:"14px",marginBottom:"5px"}}),k.a.createElement(z["a"].Item,{label:"\u516c\u53f8\u540d\u79f0",colon:!1},k.a.createElement(D["a"],{checked:n.isCompanyName,onChange:function(t){return e.onChange(t,"isCompanyName")}},"\u6253\u5370")),k.a.createElement(B["a"],{type:"horizontal",style:{marginTop:"14px",marginBottom:"5px"}}),k.a.createElement(z["a"].Item,{label:"\u56fe\u7247",colon:!1},k.a.createElement(D["a"],{checked:n.isImage,onChange:function(t){return e.onChange(t,"isImage")}},"\u6253\u5370"))))}}]),a}(S["Component"]),oe=re))||oe),xe=Ne,_e=a("Zua5"),Le=a.n(_e),Ie={0:"pdf4",1:"pdf5",2:"pdfb5"},Se={0:"\u62a5\u9500",1:"\u501f\u6b3e",2:"\u7533\u8bf7",3:"\u63d0\u4ea4"};function ke(e){var t=e.templateType,a=e.templatePdfVo,n=e.corpName,l=e.isRelationLoan,o=e.invoiceName,r=e.categoryStatus,i=a.templatePdfExpandVos||[],s=i.filter(function(e){return 1===e.fieldType})||[],c=i.filter(function(e){return 1!==e.fieldType&&3!==Number(e.fieldType)}),p=Object(me["c"])(c,2),d=i.filter(function(e){return 3===Number(e.fieldType)});return k.a.createElement("div",{style:{background:"#fff",position:"relative"},className:ge.a[Ie[a.paperType]]},k.a.createElement("img",{src:Le.a,alt:"\u88c5\u8ba2\u7ebf",className:ge.a.zdx}),k.a.createElement("h1",{className:ge.a.header},o),a.isCompanyName&&k.a.createElement("h1",{className:ge.a.company},n),k.a.createElement("div",null,k.a.createElement("div",{className:V()(ge.a["cont-info"])},k.a.createElement("div",{className:ge.a["cont-info-fields"]},k.a.createElement("div",{className:ge.a["cont-info-line"]},k.a.createElement("div",{className:V()(ge.a["cont-cell"],ge.a["cont-line-r"])},k.a.createElement("div",{className:ge.a["cont-cell-label"]},Se[t],"\u5355\u53f7")),k.a.createElement("div",{className:ge.a["cont-cell"],style:{flex:2}},k.a.createElement("div",{className:ge.a["cont-cell-label"]},"\u4e8b\u7531"))),k.a.createElement("div",{className:ge.a["cont-info-line"]},k.a.createElement("div",{className:V()(ge.a["cont-cell"],ge.a["cont-line-r"])},k.a.createElement("div",{className:ge.a["cont-cell-label"]},Se[t],"\u4eba")),k.a.createElement("div",{className:V()(ge.a["cont-cell"],ge.a["cont-line-r"])},k.a.createElement("div",{className:ge.a["cont-cell-label"]},0===t&&"\u627f\u62c5\u8005",1===t&&"\u501f\u6b3e\u90e8\u95e8",(2===t||3===t)&&"\u7533\u8bf7\u90e8\u95e8")),k.a.createElement("div",{className:ge.a["cont-cell"]},k.a.createElement("div",{className:ge.a["cont-cell-label"]},0===t&&"\u63d0\u4ea4",1===t&&"\u501f\u6b3e",(2===t||3===t)&&"\u7533\u8bf7","\u65e5\u671f"))),2!==t?k.a.createElement("div",{className:ge.a["cont-info-line"]},k.a.createElement("div",{className:ge.a["cont-cell"]},k.a.createElement("div",{className:ge.a["cont-cell-label"]},"\u6536\u6b3e\u8d26\u6237"))):k.a.createElement("div",{className:ge.a["cont-info-line"]},k.a.createElement("div",{className:ge.a["cont-cell"]},k.a.createElement("div",{className:ge.a["cont-cell-label"]},"\u7533\u8bf7\u91d1\u989d(\u5927\u5199)")))),a.isQrCode&&k.a.createElement("div",{className:ge.a["cont-info-qr"]},k.a.createElement("span",null,"\u4e8c\u7ef4\u7801"))),1===t&&k.a.createElement("div",{className:V()(ge.a["cont-info-line"],ge.a["cont-line-l"])},k.a.createElement("div",{className:V()(ge.a["cont-cell"],ge.a["cont-line-r"])},k.a.createElement("div",{className:V()(ge.a["cont-cell-label"])},"\u501f\u6b3e\u91d1\u989d(\u5927\u5199)"))),p&&p.length>0&&p.map(function(e){return k.a.createElement("div",{className:V()(ge.a["cont-info-line"],ge.a["cont-line-l"],ge.a["cont-line-r"]),key:e},e.map(function(e){return k.a.createElement("div",{className:V()(ge.a["cont-cell"],ge.a["cont-line-r"]),key:e.field},k.a.createElement("div",{className:V()(ge.a["cont-cell-label"],"sub-color")},e.name))}))}),s&&s.length>0&&s.map(function(e){return k.a.createElement("div",{className:V()(ge.a["cont-info-line"],ge.a["cont-line-l"]),key:e.field},k.a.createElement("div",{className:V()(ge.a["cont-cell"],ge.a["cont-line-r"])},k.a.createElement("div",{className:V()(ge.a["cont-cell-label"],"sub-color")},e.name)))}),(!t||3===t||2===t&&!!Number(r))&&k.a.createElement("div",{className:ge.a.contents},!Number(a.paperType)&&k.a.createElement("div",{className:ge.a.title},"\u652f\u51fa\u660e\u7ec6"),k.a.createElement("table",null,k.a.createElement("tr",null,k.a.createElement("th",null,"\u652f\u51fa\u7c7b\u522b"),k.a.createElement("th",null,"\u5907\u6ce8"),k.a.createElement("th",null,"\u53d1\u751f\u65e5\u671f"),k.a.createElement("th",null,"\u91d1\u989d")),k.a.createElement("tr",null,k.a.createElement("td",{colSpan:"4"}))),k.a.createElement("table",{style:{borderTop:"none"}},l?k.a.createElement("tr",null,k.a.createElement("td",{className:ge.a["cont-line-r"]},"\u62a5\u9500\u91d1\u989d\uff08\u5143\uff09"),k.a.createElement("td",{className:ge.a["cont-line-r"]},"\u6838\u9500\u91d1\u989d\uff08\u5143\uff09"),k.a.createElement("td",null,"\u6536\u6b3e\u91d1\u989d\uff08\u5143\uff09")):k.a.createElement("tr",null,k.a.createElement("td",{className:ge.a["cont-line-r"],colSpan:"3"},Se[t],"\u91d1\u989d\uff08\u5143\uff09")))),d&&d.length>0&&k.a.createElement("div",{className:ge.a.contents},!Number(a.paperType)&&k.a.createElement("div",{className:ge.a.title},"\u660e\u7ec6"),k.a.createElement("table",null,k.a.createElement("tr",null,d[0].expandFieldVos&&d[0].expandFieldVos.map(function(e){return k.a.createElement("th",{key:e.field},e.name)})),k.a.createElement("tr",null,k.a.createElement("td",{colSpan:d[0].expandFieldVos&&d[0].expandFieldVos.length})))),!t&&a.isAssessRecord&&k.a.createElement("div",{className:ge.a.contents},!Number(a.paperType)&&k.a.createElement("div",{className:ge.a.title},"\u6838\u9500\u8bb0\u5f55"),k.a.createElement("table",null,k.a.createElement("tr",null,k.a.createElement("th",null,"\u501f\u6b3e\u5355\u53f7"),k.a.createElement("th",null,"\u4e8b\u7531"),k.a.createElement("th",null,"\u91d1\u989d")),k.a.createElement("tr",null,k.a.createElement("td",{colSpan:"3"})),k.a.createElement("tr",null,k.a.createElement("td",{colSpan:"3"},"\u6838\u9500\u603b\u91d1\u989d\uff08\u5927\u5199\uff09")))),2!==t&&a.isApplicationRecord&&k.a.createElement("div",{className:ge.a.contents},!Number(a.paperType)&&k.a.createElement("div",{className:ge.a.title},"\u7533\u8bf7\u5355"),k.a.createElement("table",null,k.a.createElement("tr",null,k.a.createElement("th",null,"\u7533\u8bf7\u5355\u53f7"),k.a.createElement("th",null,"\u4e8b\u7531"),k.a.createElement("th",null,"\u7533\u8bf7\u91d1\u989d")),k.a.createElement("tr",null,k.a.createElement("td",{colSpan:"3"})))),k.a.createElement("div",{className:ge.a.contents},!Number(a.paperType)&&k.a.createElement("div",{className:ge.a.title},"\u5ba1\u6279\u6d41\u7a0b"),k.a.createElement("table",null,k.a.createElement("tr",null,k.a.createElement("td",{colSpan:"2"},"\u5ba1\u6279\u4eba")),k.a.createElement("tr",null,k.a.createElement("td",{className:ge.a["cont-line-r"]},"\u590d\u6838"),k.a.createElement("td",null,"\u51fa\u7eb3"))))))}var Re=ke;function Ae(e){var t=e.templatePdfVo,a=e.selectList,n=e.templateType,l=e.onChange,o=e.isRelationLoan,r=e.corpName,i=e.invoiceName,s=e.categoryStatus,c=a.filter(function(e){return e.field.indexOf("expand")>-1})||[];return console.log(t),k.a.createElement(k.a.Fragment,null,k.a.createElement(xe,{expandList:c,templatePdfVo:t,onChange:l,templateType:n}),k.a.createElement("div",{className:ge.a.rightContainer},k.a.createElement("div",{className:ge.a.rights},k.a.createElement(Re,{templateType:n,templatePdfVo:t,isRelationLoan:o,corpName:r,invoiceName:i,categoryStatus:s}))))}var Ve,Pe,Te,we=Ae,Oe=a("PtP1");function Fe(e){var t=Je();return function(){var a,n=I()(e);if(t){var l=I()(this).constructor;a=Reflect.construct(n,arguments,l)}else a=n.apply(this,arguments);return _()(this,a)}}function Je(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var De=[{key:"one",value:"\u57fa\u7840\u8bbe\u7f6e"},{key:"two",value:"\u5b57\u6bb5\u8bbe\u7f6e"},{key:"three",value:"\u6253\u5370\u8bbe\u7f6e"}],je=(Ve=Object(R["c"])(function(e){var t=e.loading,a=e.session,n=e.addInvoice,l=e.global,o=e.costGlobal;return{loading:t.effects["addInvoice/add"]||t.effects["addInvoice/edit"],detailLoading:t.effects["addInvoice/detail"]||t.effects["global/costList"]||t.effects["addInvoice/allList"]||!1,userInfo:a.userInfo,allList:n.allList,costCategoryList:l.costCategoryList,detail:n.detail,approveList:n.approveList,expandLists:n.expandLists,fieldList:n.fieldList,isModifyInvoice:o.isModifyInvoice}}),Ve((Te=function(e){N()(a,e);var t=Fe(a);function a(){var e;v()(this,a);for(var n=arguments.length,l=new Array(n),o=0;o<n;o++)l[o]=arguments[o];return e=t.call.apply(t,[this].concat(l)),e.state={current:"one",data:{},selectList:[],categoryList:[],templateType:3,fieldList:[],templatePdfVo:{templateType:0,paperType:2,isQrCode:!0,isAssessRecord:!1,isApplicationRecord:!1,isCompanyName:!0,isImage:!0,templatePdfExpandVos:[]},reLoan:[],reApply:[]},e.changeList=function(e){var t=[];return e.forEach(function(e){var a=y()({},e);if(3===e.fieldType){var n=f()(e.expandFieldVos);if(n.findIndex(function(e){return"detail_sale"===e.field})>-1){var l=n.findIndex(function(e){return"detail_sale"===e.field});n.splice(l,1)}if(n.findIndex(function(e){return"detail_account"===e.field})>-1){var o=n.findIndex(function(e){return"detail_account"===e.field});n.splice(o,1)}console.log("expand",n),a=y()({},a,{expandFieldVos:n.map(function(e){return y()({},e,{parentId:e.field})})})}t.push(a)}),t},e.changeListArr=function(e){var t=[];return e.forEach(function(e){var a=y()({},e);if(3===Number(e.fieldType)){var n=f()(e.expandFieldVos);if(n.findIndex(function(e){return"detail_money"===e.field})>-1){var l=n.findIndex(function(e){return"detail_money"===e.field});n.splice(l,1,y()({},n[l],{name:"\u5355\u4ef7",field:"detail_sale",note:n[l].note}),y()({},n[l],{name:"\u6570\u91cf",field:"detail_account",note:n[l].note}),y()({},n[l]))}a=y()({},e,{expandFieldVos:n})}t.push(a)}),t},e.compare=function(e){return function(t,a){var n=t[e],l=a[e];return n-l}},e.onHandle=function(t){if("one"!==t.key&&e.formRef&&e.formRef.getFormItem){var a={},n=e.formRef.getFormItem();if(!n)return;Object.assign(a,y()({},n,{status:n.status?1:0})),e.setState({data:n})}var l=e.state.selectList,o=f()(l);if(e.childRef&&e.childRef.getRightParams){var r=e.childRef.getRightParams();if(console.log("CategoryAdd -> onStep -> valStr",r),!r)return;var i=l.findIndex(function(e){return e.field===r.field});o.splice(i,1,r)}e.setState({current:t.key,selectList:o})},e.onStep=function(t){var a=e.state,n=a.current,l=a.data,o=a.selectList,r=a.templateType,i=a.templatePdfVo,s=e.props.match.params.id,c=s.split("_")[0],p=s.split("_"),d=e.props.userInfo,u=l,m=f()(o);if(e.formRef&&e.formRef.getFormItem){var h=e.formRef.getFormItem();if(console.log("CategoryAdd -> onStep -> values",h),!h)return;Object.assign(u,y()({},h,{status:h.status?1:0}))}if(console.log("CategoryAdd -> onStep -> valStr",e.childRef),e.childRef&&e.childRef.getRightParams){var g=e.childRef.getRightParams();if(console.log("CategoryAdd -> onStep -> valStr",g),!g)return;var v=o.findIndex(function(e){return e.field===g.field});if(v>-1)m.splice(v,1,g);else{var E=m.findIndex(function(e){return 3===Number(e.fieldType)}),b=m[E].expandFieldVos,C=b.findIndex(function(e){return e.field===g.field});b.splice(C,1,g),m.splice(E,1,y()({},m[E],{expandFieldVos:b}))}e.setState({selectList:m})}if(("three"===n||"add"!==c&&"child"!==p[2])&&"down"!==t){var N=m.map(function(e,t){return y()({},e,{isSelect:!0,sort:t+1,status:1})}),x=N.findIndex(function(e){return 3===Number(e.fieldType)});if(x>-1){var _=N[x].expandFieldVos.map(function(e,t){return y()({},e,{isSelect:!0,sort:t+1,status:1})});N.splice(x,1,y()({},N[x],{expandFieldVos:_}))}var L=N.filter(function(e){return-1===e.field.indexOf("expand_field")&&-1===e.field.indexOf("self_")});console.log("CategoryAdd -> onStep -> showField",L);var I="add"===c||3===p.length?"addInvoice/add":"addInvoice/edit",S=y()({},u,{id:"add"===c||3===p.length?"":c,showField:L.map(function(e){var t=e.dateType;return 5===Number(e.fieldType)&&(t=t||1),y()({},e,{status:1,dateType:t})}),type:1,templateType:Number(r),companyId:d.companyId||"",useJson:!u.isAllUse&&u.userJson?JSON.stringify(u.userJson):"",deptJson:!u.isAllUse&&u.deptJson?JSON.stringify(u.deptJson):"",status:u.status?1:0,expandField:e.changeListArr(N.filter(function(e){return e.field.indexOf("expand_")>-1})),selfField:e.changeListArr(N.filter(function(e){return e.field.indexOf("self_")>-1})),templatePdfVo:y()({},i,{templatePdfExpandVos:i.templatePdfExpandVos.map(function(e){return y()({},e,{isSelect:!0})})})});S.relations&&delete S.relations,S.relation&&delete S.relation,e.props.dispatch({type:I,payload:y()({},S)}).then(function(){e.props.history.push("/basicSetting/invoice")})}else{var k=De.findIndex(function(e){return e.key===n});console.log("CategoryAdd -> onStep -> index",k),e.setState({data:u,current:"up"===t?De[k+1].key:De[k-1].key})}},e.onChangeData=function(t,a,n){if(e.setState(u()({},t,a)),"selectList"===t&&!n){var l=e.state,o=l.fieldList,r=l.templatePdfVo,i=f()(o),s=i.map(function(e){return e.field}),c=[];console.log("CategoryAdd -> onChangeData -> value",a);var p=a.map(function(e){return!s.includes(e.field)&&e.field.indexOf("expand_")>-1?(c.push(e),e.field):e.field});c.length&&(i=[].concat(f()(i),c));var d=r.templatePdfExpandVos||[],m=[];if(d&&d.length){var h=a.map(function(e){return e.field});m=d.filter(function(e){return h.includes(e.field)}),console.log("CategoryAdd -> onChangeData -> newLists",m)}e.setState({fieldList:i.map(function(e){return p.includes(e.field)?y()({},e,{isSelect:!0}):y()({},e,{isSelect:!1})}),templatePdfVo:y()({},r,{templatePdfExpandVos:m})},function(){console.log(e.state.fieldList)})}},e.onCancel=function(){e.props.history.push("/basicSetting/invoice")},e.onChangeDatas=function(t,a){e.setState(u()({},t,a))},e}return b()(a,[{key:"componentDidMount",value:function(){var e=this,t=this.props.match.params.id,a=this.props,n=a.userInfo,l=a.dispatch,o=t.split("_"),r=t.split("_")[1],i=t.split("_")[0],s=o[2];this.props.dispatch({type:"costGlobal/queryModifyOrder",payload:{}}),this.props.dispatch({type:"addInvoice/approveList",payload:{isAuth:!0}}),l({type:"global/costList",payload:{companyId:n.companyId}}).then(function(){e.props.dispatch({type:"addInvoice/allList",payload:{}}).then(function(){var t=e.props.costCategoryList,a=t,n=Object(P["a"])({rootId:0,pId:"parentId",name:"costName",tName:"label",tId:"value"},a);console.log("CategoryAdd -> componentDidMount -> list",n),e.setState({categoryList:n,templateType:r}),e.props.dispatch({type:"addInvoice/fieldList",payload:{invoiceTemplateId:"add"!==i&&"child"!==s?i:"",templateType:r}}).then(function(){var a=e.props.fieldList,n=a.filter(function(e){return e.isSelect});"add"!==i&&"child"!==s||e.setState({selectList:e.changeList(n.sort(e.compare("sort")))});var o={};"child"===s&&(Object.assign(o,{parentId:i}),e.setState({data:o})),e.setState({fieldList:e.changeList(a)}),"add"!==i&&"child"!==s&&l({type:"addInvoice/detail",payload:{id:i,templateType:r,isPdf:!0}}).then(function(){var a=e.props.detail,n={},l=[],o=[],r=[];a.costCategoryJson&&(l=Object(me["b"])(a.costCategoryJson).map(function(e){return e.id})),a.useJson&&(o=Object(me["b"])(a.useJson)),a.deptJson&&(r=Object(me["b"])(a.deptJson));var i=[],c=[];a.isRelationLoan&&i.push("isRelationLoan"),a.isRelationApply&&c.push("isRelationApply"),a.isWriteByRelationLoan&&i.push("isWriteByRelationLoan"),a.isWriteByRelationApply&&c.push("isWriteByRelationApply");var p=t.map(function(e){return e.id}),d=[];l.forEach(function(e){p.includes(e)&&d.push(e)}),Object.assign(n,y()({},a,{costCategory:d.length?d:null,userJson:o,deptJson:r,relation:i,relations:c})),console.log(s),"copy"===s&&(n=y()({},n,{name:"".concat(a.name,"\u7684\u526f\u672c")}));var u=[].concat(f()(a.expandField),f()(a.showField));a.selfField&&(u=[].concat(f()(u),f()(a.selfField)));var m=u.sort(e.compare("sort")),h=m.findIndex(function(e){return 3===e.fieldType});if(h>-1){var g=m[h].expandFieldVos.map(function(e){return y()({},e,{parentId:m[h].field})});m.splice(h,1,y()({},m[h],{expandFieldVos:g}))}e.setState({templatePdfVo:y()({},a.templatePdfVo,{templatePdfExpandVos:a.templatePdfVo&&a.templatePdfVo.templatePdfExpandVos?a.templatePdfVo.templatePdfExpandVos.filter(function(e){return e.isSelect}):[]}),reLoan:i,reApply:c,data:n,selectList:e.changeList(m)})})})})})}},{key:"render",value:function(){var e=this,t=this.props,a=t.allList,n=t.approveList,l=t.isModifyInvoice,o=t.detailLoading,i=this.props.match.params.id,d=i.split("_")[0],u=i.split("_"),m=u[2],f=this.state,h=f.current,y=f.selectList,g=f.fieldList,v=f.templatePdfVo,E=f.reLoan,b=f.reApply,C=this.props,N=C.dispatch,x=C.userInfo,_=this.state,L=_.categoryList,I=_.data,S=_.templateType,R=[{path:"/basicSetting/invoice",breadcrumbName:"\u5355\u636e\u6a21\u677f",paths:"basicSetting/invoice"},{path:"second",breadcrumbName:"".concat(2===u.length&&"add"!==d?"\u7f16\u8f91":"\u65b0\u5efa","\u5355\u636e\u6a21\u677f")}];return k.a.createElement("div",{style:{height:"100%"}},k.a.createElement("div",{style:{width:"100%"}},k.a.createElement(T["a"],{title:k.a.createElement(p["a"],{title:null,breadcrumb:{routes:R},style:{background:"#fff"}})}),k.a.createElement("div",{style:{background:"#fff"}},k.a.createElement(c["a"],{mode:"horizontal",className:"m-l-32 titleMenu",selectedKeys:[h],onClick:function(t){return e.onHandle(t)}},De.map(function(e,t){return k.a.createElement(c["a"].Item,{key:e.key},k.a.createElement("span",{className:e.key===h?V()("circle","active"):"circle"},t+1),k.a.createElement("span",null,e.value))})))),"three"!==h&&k.a.createElement("div",{style:{position:"relative",height:"calc(100% - 153px)",overflow:"scroll",width:"100%"}},"one"===h&&k.a.createElement("div",{className:"content-dt",style:{height:"100%",minWidth:"1008px",width:"inherit"}},k.a.createElement(w["a"],{title:"\u57fa\u7840\u8bbe\u7f6e"}),k.a.createElement(ue,s()({},this.props,{wrappedComponentRef:function(t){e.formRef=t},costCategoryList:L,list:a,data:I,category:I.costCategory,approveList:n,templateType:Number(S),dispatch:N,onChangeData:this.onChangeData,onChanges:this.onChangeDatas,reLoan:E,reApply:b,detailLoading:o}))),"two"===h&&k.a.createElement("div",{style:{height:"100%",padding:"24px 24px 0 24px",display:"flex",position:"absolute",minWidth:"1008px",width:"inherit"}},k.a.createElement(Oe["a"],{fieldList:g,selectList:y,onChangeData:this.onChangeData,selectId:"reason",type:"invoice",isModifyInvoice:l,operateType:d,middleRef:function(t){e.childRef=t},templateType:Number(S)}))),"three"===h&&k.a.createElement("div",{style:{height:"calc(100% - 152px)",padding:"0",display:"flex"}},k.a.createElement(we,{templatePdfVo:v,selectList:y,templateType:Number(S),onChange:this.onChangeDatas,corpName:x.corpName,isRelationLoan:I.isRelationLoan,invoiceName:I.name,categoryStatus:I.categoryStatus})),k.a.createElement(O["a"],{right:k.a.createElement(k.a.Fragment,null,k.a.createElement(r["a"],{type:"default",className:"m-r-8",onClick:function(){return e.onCancel()}},"\u53d6\u6d88"),"one"!==h&&k.a.createElement(r["a"],{type:"default",className:"m-r-8",onClick:function(){return e.onStep("down")}},"\u4e0a\u4e00\u6b65"),k.a.createElement(r["a"],{type:"primary",onClick:function(){return e.onStep("up")}},"three"===h||"add"!==d&&"child"!==m?"\u4fdd\u5b58":"\u4e0b\u4e00\u6b65"))}))}}]),a}(S["PureComponent"]),Pe=Te))||Pe);t["default"]=je},Zua5:function(e,t,a){e.exports=a.p+"static/zdx.088b60e1.png"},xH7m:function(e,t,a){e.exports={left:"left___3p9yo",pdf5:"pdf5___167Z0",zdx:"zdx___7-Unk",pdfb5:"pdfb5___1y2AZ",header:"header___Ti1hA",footer:"footer___3xvP-",production:"production___QFoBB",write:"write___1O9w2","cont-info":"cont-info___14hQ5","cont-info-fields":"cont-info-fields___2yPSr","cont-info-line":"cont-info-line___3rNow","cont-cell":"cont-cell___22i9N","cont-cell-label":"cont-cell-label___1OqNc","cont-cell-value":"cont-cell-value___1Aipr","cont-line-r":"cont-line-r___2knJP","cont-line-t":"cont-line-t___2bpXJ","cont-line-l":"cont-line-l___1Maqk","cont-line-b":"cont-line-b___s7rMM","prod-title":"prod-title___2cbmO","cont-info-qr":"cont-info-qr___338ZY","table-header":"table-header___3pvXj",rights:"rights___3LVRm",rightContainer:"rightContainer___-nd--",checkbox:"checkbox___2C-A6",pdf4:"pdf4___1iFD9",contents:"contents___1ET-m",title:"title___MJ1Wv"}}}]);