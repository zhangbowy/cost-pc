import React, { PureComponent } from 'react';
import { PageHeader, Menu, Button } from 'antd';
import { connect } from 'dva';
import cs from 'classnames';
import treeConvert from '@/utils/treeConvert';
import PageHead from '@/components/PageHead';
import LabelLeft from '../../../../components/LabelLeft';
// import style from './index.scss';
import FooterBar from '../../../../components/FooterBar';
import Basic from '../components/Basic';
import Share from './components/Share';
import { classifyShare } from '../../../../utils/constants';
import { timeStampToHex } from '../../../../utils/common';
// import StrSetting from '../../invoice/$id/components/StrSetting';
// import StrSetting from './components/StrSetting';
// import PreviewBox from './components/PreviewBox';
import DragContent from './components/DragContent';

const basicStr = [{
  key: 'one',
  value: '基础设置',
}, {
  key: 'two',
  value: '字段设置',
}, {
  key: 'three',
  value: '分摊设置',
}];
@connect(({ loading, session, addCategory, costGlobal }) => ({
  loading: loading.effects['addCategory/add'] || loading.effects['addCategory/edit'],
  userInfo: session.userInfo,
  details: addCategory.details,
  allList: addCategory.allList,
  checkDel: addCategory.checkDel,
  expandLists: addCategory.expandLists,
  fieldList: addCategory.fieldList,
  isModifyInvoice: costGlobal.isModifyInvoice
}))
class CategoryAdd extends PureComponent {

  state = {
    current: 'one',
    data: {},
    selectList: [],
    shareField: classifyShare,
    fieldList: [],
  }

  componentDidMount(){
    const { id } = this.props.match.params;
    const title = id.split('_')[0];
    const costId = id.split('_')[1];
    this.props.dispatch({
      type: 'costGlobal/queryModifyOrder',
      payload:{}
    });
    this.props.dispatch({
      type: 'addCategory/allList',
      payload: {
        attribute: title === 'add' ? costId : id.split('_')[2],
      }
    }).then(() => {
      const _this = this;
      const { allList } = this.props;
      const lists = treeConvert({
        rootId: 0,
        pId: 'parentId',
        tName: 'costName',
        name: 'costName',
        otherKeys: ['icon', 'note', 'type']
      }, allList);
      const { userInfo } = this.props;
      if (title !== 'add' && title !== 'child') {
        this.props.dispatch({
          type: 'addCategory/detail',
          payload: {
            id: costId,
            companyId: userInfo.companyId || ''
          }
        }).then(() => {
          let datas = {};
          const { details } = _this.props;
          const showFiels = [...details.showField, ...details.expandField, ...details.selfFields] || [];
          datas = {
            ...details,
            parentId: _this.findIndexArray(lists, details.parentId, []),
            status: Number(details.status) === 1,
          };
          if (title === 'copy') {
            Object.assign(datas, {
              costName: `${details.costName}的副本`
            });
          }
          _this.setState({
            data: datas,
            selectList: showFiels.sort(this.compare('sort')),
            shareField: details.shareField,
          });
        });
      } else if (title === 'child') {
        const newData = {
          parentId: this.findIndexArray(lists, costId, []),
        };
        _this.setState({
          data: newData,
        });
      }
    });
    this.props.dispatch({
      type: 'addCategory/fieldList',
      payload: {
        categoryId: title !== 'add' && title !== 'child' ? costId : '',
      }
    }).then(() => {
      const { fieldList } = this.props;
      const newArr = fieldList.filter(it => it.isSelect);
      if (title === 'add' || title === 'child') {
        this.setState({
          selectList: newArr,
        });
      }
      this.setState({
        fieldList,
      });
    });

  }

  findIndexArray  = (data, id, indexArray) => {
    const arr = Array.from(indexArray);
    for (let i = 0, len = data.length; i < len; i+=1) {
      arr.push(data[i].id);
      if (data[i].id === id) {
        return arr;
      }
      const {children} = data[i];
      if (children && children.length) {
        const result = this.findIndexArray(children, id, arr);
        if (result) return result;
      }
      arr.pop();
    }
    return false;
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
      if (this.formRef && this.formRef.getFormItems) {
        const datas = {};
        const values = this.formRef.getFormItems();
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

  idGenerator = () => {
    let qutient = 10000;
    const chars = '0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz';
    const charArr = chars.split( '' );
    const radix = chars.length;
    const res = [];
    do {
      const mod = qutient % radix;
      qutient = ( qutient - mod ) / radix;
      res.push( charArr[mod] );
    } while ( qutient );
    const time = timeStampToHex();

    return `self_${res.join('')}${time+1}`;

    // return `${nodeType}_${time+1}`;

  }

  onStep = (flag) => {
    const { current, data, selectList, shareField } = this.state;
    const newSelectList = [...selectList];
    const { id } = this.props.match.params;
    const title = id.split('_')[0];
    const costId = id.split('_')[1];
    const { userInfo } = this.props;
    const datas = data;
    if (current === 'one') {
      const values = this.formRef.getFormItems();
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
      newSelectList.splice(indexs, 1, valStr);
    }

    if ((current === 'three' || (title !== 'add' && title !== 'child')) && flag !== 'down') {
      const url = title !== 'edit' ? 'addCategory/add' : 'addCategory/edit';
      const newArr = newSelectList.map((it, index) => { return { ...it, isSelect: true, sort: (index+1), status: 1 }; });
      const showField = newArr.filter(it => (it.field.indexOf('expand_field') === -1 && it.field.indexOf('self_') === -1));
      const params = {
        id: title !== 'edit' ? '' : costId,
        showField: showField.map(it => { return { ...it, status: 1 }; }),
        shareField: shareField.map(it => { return { ...it, status: it.status ? 1 : 0 }; }),
        type: 1,
        ...datas,
        companyId: userInfo.companyId || '',
        parentId: (datas.parentId && datas.parentId[datas.parentId.length-1]) || '',
        status: datas.status ? 1: 0,
        expandField: newArr.filter(it => it.field.indexOf('expand_field') > -1),
        selfFields: newArr.filter(it => it.field.indexOf('self_') > -1),
        attribute: title === 'add' ? costId : id.split('_')[2],
      };
      this.props.dispatch({
        type: url,
        payload: {
          ...params,
        }
      }).then(() => {
        this.props.history.push('/basicSetting/costCategory');
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

  onChangeData = (type, value) => {
    this.setState({
      [type]: value,
    });
    if (type === 'selectList') {
      const { fieldList } = this.state;
      let newArr = [...fieldList];
      const oldField = newArr.map(it => it.field) || [];
      const add = [];
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
      console.log('CategoryAdd -> onChangeData -> fields', fields);
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
      }, () => {
        console.log(this.state.fieldList);
      });
    }
  }

  onCancel = () => {
    this.props.history.push('/basicSetting/costCategory');
  }

  render () {
    const {
      allList,
      isModifyInvoice
    } = this.props;
    const { id } = this.props.match.params;
    const title = id.split('_')[0];
    // const costId = id.split('_')[1];
    const { current, shareField, selectList, fieldList, data } = this.state;
    console.log('CategoryAdd -> render -> selectList', selectList);
    const routes = [
      {
        path: '/basicSetting/costCategory',
        breadcrumbName: '支出类别设置',
      },
      {
        path: 'second',
        breadcrumbName: `${title !== 'edit' ? '新建' : '编辑'}支出类别`,
      },
    ];

    return (
      <div style={{height: '100%', minWidth: '1000px'}}>
        <PageHead title={
          <PageHeader
            title={null}
            breadcrumb={{routes}}
            style={{background: '#fff'}}
          />
        }
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
                  <span
                    className={it.key === current ?
                    cs('circle', 'active') : 'circle'}
                  >
                    {index+1}
                  </span>
                  <span>{it.value}</span>
                </Menu.Item>
              ))
            }
          </Menu>
        </div>
        {
          current === 'one' &&
          <div className="content-dt" style={{height: 'calc(100% - 178px)', minWidth: '1000px'}}>
            <LabelLeft title="基础设置" />
            <Basic
              wrappedComponentRef={form => {this.formRef = form;}}
              list={allList}
              data={data}
              title={title}
            />
          </div>
        }
        {
          current === 'two' &&
          <DragContent
            fieldList={fieldList}
            selectList={selectList}
            onChangeData={this.onChangeData}
            isModifyInvoice={isModifyInvoice}
            operateType={title}
            middleRef={ref => {this.childRef = ref;}}
            selectId="costCategory"
            type="cost"
          />
        }
        {
          current === 'three' &&
          <div className="content-dt" style={{height: 'calc(100% - 178px)'}}>
            <LabelLeft title="基础设置" />
            <Share
              // wrappedComponentRef={form => {this.formRef = form;}}
              shareField={shareField}
              onChangeData={this.onChangeData}
            />
          </div>
        }
        <FooterBar
          right={(
            <>
              <Button
                type="default"
                className="m-r-8"
                onClick={() => this.onCancel()}
              >
                取消
              </Button>
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
                {
                  current === 'three' ||
                  (title !== 'add' && title !== 'child') ? '保存' : '下一步'
                }
              </Button>
            </>
          )}
        />
      </div>
    );
  }
}

export default CategoryAdd;
