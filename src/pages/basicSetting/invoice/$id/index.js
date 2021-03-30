import React, { PureComponent } from 'react';
import { PageHeader, Menu, Button } from 'antd';
import { connect } from 'dva';
import cs from 'classnames';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { DndProvider } from 'react-dnd';
import treeConvert from '@/utils/treeConvert';
import PageHead from '@/components/PageHead';
import LabelLeft from '../../../../components/LabelLeft';
// import style from './index.scss';
import FooterBar from '../../../../components/FooterBar';
import Basic from '../components/Basic';
import { JsonParse } from '../../../../utils/common';
// import StrSetting from '../../costCategory/$id/components/StrSetting';
// import PreviewBox from '../../costCategory/$id/components/PreviewBox';
import Print from './components/Print';
import DragContent from '../../costCategory/$id/components/DragContent';

const basicStr = [{
  key: 'one',
  value: '基础设置',
}, {
  key: 'two',
  value: '字段设置',
}, {
  key: 'three',
  value: '打印设置',
}];
@connect(({ loading, session, addInvoice, global, costGlobal }) => ({
  loading: loading.effects['addInvoice/add'] || loading.effects['addInvoice/edit'],
  detailLoading: loading.effects['addInvoice/detail'] || false,
  userInfo: session.userInfo,
  allList: addInvoice.allList,
  costCategoryList: global.costCategoryList,
  detail: addInvoice.detail,
  approveList: addInvoice.approveList,
  expandLists: addInvoice.expandLists,
  fieldList: addInvoice.fieldList,
  isModifyInvoice: costGlobal.isModifyInvoice
}))
class CategoryAdd extends PureComponent {

  state = {
    current: 'one',
    data: {},
    selectList: [],
    categoryList: [],
    templateType: 2,
    fieldList: [],
    templatePdfVo: {
      'templateType':0,
      'paperType':2,
      'isQrCode':true,
      'isAssessRecord':false,
      'isApplicationRecord':false,
      'isCompanyName':true,
      'isImage':true,
      templatePdfExpandVos: [],
    },
    reLoan: [],
    reApply: [],
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const { userInfo, dispatch } = this.props;
    const params = id.split('_');
    const templateType = id.split('_')[1];
    const title = id.split('_')[0];
    const titleType = params[2];
    this.props.dispatch({
      type: 'costGlobal/queryModifyOrder',
      payload: {}
    });
    this.props.dispatch({
      type: 'addInvoice/approveList',
      payload: {
        isAuth: true,
      },
    });
    dispatch({
      type: 'global/costList',
      payload: {
        companyId: userInfo.companyId,
      }
    }).then(() => {
      this.props.dispatch({
        type: 'addInvoice/allList',
        payload: {}
      }).then(() => {
        const { costCategoryList } = this.props;
        const lists = costCategoryList;
        const list = treeConvert({
          rootId: 0,
          pId: 'parentId',
          name: 'costName',
          tName: 'label',
          tId: 'value'
        }, lists);
        console.log('CategoryAdd -> componentDidMount -> list', list);
        this.setState({
          categoryList: list,
        });
        this.props.dispatch({
          type: 'addInvoice/fieldList',
          payload: {
            invoiceTemplateId: title !== 'add' && titleType !== 'child' ? title : '',
            templateType
          }
        }).then(() => {
          const { fieldList } = this.props;
          const newArr = fieldList.filter(it => it.isSelect);
          if (title === 'add' || titleType === 'child') {
            this.setState({
              selectList: newArr.sort(this.compare('sort')),
            });
          }
          const data = {};
          if (titleType === 'child') {
            Object.assign(data, {
              parentId: title,
            });
            this.setState({
              data
            });
          }
          this.setState({
            templateType,
            fieldList,
          });
          if (title !== 'add' && titleType !== 'child') {
            dispatch({
              type: 'addInvoice/detail',
              payload: {
                id: title,
                templateType,
                isPdf: true,
              }
            }).then(() => {
              const { detail } = this.props;
              let datas = {};
              let costCategory = [];
              let userJson = [];
              let deptJson = [];
              if (detail.costCategoryJson) {
                costCategory = JsonParse(detail.costCategoryJson).map(it => it.id);
              }
              if (detail.useJson) {
                userJson = JsonParse(detail.useJson);
              }
              if (detail.deptJson) {
                deptJson = JsonParse(detail.deptJson);
              }
              const relation = [];
              const relations = [];
              if (detail.isRelationLoan) {
                relation.push('isRelationLoan');
              }
              if (detail.isRelationApply) {
                relations.push('isRelationApply');
              }
              if (detail.isWriteByRelationLoan) {
                relation.push('isWriteByRelationLoan');
              }
              if (detail.isWriteByRelationApply) {
                relations.push('isWriteByRelationApply');
              }
              const ids = costCategoryList.map(it => it.id);
              const newArrs = [];
              costCategory.forEach(it => {
                if (ids.includes(it)){
                  newArrs.push(it);
                }
              });
              Object.assign(datas, {
                ...detail,
                costCategory: newArrs.length ? newArrs : null,
                userJson,
                deptJson,
                relation,
                relations,
              });
              console.log(titleType);
              if (titleType === 'copy') {
                datas = {
                  ...datas,
                  name: `${detail.name}的副本`,
                };
              }
              let selects = [...detail.expandField, ...detail.showField];
              if (detail.selfField) {
                selects = [...selects, ...detail.selfField];
              }
              const arrs = selects.sort(this.compare('sort'));
              const i = arrs.findIndex(it => it.fieldType === 3);
              if (i>-1) {
                const expand = arrs[i].expandFieldVos.map(it => { return {...it, parentId: arrs[i].field}; });
                arrs.splice(i, 1, {
                  ...arrs[i],
                  expandFieldVos: expand,
                });
              }
              this.setState({
                templatePdfVo: {
                  ...detail.templatePdfVo,
                  templatePdfExpandVos: detail.templatePdfVo && detail.templatePdfVo.templatePdfExpandVos
                    ? detail.templatePdfVo.templatePdfExpandVos.filter(it => it.isSelect) : [],
                },
                reLoan: relation,
                reApply: relations,
                data: datas,
                selectList: arrs,
              });
            });
          }
        });
      });
    });

  }

  compare = (property) => {
    return function(a,b){
        const value1 = a[property];
        const value2 = b[property];
        return value1 - value2;
    };
  }

  onHandle = (e) => {
    if (e.key !== 'one') {
      if (this.formRef && this.formRef.getFormItem) {
        const datas = {};
        const values = this.formRef.getFormItem();
        if(!values) {
          return;
        }
        Object.assign(datas, {
          ...values,
          status: values.status ? 1 : 0,
        });
        this.setState({
          data: values
        });
      }
    }
    this.setState({
      current: e.key,
    });
  }

  onStep = (flag) => {
    const { current, data, selectList, templateType, templatePdfVo } = this.state;
    const { id } = this.props.match.params;
    const title = id.split('_')[0];
    const paramsT = id.split('_');
    const { userInfo } = this.props;
    const datas = data;
    const newSelectList = [...selectList];
    if (this.formRef && this.formRef.getFormItem) {
      const values = this.formRef.getFormItem();
      console.log('CategoryAdd -> onStep -> values', values);
      if(!values) {
        return;
      }
      Object.assign(datas, {
        ...values,
        status: values.status ? 1 : 0,
      });
    }

    if (this.childRef && this.childRef.getRightParams) {
      const valStr = this.childRef.getRightParams();
      console.log('CategoryAdd -> onStep -> valStr', valStr);
      if (!valStr) {
        return;
      }
      const indexs = selectList.findIndex(it => it.field === valStr.field);
      if (indexs > -1) {
        newSelectList.splice(indexs, 1, valStr);
      } else {
        const i = newSelectList.findIndex(it => Number(it.fieldType) === 3);
        const expandDetail = newSelectList[i].expandFieldVos;
        const ci = expandDetail.findIndex(it => it.field === valStr.field);
        expandDetail.splice(ci, 1, valStr);
        newSelectList.splice(i, 1, {
          ...newSelectList[i],
          expandFieldVos: expandDetail,
        });
      }
    }

    if ((current === 'three'
      || (title !== 'add'
      && paramsT[2] !== 'child'))
      && flag !== 'down') {
      const newArr = newSelectList.map((it, index) => { return { ...it, isSelect: true, sort: (index+1), status: 1 }; });
      const iN = newArr.findIndex(it => Number(it.fieldType) === 3);
      if (iN > -1) {
        const expand = newArr[iN].expandFieldVos.map((it,index) =>
          { return {...it, isSelect: true, sort: (index+1), status: 1}; });
          newArr.splice(iN, 1, {
          ...newArr[iN],
          expandFieldVos: expand,
        });
      }
      const showField = newArr.filter(it => (it.field.indexOf('expand_field') === -1 && it.field.indexOf('self_') === -1));
      console.log('CategoryAdd -> onStep -> showField', showField);
      const url = title === 'add' || paramsT.length === 3 ? 'addInvoice/add' : 'addInvoice/edit';
      const params = {
        ...datas,
        id: title === 'add' || paramsT.length === 3 ? '' : title,
        showField: showField.map(it => {
          let dateTypes = it.dateType;
          if (Number(it.fieldType) === 5) {
            dateTypes = dateTypes || 1;
          }
          return {
            ...it,
            status: 1,
            dateType: dateTypes,
          };
        }),
        type: 1,
        templateType: Number(templateType),
        companyId: userInfo.companyId || '',
        useJson: !datas.isAllUse && datas.userJson ? JSON.stringify(datas.userJson) : '',
        deptJson: !datas.isAllUse && datas.deptJson ?
                JSON.stringify(datas.deptJson) : '',
        status: datas.status ? 1: 0,
        expandField: newArr.filter(it => it.field.indexOf('expand_') > -1),
        selfField: newArr.filter(it => it.field.indexOf('self_') > -1),
        templatePdfVo: {
          ...templatePdfVo,
          templatePdfExpandVos: templatePdfVo.templatePdfExpandVos.map(it => { return{ ...it, isSelect: true }; })
        },
      };
      if (params.relations) delete params.relations;
      if (params.relation) delete params.relation;
      this.props.dispatch({
        type: url,
        payload: {
          ...params,
        }
      }).then(() => {
        this.props.history.push('/basicSetting/invoice');
      });
    } else {
      const index = basicStr.findIndex(it => it.key === current);
      console.log('CategoryAdd -> onStep -> index', index);
      this.setState({
        data: datas,
        current: flag === 'up' ? basicStr[index+1].key : basicStr[index-1].key,
      });
    }
  }

  onChangeData = (type, value, flag) => {
    this.setState({
      [type]: value,
    });
    if (type === 'selectList' && !flag) {
      const { fieldList, templatePdfVo } = this.state;
      let newArr = [...fieldList];
      const oldField = newArr.map(it => it.field);
      const add = [];
      console.log('CategoryAdd -> onChangeData -> value', value);
      const fields = value.map(it => {
        if (!oldField.includes(it.field) && (it.field.indexOf('expand_') > -1)) {
          add.push(it);
          return it.field;
        }
        return it.field;
      });
      if (add.length) {
        newArr=[...newArr, ...add];
      }
      const lists = templatePdfVo.templatePdfExpandVos || [];
      let newLists = [];
      if (lists && lists.length) {
        const keys = value.map(it => it.field);
        newLists = lists.filter(it => keys.includes(it.field));
        console.log('CategoryAdd -> onChangeData -> newLists', newLists);
      }
      this.setState({
        fieldList: newArr.map(it => {
          if (fields.includes(it.field)) {
            return {
              ...it,
              isSelect: true,
            };
          }
          return {
            ...it,
            isSelect: false,
          };
        }),
        templatePdfVo: {
          ...templatePdfVo,
          templatePdfExpandVos: newLists,
        }
      }, () => {
        console.log(this.state.fieldList);
      });
    }
  }

  onCancel = () => {
    this.props.history.push('/basicSetting/invoice');
  }

  onChangeDatas = (key, value) => {
    this.setState({
      [key]: value,
    });
  }

  render () {
    const {
      allList,
      approveList,
      isModifyInvoice,
      detailLoading
    } = this.props;
    const { id } = this.props.match.params;
    const title = id.split('_')[0];
    const paramsL = id.split('_');
    const titleType = paramsL[2];
    const {
      current,
      selectList,
      fieldList,
      templatePdfVo,
      reLoan,
      reApply,
    } = this.state;
    const {  dispatch, userInfo } = this.props;
    const { categoryList, data, templateType } = this.state;
    const routes = [
      // {
      //   path: '/basicSetting/invoice',
      //   breadcrumbName: '返回上一页',
      //   paths: 'basicSetting/invoice'
      // },
      {
        path: '/basicSetting/invoice',
        breadcrumbName: '单据模板',
        paths: 'basicSetting/invoice'
      },
      {
        path: 'second',
        breadcrumbName: `${paramsL.length === 2 && title !== 'add' ? '编辑' : '新建'}单据模板`,
      },
    ];

    return (
      <div style={{height: '100%'}}>
        <div style={{width: '100%'}}>
          <PageHead title={
            <PageHeader
              title={null}
              breadcrumb={{routes}}
              style={{background: '#fff'}}
            />
          }
          />
          <div style={{background: '#fff'}}>
            <Menu
              mode="horizontal"
              className="m-l-32 titleMenu"
              selectedKeys={[current]}
              onClick={(e) => this.onHandle(e)}
            >
              {
                basicStr.map((it, index) => (
                  <Menu.Item key={it.key}>
                    <span className={it.key === current ? cs('circle', 'active') : 'circle'}>{index+1}</span>
                    <span>{it.value}</span>
                  </Menu.Item>
                ))
              }
            </Menu>
          </div>
        </div>
        {
          current !== 'three' &&
            <div
              style={{
                position: 'relative',
                height: 'calc(100% - 153px)',
                overflow: 'scroll',
                width: '100%'
              }}
            >
              {
                current === 'one' &&
                <div
                  className="content-dt"
                  style={{
                    height: '100%',
                    minWidth: '1008px',
                    width: 'inherit'
                  }}
                >
                  <LabelLeft title="基础设置" />
                  <Basic
                    {...this.props}
                    wrappedComponentRef={form => {this.formRef = form;}}
                    costCategoryList={categoryList}
                    list={allList}
                    data={data}
                    category={data.costCategory}
                    approveList={approveList}
                    templateType={Number(templateType)}
                    dispatch={dispatch}
                    onChangeData={this.onChangeData}
                    onChanges={this.onChangeDatas}
                    reLoan={reLoan}
                    reApply={reApply}
                    detailLoading={detailLoading}
                  />
                </div>
              }
              {
                current === 'two' &&
                <div
                  style={{
                    height: '100%',
                    padding: '24px 24px 0 24px',
                    display: 'flex',
                    position: 'absolute',
                    minWidth: '1008px',
                    width: 'inherit'
                  }}
                >
                  <DragContent
                    fieldList={fieldList}
                    selectList={selectList}
                    onChangeData={this.onChangeData}
                    selectId="reason"
                    type="invoice"
                    isModifyInvoice={isModifyInvoice}
                    operateType={title}
                    middleRef={this.childRef}
                    templateType={Number(templateType)}
                  />
                </div>
              }
            </div>
        }
        {
          current === 'three' &&
          <div style={{height: 'calc(100% - 152px)', padding: '0', display: 'flex' }}>
            <Print
              templatePdfVo={templatePdfVo}
              selectList={selectList}
              templateType={Number(templateType)}
              onChange={this.onChangeDatas}
              corpName={userInfo.corpName}
              isRelationLoan={data.isRelationLoan}
              invoiceName={data.name}
              categoryStatus={data.categoryStatus}
            />
          </div>
        }
        <FooterBar
          right={(
            <>
              <Button type="default" className="m-r-8" onClick={() => this.onCancel()}>取消</Button>
              {
                current !== 'one' &&
                <Button
                  type="default"
                  className="m-r-8"
                  onClick={() => this.onStep('down')}
                >
                  上一步
                </Button>
              }
              <Button
                type="primary"
                onClick={() => this.onStep('up')}
              >
                { current === 'three' || (title !== 'add' && titleType !== 'child') ? '保存' : '下一步' }
              </Button>
            </>
          )}
        />
      </div>
    );
  }
}

export default CategoryAdd;
