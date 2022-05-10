/* eslint-disable eqeqeq */
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
import UploadFile from '../../UploadFile';
// import TreeCatogory from './TreeCatogory';
import Capitalization from '../Capitalization';

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
  incomeNote: '收入备注',
  imgUrl: '图片',
  happenTime: '发生日期',
  flightLevel: '航班仓型',
  officeId: '所在公司',
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
  costCategory: costGlobal.costCategory,
  detailFolder: costGlobal.detailFolder,
  userInfo: session.userInfo,
  userDeps: costGlobal.userDeps,
  exportList: costGlobal.exportList,
  provinceAndCity: costGlobal.provinceAndCity,
  officeList: costGlobal.officeList,
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
      fileUrl: [],
      officeId: '',
      ossFileUrl: [],
      // showIds: {},
      // treeExpandedKeys: [],
      showIdsObj: {}, // 是否显示的对象
    };
  }

  fetchInit = (callback) => {
    const { dispatch, templateType, userInfo } = this.props;
    const arrs = [{
      url: 'global/getCurrency',
      params: {  }
    }, {
      url: 'global/usableProject',
      params: { type: 1 }
    }, {
      url: 'costGlobal/provinceAndCity',
      params: {  }
    }];
    if (templateType === undefined) {
      arrs.push({
        url: 'costGlobal/officeList',
        params: {
          userId: userInfo.userId
        }
      });
    }
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

  getDeptInfo = (payload) => {
    const { dispatch } = this.props;
    return new Promise(resolve => {
      dispatch({
        type: 'global/users',
        payload,
      }).then(() => {
        const { deptInfo } = this.props;
        resolve(deptInfo);
      });
    });
  }

  onShow = async () => {
    const { costType, isDelete4Category, officeId, isShowToast, templateType } = this.props;
    console.log('AddCost -> onShow -> officeId', costType);
    // let newOfficeId = officeId;
    if (isDelete4Category) {
      message.error('该支出类别已被管理员删除');
      return;
    }
    if (isShowToast && !officeId) {
      message.error('请先填写所在公司');
      return;
    }
    this.fetchInit(async() => {
      let initDep = await this.getDeptInfo({ type: 1, officeId: officeId || '' });
      const { id, provinceAndCity: { normalList } } = this.props;
    if (costType) {
      await this.props.dispatch({
        type: 'costGlobal/costCategory',
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
            initDep = await this.getDeptInfo({ type: 1, officeId: detailFolder.officeId || officeId || '' });
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
                  officeId: detailFolder.officeId || ''
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
                initDep,
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
                officeId: detailFolder.officeId,
                ossFileUrl: detailFolder.ossFileUrl || [],
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
            initDep,
            officeId: officeId || '',
          });
        }
      });
    } else {
      await this.props.dispatch({
        type: 'global/expenseList',
        payload: {
          id: this.props.invoiceId,
          templateType,
        }
      }).then(async() => {
        const { index, detail, expandField } = this.props;
        const listArr = detail && detail.costDetailShareVOS ? [...detail.costDetailShareVOS] : [];
        const userIdArr = listArr.map(it => it.userId).filter(item => item);
        // const deptFlag = listArr.filter(it => it.depList && it.depList.length);
        let newArray = [...listArr];
        if (userIdArr && userIdArr.length) {
          newArray = await this.handleDept(listArr, userIdArr, officeId, initDep);
        } else {
          newArray = newArray.map(it => {
            const isShowDep = initDep.findIndex(item => item.deptId == it.deptId) > -1;
            return {
              ...it,
              deptId: isShowDep ? it.deptId : '',
              deptName: isShowDep ? it.deptName : '',
              depList: initDep,
            };
          });
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
            ossFileUrl: detail.ossFileUrl || [],
            expandField,
            imgUrl: detail.imgUrl || [],
            costSum: detail.costSum,
            shareAmount: detail.shareTotal,
            visible: true,
            initDep,
            officeId: officeId || '',
          }, () => {
            const newExpands = expandField;
            this.onChange(this.props.detail.categoryId, 'folder', newExpands);
          });
        } else {
          this.setState({
            visible: true,
            initDep,
            officeId: officeId || '',
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

  handleDept = (lists, userIds, officeId, initDep) => {
    console.log('AddCost -> handleDept -> officeId', officeId);
    const arr = [];
     return new Promise(resolve => {
      this.props.dispatch({
        type: 'costGlobal/userDep',
        payload: {
          userIds: [...new Set(userIds)],
          officeId: officeId || '',
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
              deptId: userDeps[`${it.userId}`].findIndex(item => `${item.deptId}` === `${it.deptId}`) > -1
                ? it.deptId : '',
            });
          } else if (initDep.findIndex(item => item.deptId == it.deptId) === -1) {
            Object.assign(obj, {
              deptId: '',
              depList: initDep
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
      ossFileUrl: [],
      // treeExpandedKeys: [],
    });
  }

  onSelectTree = () => {
    const { expenseList, costCategory, costType } = this.props;
    const newList = costType ? costCategory : expenseList;
    const list = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tId: 'value',
      tName: 'title',
      otherKeys: ['type','showField', 'icon', 'note']
    }, newList.sort(compare('sort')));
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
      fileUrl,
      ossFileUrl,
    } = this.state;
    const _this = this;

    this.props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        // eslint-disable-next-line eqeqeq
        if (costDetailShareVOS.length !== 0 && shareAmount != val.costSum) {
          console.log('🚀 ~ file: AddCost.js ~ line 508 ~ AddCost ~ this.props.form.validateFieldsAndScroll ~ shareAmount != val.costSum', shareAmount);
          console.log('🚀 ~ file: AddCost.js ~ line 508 ~ AddCost ~ this.props.form.validateFieldsAndScroll ~ shareAmount != val.costSum', val);
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
        let ossFileUrls  = [];
        if (val.ossFileUrl) {
          ossFileUrls = ossFileUrl;
        }
        if (imgUrl && imgUrl.length > 9) {
          message.error('图片不能超过9张');
          return;
        }
        const detail = addCostValue({
          costDate,
          val,
          imgUrl,
          fileUrl: fileUrls,
          ossFileUrl: ossFileUrls,
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
                  style={{verticalAlign: 'middle'}}
                >
                  {item.title}
                </span>
                {
                  item.note && item.type ?
                    item.note.length > 15 ?
                      <Tooltip title={item.note || '-'} getPopupContainer={triggerNode => triggerNode.parentNode}>
                        <span className="c-black-45 fs-12 m-l-8" style={{lineHeight: 1, marginTop: '4px'}}>{item.note}</span>
                      </Tooltip>
                      :
                      <span className="c-black-45 fs-12 m-l-8" style={{lineHeight: 1, marginTop: '4px'}}>{item.note}</span>
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
              style={{verticalAlign: 'middle'}}
            >
              {item.title}
            </span>
            {
              item.note && item.type ?
                item.note.length > 15 ?
                  <Tooltip title={item.note || '-'} getPopupContainer={triggerNode => triggerNode.parentNode}>
                    <span className="c-black-45 fs-12 m-l-8" style={{lineHeight: 1, marginTop: '4px'}}>{item.note}</span>
                  </Tooltip>
                  :
                  <span className="c-black-45 fs-12 m-l-8" style={{lineHeight: 1, marginTop: '4px'}}>{item.note}</span>
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
    const showObj = {};
    const showFields = {};
    let costDate = 0;
    let project = {};
    const { templateType } = this.props;
    this.props.dispatch({
      type: 'global/lbDetail',
      payload: {
        id: val,
        templateType,
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
      const { expandField } = this.state;
      console.log(this.state.expandField, 'expandField');
      if (expandField&&expandField.length) {
        expandField.forEach(item => {
          // 处理选项关联
          if (item.optionsRelevance && item.optionsRelevance.length) {
            item.optionsRelevance.forEach(i => {
              if (i.ids && i.ids.length) {
                const {ids} = i;
                for (let j = 0; j < ids.length; j++) {
                  if (showObj[ids[j]]) {
                    Object.assign(showObj, {
                      [ids[j]]: item.msg !== i.name ? [...showObj[ids[j]]] : [...showObj[ids[j]], item.field],
                    });
                  } else {
                    Object.assign(showObj, {
                      [ids[j]]: item.msg !== i.name ? [] : [item.field],
                    });
                  }
                }
              }
            });
          }
        });
      }
      this.setState({ showIdsObj: showObj }, () => {
        console.log(this.state.showIdsObj,'showIdsObj999');
      });
      this.setState({
        showField: showFields,
        newShowField: lbDetail.showField,
        costDate,
        details: detail,
        project,
      });
    });

  }


  onChangeImg = (val, key) => {
    this.setState({
      [key]: val,
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
      if (value > 100000000000000 || value === 100000000000000) {
        callback('金额需小于1万个亿');
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

  onChangeOffice = async(val) => {
    const { costDetailShareVOS, officeId } = this.state;
    const initDep = await this.getDeptInfo({ type: 1, officeId: val || '' });
    if (costDetailShareVOS.length) {
      Modal.confirm({
        title: '是否清空分摊信息?',
        onOk: async() => {
          this.setState({
            officeId: val,
            costDetailShareVOS: [],
            initDep
          });
        },
        onCancel: () => {
          this.props.form.setFieldsValue({
            officeId,
          });
        }
      });
    } else {
      this.setState({
        officeId: val,
        initDep,
      });
    }
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
        }, () => {
          if (callback) callback(file);
        });

      });
    });
  }

  flat=(arr)=> {
    let arrResult = [];
    arr.forEach((item) => {
      if (Array.isArray(item)) {
        arrResult = arrResult.concat(this.flat(item)); // 递归
      } else {
        arrResult.push(item);
      }
    });
    return arrResult;
  }
  
  onChangeSelect = (val, obj) => {
  console.log(val, obj.optionsRelevance, '怎么回事');
 // 获取新的showIdsObj
 const { showIdsObj, expandField } = this.state;
 const keyList = Object.keys(showIdsObj);
 const newArrObj = obj.optionsRelevance && obj.optionsRelevance.filter(it => it.name === val);
 let newAddObj = [];
 if (newArrObj && newArrObj.length && newArrObj[0].ids && newArrObj[0].ids.length) {
   newAddObj = newArrObj[0].ids;
 }
 function sortFun(newObj, keyField, keys) {
   for (let i=0; i<keys.length; i++) {
     const it = keys[i];
     const arr = newObj[it] ? newObj[it] : showIdsObj[it];
     const is = arr.filter(im => im !== keyField);
     
     if (is.length === 0 && showIdsObj[it] && arr.length > 0 
         && ((newAddObj.length && !newAddObj.includes(keyField)) || !newAddObj.length)) {
       Object.assign(newObj, {
         [it]: [],
       });
       sortFun(newObj, it, keys);
     } else {
       Object.assign(newObj, {
         [it]: is
       });
     } 
   }
   return newObj;
 }
 const newObjs = sortFun({}, obj.field, keyList);
 console.log('新的值', newObjs);
 if (newAddObj && newAddObj.length) {
   newAddObj.forEach(it => {
     if (it) {
       Object.assign(newObjs, {
         [it]: newObjs[it] ? [...newObjs[it], obj.field] : [obj.field]
       });
     }
     
   });
 }
 console.log('最新的数据', newObjs);
  // 如果之前的选项选择了东西，切换后就清除
    // console.log(Object.keys(newObjs),'666');
    const clearArr = [];
    const clearShowArr = [];
    Object.keys(newObjs).forEach(key => {
      if (!newObjs[key].length) {
        if (key === 'imgUrl' || key === 'fileUrl' || key === 'ossFileUrl' || key === 'happenTime') {
          this.setState({
            [key]: [],
          });
          this.props.form.setFieldsValue({
            '[time]':undefined,
          });
        }
        clearArr.push(`['${key}']`);
        clearShowArr.push(key);
      }
    });
    // 回显编辑时让单选项msg置空
    expandField.forEach(item => {
      if (clearShowArr.length && clearShowArr.includes(item.field)) {
        item.msg = '';
      }
    });
    // 清除选项
    const clearObj = {};
      clearArr.forEach(its => {
      clearObj[its] = undefined;
    });
    console.log(clearObj, '666');
    this.props.form.setFieldsValue({
         ...clearObj
    }, () => { 
      this.setState({ showIdsObj: Object.assign(showIdsObj, newObjs), expandField }, () => {
        console.log(expandField, 'expandField9999');
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
      officeList
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
      fileUrl,
      officeId,
      ossFileUrl,
      showIdsObj
    } = this.state;
    // const { unShowItems } = this.state;
    const oldRenderField = [...newShowField, ...expandField].sort(compare('sort'));
    const newRenderField = handleProduction(oldRenderField);
    
    // const optionsRelevance = []; // 所有关联项
    // const optionsRelevanceIds = []; // 所有关联项的ids集合
    // newRenderField.forEach(item => {
    //   if (item.optionsRelevance) {
    //     optionsRelevance.push(...item.optionsRelevance);
    //   }
    // });
    // optionsRelevance.forEach(item => {
    //   optionsRelevanceIds.push(...item.ids);
    // });
    // const associatedIds = [...new Set(optionsRelevanceIds)];
    // console.log(associatedIds,'associatedIds支出');
    // 回显时
    // const showItem= this.onShowItems(newRenderField,associatedIds);
    // console.log(showItem,'showItem');
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
          title={templateType > 10 ? '添加收入' : '添加支出'}
          visible={visible}
          width="980px"
          bodyStyle={{height: '530px', overflowY: 'scroll'}}
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
          className={this.state.costDetailShareVOS.length >= 5 ? style.shadow : style.addTheCost}
          closeIcon={(
            <div className="modalIcon">
              <i className="iconfont icona-guanbi3x1" />
            </div>
          )}
        >
          <div className={style.addCosts}>
            <Form className="formItem">
              <Row style={{ display: 'flex', flexWrap: 'wrap' }}>
                <Col span={12}>
                  <Form.Item label={templateType === 20 ? '收入类别' : labelInfo.costName} {...formItemLayout}>
                    {
                      getFieldDecorator('categoryId', {
                        initialValue: details.categoryId || undefined,
                        rules: [{ required: true, message: `请选择${templateType === 20 ? '收入' : '支出'}类别` }]
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
                          <span style={{float: 'left', margin: '-45px 24px 0 290px'}} className="c-black-36">汇率{exchangeRate}</span>
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
                    let isShow =true;
                    if (showIdsObj[it.field]) {
                      if (showIdsObj[it.field].length) {
                        isShow = true;
                      } else {
                        isShow = false;
                      }
                    } else {
                     isShow = true;
                    }
                    // console.log(isShow,'999');
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
                          console.log('render -> itw.msg', it.msg);
                          initMsg = it.msg && !(it.msg instanceof Array) ? it.msg.split(',') : [];
                        }
                        renderForm = (
                          <Select
                            placeholder={it.note ? it.note : '请选择'}
                            disabled={modify && !it.isModify}
                            mode={Number(it.fieldType) === 8 ? 'multiple' : ''}
                            onChange={val => this.onChangeSelect(val, {
                              fieldType: it.fieldType, field: it.field,optionsRelevance:it.optionsRelevance })}
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
                              isShow&&it.status ?
                                <Col span={12}>
                                  <Form.Item label={(it.name.length>8)&&(Number(it.fieldType) === 2 || Number(it.fieldType) === 8)?<Tooltip placement="top" title={it.name}>{it.name.replace(it.name.substr(7,it.name.length-7),'···')}</Tooltip>:it.name} {...formItemLayout}>
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
                          isShow&&it.fieldType === 7 && it.field === 'fileUrl' &&
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
                                    disabled={(modify && !showField.fileUrl.isModify)}
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
                                fileUrl && fileUrl.length > 0 && fileUrl.map((item, index) => (
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
                          isShow&&it.field === 'amount' && !!(showField.amount.status) &&
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
                                <div style={{lineHeight:'0',marginBottom: 0}}><Capitalization isMoney={`${this.state.costSum||''}`||''}/></div>
                              }
                              {
                                it.itemExplain && it.itemExplain.length > 0 &&
                                it.itemExplain.map(item => (
                                  <p className="fs-12 c-black-45 li-1 m-t-6" style={{marginBottom: 0}}>
                                    {item.note}
                                  </p>
                                ))
                              }
                            </Form.Item>
                          </Col>
                        }
                        {
                          isShow&&it.field === 'amount' && officeList && officeList.length > 0 && templateType === undefined &&
                            <Col span={12}>
                              <Form.Item label={labelInfo.officeId} {...formItemLayout}>
                                {
                                  getFieldDecorator('officeId', {
                                    initialValue: details.officeId &&
                                    officeList.findIndex(item => item.id === details.officeId) > -1 ?
                                    `${details.officeId}` : officeList.length === 0 ? officeList[0].id : undefined,
                                    rules: [{ required: true, message: '请选择公司' }]
                                  })(
                                    <Select
                                      placeholder='请选择'
                                      getPopupContainer={triggerNode => triggerNode.parentNode}
                                      disabled={modify}
                                      onChange={e => this.onChangeOffice(e)}
                                      showSearch
                                      optionFilterProp="label"
                                    >
                                      {
                                        officeList && officeList.map(item => (
                                          <Option key={`${item.id}`} label={item.officeName}>{item.officeName}</Option>
                                        ))
                                      }
                                    </Select>
                                  )
                                }
                              </Form.Item>
                            </Col>
                        }
                        {
                          isShow&&it.field === 'costNote' && showField.costNote.status ?
                            <Col span={12}>
                              <Form.Item label={labelInfo.costNote} {...formItemLayout}>
                                {
                                  getFieldDecorator('note', {
                                    initialValue: details.note || '',
                                    rules: [
                                      { required: !!(showField.costNote.isWrite), message: '请输入备注' },
                                      { max: 128, message: '备注最多128个字' },
                                    ]
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
                          isShow&&it.field === 'incomeNote' && showField.incomeNote.status ?
                            <Col span={12}>
                              <Form.Item label={showField.incomeNote.name} {...formItemLayout}>
                                {
                                  getFieldDecorator('note', {
                                    initialValue: details.note || '',
                                    rules: [
                                      { required: !!(showField.incomeNote.isWrite), message: '请输入备注' },
                                      { max: 128, message: '备注最多128个字' },
                                    ]
                                  })(
                                    <Input
                                      placeholder={showField.incomeNote.note ? showField.incomeNote.note : '请输入'}
                                      disabled={modify && !showField.incomeNote.isModify}
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
                          isShow&&(it.field === 'flightLevel' || it.field === 'trainLevel') && showField[it.field].status ?
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
                          isShow&&(it.field === 'userCount') && showField[it.field].status ?
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
                          isShow&&(it.field === 'belongCity') && showField[it.field].status ?
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
                          isShow&&it.field === 'happenTime' && showField.happenTime.status &&
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
                                    style={{width: '100%' }}
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
                          isShow&&it.field === 'imgUrl' && showField.imgUrl.status &&
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
                                    onChange={(val) => this.onChangeImg(val, 'imgUrl')}
                                    imgUrl={imgUrl}
                                    userInfo={userInfo}
                                    disabled={modify && !showField.imgUrl.isModify}
                                    maxLen={9}
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
                          isShow&&it.field === 'ossFileUrl' && showField.ossFileUrl.status &&
                          <Col span={12}>
                            <Form.Item
                              label={showField.ossFileUrl.name}
                              {...formItemLayout}
                            >
                              {
                                getFieldDecorator('ossFileUrl', {
                                  initialValue: ossFileUrl.length ? ossFileUrl : null,
                                  rules: [{
                                    required: !!(showField.ossFileUrl.isWrite), message
                                      : `请选择${showField.ossFileUrl.name}`
                                  }]
                                })(
                                  <UploadFile
                                    onChange={(val) => this.onChangeImg(val, 'ossFileUrl')}
                                    fileUrl={ossFileUrl}
                                    userInfo={userInfo}
                                    disabled={modify && !showField.ossFileUrl.isModify}
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
                    officeId={officeId}
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
