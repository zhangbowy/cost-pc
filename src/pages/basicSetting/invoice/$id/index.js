import React, { PureComponent } from 'react';
import { PageHeader, Menu, Button } from 'antd';
import { connect } from 'dva';
import cs from 'classnames';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import treeConvert from '@/utils/treeConvert';
import LabelLeft from '../../../../components/LabelLeft';
import style from './index.scss';
import FooterBar from '../../../../components/FooterBar';
import Basic from '../components/Basic';
import StrSetting from './components/StrSetting';

const basicStr = [{
  key: 'one',
  value: '基础设置',
}, {
  key: 'two',
  value: '字段设置',
}];
@connect(({ loading, session, addInvoice, global }) => ({
  loading: loading.effects['addInvoice/add'] || loading.effects['addInvoice/edit'],
  userInfo: session.userInfo,
  allList: addInvoice.allList,
  costCategoryList: global.costCategoryList,
  detail: addInvoice.detail,
  approveList: addInvoice.approveList,
  expandLists: addInvoice.expandLists,
  fieldList: addInvoice.fieldList,
}))
class CategoryAdd extends PureComponent {

  state = {
    current: 'one',
    data: {},
    selectList: [],
    categoryList: [],
    templateType: 0,
    approveList: [],
  }

  componentDidMount(){
    const { id } = this.props.match.params;
    const { userInfo, dispatch } = this.props;
    const templateType = id.split('_')[1];
    const title = id.split('_')[0];
    this.props.dispatch({
      type: 'addInvoice/approveList',
      payload: {
        isAuth: true,
      },
    }).then(() => {
      const { approveList } = this.props;
      this.setState({
        approveList,
      });
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
        console.log('CategoryAdd -> componentDidMount -> costCategoryList', costCategoryList);
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
            invoiceTemplateId: title !== 'add' ? title : '',
            templateType
          }
        }).then(() => {
          const { fieldList } = this.props;
          const newArr = fieldList.filter(it => it.isSelect);
          this.setState({
            selectList: newArr,
            templateType,
          });
        });
      });
    });

  }

  onHandle = (e) => {
    if (e.key === 'two') {
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

  onStep = () => {
    const { current, data, selectList, templateType } = this.state;
    const { id } = this.props.match.params;
    const title = id.split('_')[0];
    const { userInfo } = this.props;
    const datas = data;
    if (this.formRef && this.formRef.getFormItem) {
      const values = this.formRef.getFormItem();
      if(!values) {
        return;
      }
      Object.assign(datas, {
        ...values,
        status: values.status ? 1 : 0,
      });
    }

    if (current === 'two') {
      const showField = selectList.filter(it => it.field.indexOf('expand_field') === -1);
      const url = title === 'add' ? 'addInvoice/add' : 'addInvoice/edit';
      const params = {
        id: title === 'add' ? '' : id,
        showField: showField.map(it => { return { ...it, status: 1 }; }),
        type: 1,
        ...datas,
        templateType: Number(templateType),
        companyId: userInfo.companyId || '',
        useJson: !datas.isAllUse && datas.userJson ? JSON.stringify(datas.userJson) : '',
        deptJson: !datas.isAllUse && datas.deptJson ?
                JSON.stringify(datas.deptJson) : '',
        status: datas.status ? 1: 0,
        expandField: [],
        selfField: [],
      };
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
        current: basicStr[index+1].key,
      });
    }
  }

  onChangeData = (type, value) => {
    this.setState({
      [type]: value,
    });
  }

  render () {
    const {
      allList,
      fieldList
    } = this.props;
    const { id } = this.props.match.params;
    const title = id.split('_')[0];
    console.log(this.state.selectList);
    const { current, approveList, selectList } = this.state;
    const {  dispatch } = this.props;
    console.log('CategoryAdd -> render -> approveList', approveList);
    const { categoryList, data, templateType } = this.state;
    console.log('CategoryAdd -> render -> categoryList', categoryList);
    const routes = [
      {
        path: '/basicSetting/invoice',
        breadcrumbName: '返回上一页',
        paths: 'basicSetting/invoice'
      },
      {
        path: '/',
        breadcrumbName: '单据模板',
        paths: 'basicSetting/invoice'
      },
      {
        path: 'second',
        breadcrumbName: '新建单据模板',
      },
    ];

    return (
      <div style={{height: '100%'}}>
        <PageHeader
          title={null}
          breadcrumb={{routes}}
          style={{background: '#fff'}}
        />
        <div style={{background: '#fff', width: '100%'}}>
          <Menu
            mode="horizontal"
            className="m-l-32 titleMenu"
            selectedKeys={[current]}
            onClick={(e) => this.onHandle(e)}
          >
            {
              basicStr.map((it, index) => (
                <Menu.Item key={it.key}>
                  <span className={it.key === current ? cs(style.circle, style.active) : style.circle}>{index+1}</span>
                  <span>{it.value}</span>
                </Menu.Item>
              ))
            }
          </Menu>
        </div>
        {
          current === 'one' &&
          <div className="content-dt" style={{height: 'calc(100% - 178px)'}}>
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
            />
          </div>
        }
        {
          current === 'two' &&
          <div style={{height: 'calc(100% - 157px)', padding: '24px 24px 0 24px', display: 'flex'}}>
            <DndProvider backend={HTML5Backend}>
              <StrSetting
                fieldList={fieldList}
                selectList={selectList}
                onChangeData={this.onChangeData}
              />
            </DndProvider>
          </div>
        }
        <FooterBar
          right={(
            <>
              <Button type="default" className="m-r-8">取消</Button>
              <Button type="primary" onClick={() => this.onStep()}>
                { current === 'two' || title !== 'add' ? '保存' : '下一步' }
              </Button>
            </>
          )}
        />
      </div>
    );
  }
}

export default CategoryAdd;
