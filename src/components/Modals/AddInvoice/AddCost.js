/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Divider, InputNumber, Select,
  DatePicker, message, TreeSelect, Tree, Button, Cascader, Tooltip, Icon } from 'antd';
import { connect } from 'dva';
import cs from 'classnames';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import treeConvert from '@/utils/treeConvert';
import fileIcon from '@/utils/fileIcon.js';
import style from './index.scss';
import UploadImg from '../../UploadImg';
import AddCostTable from './AddCostTable';
import { compare, handleProduction, guid, objToArr, getTimeIdNo } from '../../../utils/common';
import fields from '../../../utils/fields';
import defaultFunc from './utils';
import { fileUpload } from '../../../utils/ddApi';
// import TreeCatogory from './TreeCatogory';

const { addCostValue } = defaultFunc;
const uniqueId = guid();
const { Option } = Select;
const { TreeNode } = Tree;
const { RangePicker } = DatePicker;
const { trainLevels, flightLevels } = fields;
const trainList = objToArr(trainLevels);
const flightList = objToArr(flightLevels);
const labelInfo = {
  costName: '支出类别',
  costSum: '金额(元)',
  costNote: '备注',
  imgUrl: '图片',
  happenTime: '发生日期',
  flightLevel: '航班仓型'
};
@Form.create()
@connect(({ global, costGlobal, session }) => ({
  expenseList: global.expenseList,
  deptInfo: global.deptInfo,
  userId: global.userId,
  usableProject: global.usableProject,
  lbDetail: global.lbDetail,
  currencyList: global.currencyList,
  currencyShow: global.currencyShow,
  uploadSpace: global.uploadSpace,
  costCategoryList: global.costCategoryList,
  detailFolder: costGlobal.detailFolder,
  userInfo: session.userInfo,
  userDeps: costGlobal.userDeps,
  exportList: costGlobal.exportList,
  provinceAndCity: costGlobal.provinceAndCity,
}))
class AddCost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      costDetailShareVOS: [],
      initDep: [],// 初始化承担部门
      costDate: 0, // 没有指定日期
      showField: {}, // 是否展示
      newShowField: [],
      imgUrl: [],
      details: props.detail || {}, // 详细信息
      costSum: 0,
      shareAmount: 0,
      project: {},
      expandField: [],
      currencyId: '-1',
      currencyName: '',
      exchangeRate: '1',
      currencySymbol: '¥',
      treeList: [],
      fileUrl: []
      // treeExpandedKeys: [],
    };
  }

  fetchInit = (callback) => {
    const { dispatch } = this.props;
    const arrs = [{
      url: 'global/users',
      params: { type: 1 }
    }, {
      url: 'global/getCurrency',
      params: {  }
    }, {
      url: 'global/usableSupplier',
      params: {  }
    }, {
      url: 'global/usableProject',
      params: { type: 1 }
    }, {
      url: 'costGlobal/provinceAndCity',
      params: {  }
    }];
    const arr = arrs.map(it => {
      return dispatch({
        type: it.url,
        payload: it.params,
      });
    });
    Promise.all(arr).then(() => {
      const { deptInfo, provinceAndCity } = this.props;
      console.log('AddCost -> fetchInit -> deptInfo', deptInfo);
      this.setState({
        initDep: deptInfo,
        treeList: treeConvert({
          rootId: 0,
          pId: 'pid',
          name: 'areaName',
          id: 'areaCode',
          tName: 'label',
          tId: 'value'
        }, provinceAndCity.normalList),
      }, () => {
        callback();
      });
    });
  }

  onShow = async() => {
    const { costType, isDelete4Category } = this.props;
    if (isDelete4Category) {
      message.error('该支出类别已被管理员删除');
      return;
    }
    this.fetchInit(async() => {
      const { initDep } = this.state;
      const { id, provinceAndCity: { normalList } } = this.props;
    if (costType) {
      await this.props.dispatch({
        type: 'global/costList',
        payload: {},
      }).then(() => {
        if (id) {
          this.props.dispatch({
            type: 'costGlobal/detailFolder',
            payload: {
              id,
            }
          }).then(async() => {
            const { detailFolder, currencyList } = this.props;
            const userIds = detailFolder.costDetailShareVOS.map(it => it.userId).filter(item => item);
            const arr = [];
            let currency = {};
            if (detailFolder.currencyId && detailFolder.currencyId !== '-1') {
              // eslint-disable-next-line prefer-destructuring
              currency = currencyList.filter(it => it.id === detailFolder.currencyId)[0];
            }
            if (userIds && userIds.length) {
              this.props.dispatch({
                type: 'costGlobal/userDep',
                payload: {
                  userIds: [...new Set(userIds)],
                }
              }).then(async() => {
                detailFolder.costDetailShareVOS.forEach((it) => {
                  const { userDeps } = this.props;
                  console.log('AddCost -> onShow -> userDeps', userDeps);
                  const obj = {
                    ...it,
                    key: it.id,
                    shareScale: it.shareScale/100,
                    shareAmount: currency.id ? it.currencySum/100 : it.shareAmount/100,
                  };
                  if (!it.userId) {
                    Object.assign(obj, {
                      depList: initDep,
                    });
                  } else {
                    Object.assign(obj, {
                      users: it.userJson ? it.userJson.map(its => { return { ...its, userName: its.name }; }) : [],
                      depList: userDeps[`${it.userId}`],
                    });
                  }
                  arr.push(obj);
                });
                if (detailFolder.belongCity) {
                  const valCity = normalList.filter(it => it.areaCode === detailFolder.belongCity)[0];
                  Object.assign(detailFolder, {
                    belongCity: [valCity.pid, valCity.areaCode]
                  });
                }
                this.setState({
                  details: {
                    ...detailFolder,
                    costSum: currency.id ? detailFolder.currencySum/100 : Number(detailFolder.costSum)/100,
                  },
                  shareAmount: currency.id ? detailFolder.currencySum/100 : Number(detailFolder.costSum)/100,
                  costSum: currency.id ? detailFolder.currencySum/100 : Number(detailFolder.costSum)/100,
                  costDetailShareVOS: arr,
                  currencyId: currency.id || '-1',
                  currencyName: currency.name || '',
                  exchangeRate: currency.exchangeRate || 1,
                  currencySymbol: currency.currencySymbol || '¥',
                  imgUrl: detailFolder.imgUrl,
                  fileUrl: detailFolder.fileUrl || [],
                });
                const expands = detailFolder.selfCostDetailFieldVos ?
                  [...detailFolder.expandCostDetailFieldVos, ...detailFolder.selfCostDetailFieldVos]
                  :
                  [...detailFolder.expandCostDetailFieldVos];
                this.onChange(detailFolder.categoryId, 'folder', expands);
                await this.setState({
                  visible: true,
                });
              });
            } else {
              detailFolder.costDetailShareVOS.forEach((it) => {
                const obj = {
                  ...it,
                  key: it.id,
                  shareScale: it.shareScale/100,
                  shareAmount: currency.id ? it.currencySum/100 : it.shareAmount/100,
                  depList: initDep,
                };
                arr.push(obj);
              });
              let amounts = 0;
              if (currency.id && arr.length) {
                amounts = detailFolder.currencySum/100;
              } else if (!currency.id && arr.length ) {
                amounts = detailFolder.costSum/100;
              }
              if (detailFolder.belongCity) {
                const valCity = normalList.filter(it => it.areaCode === detailFolder.belongCity)[0];
                Object.assign(detailFolder, {
                  belongCity: [valCity.pid, valCity.areaCode]
                });
              }
              this.setState({
                details: {
                  ...detailFolder,
                  costSum: currency.id ? detailFolder.currencySum/100 : Number(detailFolder.costSum)/100,
                },
                shareAmount: amounts,
                costSum: currency.id ? detailFolder.currencySum/100 : Number(detailFolder.costSum)/100,
                costDetailShareVOS: arr,
                currencyId: currency.id || '-1',
                currencyName: currency.name || '',
                exchangeRate: currency.exchangeRate || 1,
                currencySymbol: currency.currencySymbol || '¥',
                imgUrl: detailFolder.imgUrl,
                fileUrl: detailFolder.fileUrl || [],
              });
              const expands = detailFolder.selfCostDetailFieldVos ?
              [...detailFolder.expandCostDetailFieldVos, ...detailFolder.selfCostDetailFieldVos]
              :
              [...detailFolder.expandCostDetailFieldVos];
              this.onChange(detailFolder.categoryId, 'folder', expands);
              await this.setState({
                visible: true,
              });
            }
          });
        } else {
          this.setState({
            visible: true,
          });
        }
      });
    } else {
      await this.props.dispatch({
        type: 'global/expenseList',
        payload: {
          id: this.props.invoiceId
        }
      }).then(async() => {
        const { index, detail, expandField } = this.props;
        const listArr = detail && detail.costDetailShareVOS ? [...detail.costDetailShareVOS] : [];
        const userIdArr = listArr.map(it => it.userId).filter(item => item);
        const deptFlag = listArr.filter(it => it.depList && it.depList.length);
        let newArray = [...listArr];
        if (userIdArr && userIdArr.length && (deptFlag.length !== listArr.length)) {
          newArray = await this.handleDept(listArr, userIdArr);
        }
        console.log('AddCost -> onShow -> newArray', newArray);
        if (index === 0 || index) {
          if (detail.belongCity) {
            const valCity = normalList.filter(it => it.areaCode === detail.belongCity)[0];
            Object.assign(detail, {
              belongCity: [valCity.pid, valCity.areaCode]
            });
          }
          this.setState({
            details: detail,
            fileUrl: detail.fileUrl || [],
            currencyId: detail.currencyId || '-1',
            currencyName: detail.currencyName || '',
            exchangeRate: detail.exchangeRate || '1',
            currencySymbol: detail.currencySymbol || '¥',
            costDetailShareVOS: newArray,
            expandField,
            imgUrl: detail.imgUrl || [],
            costSum: detail.costSum,
            shareAmount: detail.shareTotal,
            visible: true,
          }, () => {
            const newExpands = expandField;
            this.onChange(this.props.detail.categoryId, 'folder', newExpands);
          });
        } else {
          this.setState({
            visible: true,
          });
        }
      });
    }
    });
  }

  //  预览附件
  previewFiless = () => {
    message.error('钉钉暂时不支持未提交单据附件的预览，请提交后预览/下载');
  }

  handleDept = (lists, userIds) => {
    const arr = [];
     return new Promise(resolve => {
      this.props.dispatch({
        type: 'costGlobal/userDep',
        payload: {
          userIds: [...new Set(userIds)],
        }
      }).then(async() => {
        lists.forEach((it, index) => {
          const { userDeps } = this.props;
          console.log('AddCost -> onShow -> userDeps', userDeps);
          const obj = {
            ...it,
            key: it.id || it.key || `${getTimeIdNo()+index}`,
          };
          if (it.userId) {
            Object.assign(obj, {
              users: it.userJson ? it.userJson.map(its => { return { ...its, userName: its.name }; }) : [],
              depList: userDeps[`${it.userId}`],
            });
          }
          arr.push(obj);
        });
        });
        resolve(arr);
     });

  }

  onCancel = (flag) => {
    this.props.form.resetFields();
    if (!flag) {
      this.setState({
        visible: false,
        initDep: [],// 初始化承担部门
      });
    }
    this.setState({
      imgUrl: [],
      costDetailShareVOS: [],
      costDate: 0, // 没有指定日期
      showField: {}, // 是否展示
      newShowField: [],
      expandField: [],
      shareAmount: 0,
      costSum: 0,
      currencyId: '-1',
      currencyName: '',
      exchangeRate: '1',
      currencySymbol: '¥',
      details: {},
      fileUrl: [],
      // treeExpandedKeys: [],
    });
  }

  onSelectTree = () => {
    const { expenseList, costCategoryList, costType } = this.props;
    const newList = costType ? costCategoryList : expenseList;
    const list = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tId: 'value',
      tName: 'title',
      otherKeys: ['type','showField', 'icon', 'note']
    }, newList);
    function addParams(lists){
      lists.forEach(it => {
        if (it.type === 0) {
          it.disabled = true;
        }
        if (it.type === 1) {
          it.disabled = false;
        }
        if (it.children) {
          addParams(it.children);
        }
      });
    }
    addParams(list);
    return list;
  }

  upload = (payload) => {
    return new Promise(resolve => {
      this.props.dispatch({
        type: 'costGlobal/exportList',
        payload,
      }).then(() => {
        const { exportList } = this.props;
        resolve(exportList);
      });
    });
  }

  //  提交
  handleOk = (flag) => {
    const {
      index,
      costType,
      costTitle,
      id,
      lbDetail,
      modify
    } = this.props;
    const {
      costDate,
      costDetailShareVOS,
      details,
      imgUrl,
      shareAmount,
      expandField,
      currencyId,
      currencyName,
      exchangeRate,
      currencySymbol,
      fileUrl
    } = this.state;
    const _this = this;

    this.props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        console.log('AddCost -> handleOk -> val', val);
        // eslint-disable-next-line eqeqeq
        if (costDetailShareVOS.length !== 0 && shareAmount != val.costSum) {
          message.error('分摊明细金额合计不等于支出金额，请修改');
          return;
        }
        const arr = _this.onGetForm ? _this.onGetForm('submit', val.categoryId) : [];
        if (!arr) {
          return;
        }
        let fileUrls  = [];
        if (val.fileUrl) {
          fileUrls = fileUrl;
        }
        const detail = addCostValue({
          costDate,
          val,
          imgUrl,
          fileUrl: fileUrls,
          shareAmount,
          details,
          lbDetail,
          costTitle,
          id,
          expandField,
          currencyId,
          currencyName,
          exchangeRate,
          currencySymbol,
          costType,
          arr
        });
        if (costType){
          const newArr = [];
          detail.costDetailShareVOS.forEach(it => {
            newArr.push({
              key: it.key || getTimeIdNo,
              dingUserId: it.users && it.users.length ? it.users[0].userId : '',
              costDetailId: val.categoryId,
              totalAmount: (((val.costSum) * 1000)/10).toFixed(0),
              'shareAmount': (it.shareAmount * 1000)/10,
              'shareScale': (it.shareScale * 1000)/10,
              'deptId': it.deptId instanceof Array ? it.deptId[0] : it.deptId,
              'userId': it.userId,
              'userJson':it.users,
              deptName: it.deptName,
              userName: it.userName,
              projectId: it.projectId,
            });
          });
          const url = costTitle === 'edit' ? 'costGlobal/editFolder' : 'costGlobal/addFolder';
          this.props.dispatch({
            type: url,
            payload: {
              ...detail,
              costDetailShareVOS: newArr,
              costSum: (((val.costSum) * 1000)/10).toFixed(0),
              id: costTitle === 'edit' ? id : '',
            }
          }).then(() => {
            this.onCancel(flag);
            if (this.props.onCallback) {
              this.props.onCallback();
            }
            if (this.props.invoiceId) {
              this.props.onAddCost(detail, index);
            }
          });
        } else {
          if (modify) {
            Object.assign(detail, { id: details.id });
          }
          this.props.onAddCost(detail, index);
          this.onCancel();
        }
      }
    });
  }

  toFixed = (num, s) => {
    // eslint-disable-next-line no-restricted-properties
    const times = Math.pow(10, s);
    let des = num * times + 0.5;
    des = parseInt(des, 10) / times;
    return `${des  }`;
  }

  // 循环渲染树结构
  loop = data => data.map(item => {
    if (item.children && item.children.length) {
      return (
        <TreeNode
          key={item.value}
          label={item.title}
          value={item.value}
          selectable={!item.disabled}
          title={(
            <div className={cs('icons', item.type ? style.treeNodes : style.titles)}>
              {
                item.type ?
                  <i className={cs(`icon${item.icon}`, 'iconfont', 'fs-28')} />
                  :
                  null
              }
              <div className={style.notes}>
                <span
                  className={`m-l-8 ${item.type ? 'c-black-85' : 'c-black-45'}`}
                  style={{verticalAlign: 'middle', lineHeight: 1}}
                >
                  {item.title}
                </span>
                {
                  item.note && item.type ?
                    item.note.length > 15 ?
                      <Tooltip title={item.note || '-'} getPopupContainer={triggerNode => triggerNode.parentNode}>
                        <span className="c-black-45 fs-12 m-l-8" style={{lineHeight: 1, marginTop: '7px'}}>{item.note}</span>
                      </Tooltip>
                      :
                      <span className="c-black-45 fs-12 m-l-8" style={{lineHeight: 1, marginTop: '7px'}}>{item.note}</span>
                      :
                      null
                }
              </div>
            </div>
          )}
        >
          {this.loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode
      key={item.value}
      label={item.title}
      value={item.value}
      selectable={!item.disabled}
      title={(
        <div className={cs('icons', item.type ? style.treeNodes : style.titles)}>
          {
            item.type ?
              <i className={cs(`icon${item.icon}`, 'iconfont', 'fs-28')} style={{verticalAlign: 'middle'}} />
              :
              null
          }
          <div className={style.notes}>
            <span
              className={`m-l-8 ${item.type ? 'c-black-85' : 'c-black-45'}`}
              style={{verticalAlign: 'middle', lineHeight: 1}}
            >
              {item.title}
            </span>
            {
              item.note && item.type ?
                item.note.length > 15 ?
                  <Tooltip title={item.note || '-'} getPopupContainer={triggerNode => triggerNode.parentNode}>
                    <span className="c-black-45 fs-12 m-l-8" style={{lineHeight: 1, marginTop: '7px'}}>{item.note}</span>
                  </Tooltip>
                  :
                  <span className="c-black-45 fs-12 m-l-8" style={{lineHeight: 1, marginTop: '7px'}}>{item.note}</span>
                  :
                  null
            }
          </div>
        </div>
      )}
    />;
  });

  // 选择支出类别
  onChange = (val, types, expand) => {
    console.log('AddCost -> onChange -> expand', expand);
    let detail = this.state.details;
    const showFields = {};
    let costDate = 0;
    let project = {};
    const { templateType } = this.props;
    this.props.dispatch({
      type: 'global/lbDetail',
      payload: {
        id: val,
        isDisplay: !templateType,
      }
    }).then(() => {
      const { lbDetail } = this.props;
      detail = {
        ...detail,
        categoryName: lbDetail.costName,
        icon: lbDetail.icon,
        categoryId: lbDetail.id,
      };
      this.props.form.setFieldsValue({
        time: null
      });
      console.log('AddCost -> onChange -> detail', detail);
      if (lbDetail.showField) {
        const str = lbDetail.showField;
        str.forEach(it => {
          showFields[it.field] = {...it};
          if (it.field === 'happenTime') {
            costDate = it.dateType ? Number(it.dateType) : 1;
          }
        });
      }
      if (lbDetail.shareField) {
        const strs = lbDetail.shareField;
        strs.forEach(it => {
          if (it.field === 'project') {
            project = {...it};
          }
        });
      }
      if (types === 'folder') {
        const expands = [];
        if (lbDetail.expandField) {
          lbDetail.expandField.forEach(it => {
            const index = expand.findIndex(its => its.field === it.field);
            console.log('AddCost -> onChange -> index', lbDetail.expandField);
            if (index > -1 && it.status) {
              expands.push({
                ...it,
                msg: expand[index].msg,
                startTime: expand[index].startTime || '',
                endTime: expand[index].endTime || '',
              });
            } else if (it.status && index === -1) {
              expands.push({ ...it });
            }
          });
        }
        console.log('AddCost -> onChange -> expands', expands);
        this.setState({
          expandField: expands,
        });
      }
      if (types !== 'edit' && types !== 'folder') {
        const newArr = lbDetail.expandField || [];
        this.setState({
          expandField: newArr,
        });
      }
      this.setState({
        showField: showFields,
        newShowField: lbDetail.showField,
        costDate,
        details: detail,
        project,
      });
    });

  }


  onChangeImg = (val) => {
    this.setState({
      imgUrl: val,
    });
  }

  onChangeAmm = (val) => {
    this.setState({
      costSum: val,
    }, () => {
      const details = [...this.state.costDetailShareVOS];
      if (details && details.length) {
        this.onGetForm('setScale', details, val);
      }
    });
  }

  checkMoney = (rule, value, callback) => {
    if (value) {
      if(!/((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/.test(value)) {
        callback('请输入正确的金额');
      }
      if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(value)) {
        callback('金额小数不能超过2位');
      }
      if (value > 100000000 || value === 100000000) {
        callback('金额需小于1个亿');
      }
      if (value < 0) {
        callback('金额不能小于零');
      }
      callback();
    } else {
      callback();
    }
  }

  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }

  onChangeCurr = (option) => {
    if (option !== '-1') {
      const lists = this.props.currencyList.filter(it => it.id === option);
      this.setState({
        currencyId: option,
        currencyName: lists[0].name,
        exchangeRate: lists[0].exchangeRate,
        currencySymbol: lists[0].currencySymbol
      });
    } else {
      this.setState({
        currencyId: '-1',
        currencyName: '人民币',
        exchangeRate: '1',
        currencySymbol: '¥'
      });
    }
  }

  onDelFile = (index, e, flag) => {
    e.stopPropagation();
    if (flag) {
      message.error('不允许删除');
      return;
    }
    const files = this.state.fileUrl;
    files.splice(index, 1);
    this.setState({
      fileUrl: files
    });
  }

  onChangeState = (type, val) => {
    this.setState({
      [type]: val,
    });
  }

  // 上传附件
  uploadFiles = (callback) => {
    const _this = this;
    this.props.dispatch({
      type: 'global/grantUpload',
      payload: {},
    }).then(() => {
      const { uploadSpace } = this.props;
      fileUpload({spaceId: uploadSpace, max: 9}, (arr) => {
        let file = _this.state.fileUrl;
        file = [...file, ...arr];
        _this.setState({
          fileUrl: file,
        });
        if (callback) callback();
      });
    });
  }

  render() {
    const {
      children,
      form: { getFieldDecorator },
      // expenseList,
      userInfo,
      currencyList,
      currencyShow,
      againCost,
      modify,
      templateType,
    } = this.props;

    const list = this.onSelectTree();
    const {
      visible,
      costDetailShareVOS,
      imgUrl,
      showField,
      newShowField,
      costDate,
      details,
      costSum,
      shareAmount,
      project,
      expandField,
      exchangeRate,
      currencySymbol,
      currencyId,
      treeList,
      fileUrl
    } = this.state;
    const oldRenderField = [...newShowField, ...expandField].sort(compare('sort'));
    const newRenderField = handleProduction(oldRenderField);
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    };
    const formItemLayouts = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };
    return (
      <span className={cs('formItem', style.addCost)}>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="添加支出"
          visible={visible}
          width="880px"
          bodyStyle={{height: '470px', overflowY: 'scroll'}}
          onCancel={() => this.onCancel()}
          maskClosable={false}
          footer={(
            <>
              {
                againCost ?
                  <Button onClick={() => this.handleOk(true)}>再记一笔</Button>
                  :
                  <Button onClick={() => this.onCancel()}>取消</Button>
              }
              <Button type="primary" onClick={() => this.handleOk()}>保存</Button>
            </>
          )}
        >
          <div className={style.addCosts}>
            <Form className="formItem">
              <Row style={{ display: 'flex', flexWrap: 'wrap' }}>
                <Col span={12}>
                  <Form.Item label={labelInfo.costName} {...formItemLayout}>
                    {
                      getFieldDecorator('categoryId', {
                        initialValue: details.categoryId || undefined,
                        rules: [{ required: true, message: '请选择支出类别' }]
                      })(
                        <TreeSelect
                          placeholder="请选择"
                          onChange={this.onChange}
                          style={{width: '100%'}}
                          dropdownStyle={{height: '450px'}}
                          disabled={modify && details.categoryId}
                          showSearch
                          treeNodeFilterProp="label"
                          treeNodeLabelProp="label"
                          // treeExpandedKeys={treeExpandedKeys}
                          // onTreeExpand={this.onTreeExpand}
                          treeDefaultExpandAll
                        >
                          {this.loop(list)}
                        </TreeSelect>
                      )
                    }
                  </Form.Item>
                </Col>
                {
                  currencyShow ?
                    <Col span={12}>
                      <Form.Item label="币种" {...formItemLayouts}>
                        {
                          getFieldDecorator('currencyId', {
                            initialValue: details.currencyId || '-1',
                            rules: [{ required: true, message: '请选择币种' }]
                          })(
                            <Select
                              placeholder="请选择"
                              onChange={this.onChangeCurr}
                            >
                              <Option key="-1">CNY 人民币</Option>
                              {
                                currencyList && currencyList.map(it => (
                                  <Option key={it.id}>{it.currencyCode} {it.name}</Option>
                                ))
                              }
                            </Select>
                          )
                        }
                      </Form.Item>
                      {
                        exchangeRate && exchangeRate !== '1' ?
                          <span style={{float: 'left', margin: '-55px 24px 0 271px'}} className="c-black-36">汇率{exchangeRate}</span>
                          :
                          null
                      }
                    </Col>
                    :
                    null
                }
                {
                  newRenderField && (newRenderField.length > 0) &&
                  newRenderField.filter(it => it.fieldType !== 9).map(it => {
                    if (it.field && (it.field.indexOf('expand_') > -1 || it.field.indexOf('self_') > -1)) {
                      let renderForm = null;
                      let rule = [];
                      let initMsg = it.msg || undefined;
                      if (Number(it.fieldType) === 0) {
                        renderForm = (<Input
                          placeholder={it.note ? it.note : '请输入'}
                          disabled={modify && !it.isModify}
                        />);
                        rule = [{ max: 20, message: '限制20个字' }];
                      } else if (Number(it.fieldType) === 1) {
                        renderForm = (<TextArea
                          placeholder={it.note ? it.note : '请输入'}
                          disabled={modify && !it.isModify}
                        />);
                        rule = [{ max: 128, message: '限制128个字' }];
                      } else if(Number(it.fieldType) === 2 || Number(it.fieldType) === 8) {
                        if (Number(it.fieldType) === 8) {
                          initMsg = it.msg ? it.msg.split(',') : [];
                        }
                        renderForm = (
                          <Select
                            placeholder={it.note ? it.note : '请选择'}
                            disabled={modify && !it.isModify}
                            mode={Number(it.fieldType) === 8 ? 'multiple' : ''}
                          >
                            {
                              it.options && it.options.map(iteems => (
                                <Select.Option key={iteems}>{iteems}</Select.Option>
                              ))
                            }
                          </Select>
                        );
                      } else if (it.fieldType === 5) {
                        if (it.dateType === 1) {
                          initMsg = it.startTime && !it.endTime ?
                          moment(moment(Number(it.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD') : '';
                          renderForm = (
                            <DatePicker
                              style={{width: '100%'}}
                              placeholder={it.note ? it.note : '请选择'}
                              disabled={modify && !it.isModify}
                            />
                          );
                        } else {
                          initMsg = it.startTime && it.endTime ?
                              [moment(moment(Number(it.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD'), moment(moment(Number(it.endTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD')] : [];
                          renderForm = (
                            <RangePicker
                              style={{width: '280px' }}
                              placeholder={it.note ? it.note : '请选择时间'}
                              format="YYYY-MM-DD"
                              disabled={modify && !it.isModify}
                              showTime={{
                                hideDisabledOptions: true,
                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                              }}
                            />
                          );
                        }
                      }
                        return (
                          <>
                            {
                              it.status ?
                                <Col span={12}>
                                  <Form.Item label={it.name} {...formItemLayout}>
                                    {
                                      getFieldDecorator(it.field, {
                                        initialValue: initMsg || undefined,
                                        rules: [
                                          { required: !!(it.isWrite), message: `请${Number(it.fieldType === 2) ? '选择' : '输入'}${it.name}` },
                                          ...rule,
                                        ]
                                      })(
                                        renderForm
                                      )
                                    }
                                    {
                                      it.itemExplain && !!(it.itemExplain.length) &&
                                      it.itemExplain.map(item => (
                                        <p className="fs-12 c-black-45 li-1" style={{marginBottom: 0, marginTop: 0}}>
                                          {item.note}
                                        </p>
                                      ))
                                    }
                                  </Form.Item>
                                </Col>
                                :
                                null
                            }
                          </>
                        );
                    }
                    return (
                      <>
                        {
                          it.fieldType === 7 &&
                          <Col span={12}>
                            <Form.Item
                              label={it.name}
                              {...formItemLayout}
                            >
                              {
                                getFieldDecorator('fileUrl', {
                                  initialValue: fileUrl && fileUrl.length ? fileUrl : null,
                                  rules: [{
                                    required: !!(showField.fileUrl.isWrite),
                                    message: '请选择附件'
                                  }]
                                })(
                                  <Button
                                    onClick={() => this.uploadFiles((val) => {
                                      if (val && val.length) {
                                        this.props.form.setFieldsValue({ fileUrl: val });
                                      }
                                    })}
                                    disabled={(fileUrl && (fileUrl.length > 9 || fileUrl.length === 9))
                                      || (modify && !showField.fileUrl.isModify)}
                                  >
                                    <Icon type="upload" /> 上传文件
                                  </Button>
                                )
                              }
                              {
                                it.itemExplain && !!(it.itemExplain.length) &&
                                it.itemExplain.map(item => (
                                  <p className="fs-12 c-black-45 li-1" style={{marginBottom: 0, marginTop: 0}}>
                                    {item.note}
                                  </p>
                                ))
                              }
                              <p className="fs-14 c-black-45 li-1 m-t-8" style={{marginBottom: 0}}>
                                支持扩展名：.rar .zip .doc .docx .pdf .jpg...
                              </p>
                              {
                                fileUrl.map((item, index) => (
                                  <div key={item.fileId} className={style.fileList} onClick={() => this.previewFiless(item)}>
                                    <div className={style.fileIcon}>
                                      <img
                                        className='attachment-icon'
                                        src={fileIcon[item.fileType]}
                                        alt='attachment-icon'
                                      />
                                      <span className="eslips-1">{item.fileName}</span>
                                    </div>
                                    <i
                                      className="iconfont icondelete_fill"
                                      onClick={(e) => this.onDelFile(index, e, modify && !showField.fileUrl.isModify)}
                                    />
                                  </div>
                                ))
                              }
                            </Form.Item>
                          </Col>
                        }
                        {
                          it.field === 'amount' && !!(showField.amount.status) &&
                          <Col span={12}>
                            <Form.Item label={labelInfo.costSum} {...formItemLayout}>
                              {
                                getFieldDecorator('costSum', {
                                  initialValue: details.costSum || '',
                                  rules: [
                                    { required: true, message: '请输入金额' },
                                    { validator: this.checkMoney }
                                  ]
                                })(
                                  <InputNumber
                                    placeholder={showField.amount && showField.amount.note ?
                                    showField.amount.note : '请输入'}
                                    onChange={(val) => this.onChangeAmm(val)}
                                    style={{width: '100%'}}
                                    disabled={modify && showField.amount && !showField.amount.isModify}
                                  />
                                )
                              }
                              {
                                it.itemExplain && !!(it.itemExplain.length) &&
                                it.itemExplain.map(item => (
                                  <p className="fs-12 c-black-45 li-1 m-t-0" style={{marginBottom: 0}}>
                                    {item.note}
                                  </p>
                                ))
                              }
                            </Form.Item>
                          </Col>
                        }
                        {
                          it.field === 'costNote' && showField.costNote.status ?
                            <Col span={12}>
                              <Form.Item label={labelInfo.costNote} {...formItemLayout}>
                                {
                                  getFieldDecorator('note', {
                                    initialValue: details.note || '',
                                    rules: [{ required: !!(showField.costNote.isWrite), message: '请输入备注' }]
                                  })(
                                    <Input
                                      placeholder={showField.costNote.note ? showField.costNote.note : '请输入'}
                                      disabled={modify && !showField.costNote.isModify}
                                    />
                                  )
                                }
                                {
                                  it.itemExplain && !!(it.itemExplain.length) &&
                                  it.itemExplain.map(item => (
                                    <p className="fs-12 c-black-45 li-1 m-t-0" style={{marginBottom: 0}}>
                                      {item.note}
                                    </p>
                                  ))
                                }
                              </Form.Item>
                            </Col>
                          :
                          null
                        }
                        {
                          (it.field === 'flightLevel' || it.field === 'trainLevel') && showField[it.field].status ?
                            <Col span={12}>
                              <Form.Item label={showField[it.field].name} {...formItemLayout}>
                                {
                                  getFieldDecorator(it.field, {
                                    initialValue: details[it.field] || (details[it.field] === 0) ? `${details[it.field]}` : '',
                                    rules: [{ required: !!(showField[it.field].isWrite), message: '请选择' }]
                                  })(
                                    <Select>
                                      {
                                        it.field === 'flightLevel' ?
                                          flightList.map(item => ( <Option key={item.key}>{item.name}</Option> ))
                                          :
                                          trainList.map(item => ( <Option key={item.key}>{item.name}</Option> ))
                                      }
                                    </Select>
                                  )
                                }
                              </Form.Item>
                            </Col>
                          :
                          null
                        }
                        {
                          (it.field === 'userCount') && showField[it.field].status ?
                            <Col span={12}>
                              <Form.Item label={showField[it.field].name} {...formItemLayout}>
                                {
                                  getFieldDecorator(it.field, {
                                    initialValue: details[it.field] || '',
                                    rules: [{ required: !!(showField[it.field].isWrite), message: '请输入' }]
                                  })(
                                    <InputNumber placeholder="请输入" />
                                  )
                                }
                              </Form.Item>
                            </Col>
                          :
                          null
                        }
                        {
                          (it.field === 'belongCity') && showField[it.field].status ?
                            <Col span={12}>
                              <Form.Item label={showField[it.field].name} {...formItemLayout}>
                                {
                                  getFieldDecorator(it.field, {
                                    initialValue: details[it.field] || '',
                                    rules: [{ required: !!(showField[it.field].isWrite), message: '请选择' }]
                                  })(
                                    <Cascader
                                      options={treeList}
                                      placeholder="请选择"
                                      getPopupContainer={triggerNode => triggerNode.parentNode}
                                      showSearch={this.filter}
                                      allowClear
                                    />
                                  )
                                }
                              </Form.Item>
                            </Col>
                          :
                          null
                        }
                        {
                          it.field === 'happenTime' && showField.happenTime.status &&
                          <Col span={12}>
                            <Form.Item label={labelInfo.happenTime} {...formItemLayout}>
                              {
                                costDate === 1 &&
                                getFieldDecorator('time', {
                                  initialValue: details.startTime && !details.endTime ?
                                  moment(moment(Number(details.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD') : moment().startOf('day'),
                                  rules: [{ required: !!(showField.happenTime.isWrite), message: '请选择时间' }]
                                })(
                                  <DatePicker
                                    style={{width: '100%'}}
                                    disabled={modify && !showField.happenTime.isModify}
                                    placeholder={showField.happenTime.note ? showField.happenTime.note : '请选择时间'}
                                  />
                                )
                              }
                              {
                                costDate === 2 &&
                                getFieldDecorator('time', {
                                  initialValue: details.startTime && details.endTime ?
                                    [moment(moment(Number(details.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
                                    moment(moment(Number(details.endTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD')]
                                    :
                                    [],
                                  rules: [{ required: !!(showField.happenTime.isWrite), message: '请选择时间' }]
                                })(
                                  <RangePicker
                                    style={{width: '280px' }}
                                    placeholder={showField.happenTime.note ?
                                    showField.happenTime.note : '请选择时间'}
                                    format="YYYY-MM-DD"
                                    disabled={modify && !showField.happenTime.isModify}
                                    showTime={{
                                      hideDisabledOptions: true,
                                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                    }}
                                  />
                                )
                              }
                              {
                                it.itemExplain && !!(it.itemExplain.length) &&
                                it.itemExplain.map(item => (
                                  <p className="fs-12 c-black-45 li-1 m-t-0" style={{marginBottom: 0}}>
                                    {item.note}
                                  </p>
                                ))
                              }
                            </Form.Item>
                          </Col>
                        }
                        {
                          it.field === 'imgUrl' && showField.imgUrl.status &&
                          <Col span={12}>
                            <Form.Item
                              label={labelInfo.imgUrl}
                              {...formItemLayout}
                            >
                              {
                                getFieldDecorator('img', {
                                  initialValue: imgUrl.length ? imgUrl : null,
                                  rules: [{
                                    required: !!(showField.imgUrl.isWrite), message: '请选择图片'
                                  }]
                                })(
                                  <UploadImg
                                    onChange={(val) => this.onChangeImg(val)}
                                    imgUrl={imgUrl}
                                    userInfo={userInfo}
                                    disabled={modify && !showField.imgUrl.isModify}
                                  />
                                )
                              }
                              {
                                it.itemExplain && !!(it.itemExplain.length) &&
                                it.itemExplain.map(item => (
                                  <p className="fs-12 c-black-45 li-1 m-t-0" style={{marginBottom: 0}}>
                                    {item.note}
                                  </p>
                                ))
                              }
                            </Form.Item>
                          </Col>
                        }
                      </>
                    );
                  })
                }
              </Row>
              {
                (!templateType || templateType === 3) &&
                <>
                  <Divider type="horizontal" />
                  <AddCostTable
                    costDetailShareVOS={costDetailShareVOS}
                    costSum={costSum}
                    shareAmount={shareAmount}
                    project={project}
                    currencySymbol={currencySymbol}
                    currencyId={currencyId}
                    exchangeRate={exchangeRate}
                    initDep={this.state.initDep}
                    onChange={(type, val) => this.onChangeState(type, val)}
                    invoiceId={this.props.invoiceId}
                    costType={this.props.costType}
                    onGetForm={fn=> { this.onGetForm = fn; }}
                    modify={modify}
                    expenseId={details.categoryId}
                    upload={this.upload}
                    uniqueId={uniqueId}
                  />
                </>
              }

            </Form>
          </div>
        </Modal>
      </span>
    );
  }
}

export default AddCost;
