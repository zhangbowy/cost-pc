/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { message, PageHeader, Button, Spin } from 'antd';
import { connect } from 'dva';
import moment  from 'moment';
import PageHead from '@/components/pageHead';
import defaultFunc from './component/utils';
import style from './index.scss';
import Lines from '@/components/StyleCom/Lines';
import Bottom from './component/Bottom';
import ChangeForm from './component/FormList';
import {JsonParse, sortBy} from '@/utils/common';
import AddCost from '@/components/Modals/AddInvoice/AddCost';
import CostTable from '@/components/Modals/AddInvoice/CostTable';
import ApproveNode from '@/components/Modals/ApproveNode';
import ChooseContract from './component/chooseContract';
import ContractTable from '@/components/Modals/AddInvoice/ContractTable';
// import { invoiceJson } from '@/utils/constants';
import {numAdd, numMulti} from '@/utils/float';
import {fileUpload} from '@/utils/ddApi';
import treeConvert from '@/utils/treeConvert';
import {adjustApprove} from '@/utils/approve';
import SelectIncome from "../components/SelectIncome";

@connect(({session, global, loading, costGlobal}) => ({
  userInfo: session.userInfo,
  deptInfo: global.deptInfo,
  receiptAcc: global.receiptAcc,
  djDetail: global.djDetail,
  detailJson: global.detailJson,
  detailType: global.detailType, // 产品明细类型
  uploadSpace: global.uploadSpace,
  nodes: global.nodes,
  userId: global.userId,
  usableSupplier: global.usableSupplier,
  usableProject: global.usableProject,
  waitLists: costGlobal.waitLists,
  applyIds: costGlobal.applyIds,
  waitAssessIds: costGlobal.waitAssessIds,
  folderIds: costGlobal.folderIds,
  expenseList: global.expenseList,
  currencyList: global.currencyList,
  userDeps: costGlobal.userDeps,
  officeList: costGlobal.officeList,
  deptTree: costGlobal.deptTree,
  checkStandMsg: costGlobal.checkStandMsg,
  loading: loading.effects['global/addIncome'] || false,
  draftLoading: loading.effects['costGlobal/addIncomeDraft'] || false,
  initLoading: loading.effects['global/djDetail'] || false,
}))
class addInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: [],
      ossFileUrl: [],
      depList: [], // 所在部门
      createDepList: [], // 报销部门
      accountList: [], // 收款账户
      details: {}, // 详情
      users: [],
      costDetailsVo: [], // 分摊
      nodes: {},
      fileUrl: [], // 附件
      showField: {}, // 是否显示输入框
      newshowField: [], // 是否显示输入框
      total: 0, // 报销金额
      loanUserId: '', // 审批人的userId
      expandField: [], // 扩展字段
      // loading: false,
      borrowArr:[],
      assessSum: 0, // 核销金额
      historyParams: {}, // 历史数据
      hisCostDetailsVo: [], // 历史分摊数据
      modifyNote: '',
      expandVos: [], // 审批流的自定义信息
      // submitParams: {},
      id: '',
      operateType: '', // 操作类型，add: 新增
      // associatedIds: [], // 所有被关联项的集合
      showIdsObj: {}, // 是否显示的对象,
      contraccontractDetailtDetail: [],
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    console.log(id);
    const idArr = id.split('~');
    const params = {
      templateType: Number(idArr[1]),
      id: idArr[2],
      operateType: idArr[0],
    };
    if (idArr[0] === 'draft') {
      Object.assign(params, {
        draftId: idArr[3],
      });
    }
    this.onShowHandle(params);
  }

  // 子改expandField
  changeExpandField = (val) => {
    this.setState({ expandField: val });
  }

// 改变showIdsObj

changeShowIdsObj = (val) => {
  const { showIdsObj } = this.state;
  this.setState({showIdsObj:Object.assign(showIdsObj, val)});
  console.log(showIdsObj,'父级最新的showIdsObj');
}

  fetchList = ({ templateType, id, operateType, draftId },callback) => {
    const {
      userInfo,
      dispatch
    } = this.props;
    const userJson = [{
      userName: userInfo.name,
      userId: userInfo.dingUserId,
      avatar: userInfo.avatar,
      name: userInfo.name,
    }];
    const arr = [{
      url: 'global/getCurrency',
      payload: {}
    }, {
      url: 'global/users',
      payload: {
        userJson: JSON.stringify(userJson),
      }
    }, {
      url: 'global/getApplyList',
      payload: {}
    }, {
      url: 'costGlobal/officeList',
      payload: {
        userId: userInfo.userId
      }
    }, {
      url: 'global/users',
      payload: {}
    }, {
      url: 'global/djDetail',
      payload: {
        id,
        type: 1,
        templateType,
      }
    }, {
      url: 'global/expenseList',
      payload: {
        id,
        templateType
      }
    }, {
      url: 'global/usableSupplier',
      payload: {}
    }, {
      url: 'global/receiptAcc',
      payload: {
        pageNo: 1,
        pageSize: 100,
      }
    }, {
      url: 'global/usableProject',
      payload: {
        project: 1,
      }
    }];
    if (!Number(templateType)) {
      arr.push({
        url: 'costGlobal/waitLists',
        payload: {
          pageNo: 1,
          pageSize: 200,
        }
      });
    }
    if (Number(templateType) === 2) {
      arr.push();
    }
    const newArr = arr.map(it => {
      return dispatch({
        type: it.url,
        payload: it.payload,
      });
    });
    Promise.all(newArr).then(() => {
      const create = this.props.deptInfo;
      this.setState({
        depList: create,
        users: userJson,
        loanUserId: userInfo.dingUserId,
        templateType,
        id,
        operateType,
        draftId: draftId || '',
      }, () => {
        if (callback) {
          callback();
        }
      });

    });
  }

  fetchs = (actions, key) => {
    return new Promise(resolve => {
      this.props.dispatch(actions).then(() => {
        resolve(this.props[key]);
      });
    });
  }
  // 处理选项关联获取 ShowIdsObj

  getShowIdsObj = (selfSubmitFieldVos, selfField) => {
    if (selfSubmitFieldVos.length) {
      selfField.forEach(item => {
        selfSubmitFieldVos.forEach(it => {
          if (item.field === it.field) {
            item.msg = it.msg;
           }
        });
      });
    };
  console.log(selfSubmitFieldVos,selfField,'最新的selfField吗');
    const showObj = {};
    if (selfField && selfField.length) {
      selfField.forEach(item => {
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
  }


  onShowHandle = async({ templateType,id, operateType, draftId }) => {
    let detail = this.state.details;
    const {
      userInfo,
    } = this.props;
    const contentJson = localStorage.getItem('contentJson');
    // localStorage.removeItem('contentJson');
    const _this = this;
    this.fetchList({ templateType, id, operateType, draftId }, async() => {
      const create = this.state.depList;
      if (create && create.length > 0) {
        detail = {
          ...detail,
          userId: this.props.userId,
          userName: userInfo.name,
          deptId: create[0].deptId,
          loanUserId: userInfo.dingUserId,
          loanDeptId: create[0].deptId,
          createDingUserId: userInfo.dingUserId,
        };
      } else {
        message.error('部门无法同步，请联系管理员检查应用可见范围设置');
      }
      const { djDetail, dispatch } = this.props;
      console.log('AddInvoice -> onShowHandle -> djDetail999', djDetail);
      const arrUrl = [{
        url: 'global/users',
        payload: {}
      }];
      arrUrl.map(it => {
        return dispatch({
          type: it.url,
          payload: {},
        });
      });
      Promise.all(arrUrl).then(async() => {
        const dep = _this.props.deptInfo;
        if (dep && dep.length > 0) {
          detail = {
            ...detail,
            createDeptId: `${dep[0].deptId}`,
            createDepName: dep[0].name,
          };
        }
        const djDetails = this.props.djDetail;
        this.setState({
          createDepList: dep,
        });
        const obj = {};
        if (djDetails.showField && djDetails.showField.length) {
          djDetails.showField.forEach(item => {
            obj[item.field] = {...item};
          });
        }
        const account = _this.props.receiptAcc;
        const arr = account.filter(it => it.isDefault);

        if (arr && arr.length > 0 && (Number(templateType) !== 2)) {
          detail = {
            ...detail,
            receiptId: arr[0].id,
            receiptName: arr[0].name,
            receiptNameJson: JSON.stringify(arr),
          };
        }
        const { officeList } = this.props;
        console.log('🚀 ~ file: index.js ~ line 318 ~ AddInvoice ~ Promise.all ~ officeList', officeList);
        if (officeList.length > 0 && officeList.length === 1) {
          if (!detail.officeId || officeList.findIndex(it => it.id === detail.officeId) === -1) {
            detail={
              ...detail,
              officeId: officeList[0].id,
            };
          }
        }
        if (!contentJson) {
        // 处理选项关联
        this.getShowIdsObj([],djDetails.selfField);
          let costSelect = localStorage.getItem('selectCost') || '';
          // localStorage.removeItem('selectCost');
          this.setState({
            details: {
              ...detail,
              processPersonId: djDetails.approveId
            },
            showField: obj,
            newshowField: djDetails.showField,
            expandField: djDetails.expandField,
            accountList: account,
          }, () => {
            if (costSelect) {
              costSelect = JSON.parse(costSelect);
              const { expenseList } = this.props;
              console.log('🚀 ~ file: index.js ~ line 292 ~ addInvoice ~ Promise.all ~ expenseList', expenseList);
              const arrs = [];
              const categoryIds = expenseList.map(it => it.id);
              const category = [];
              costSelect.forEach(it => {
                if (it.isDelete4Category) {
                  category.push(it.categoryName);
                } else if (categoryIds.includes(it.categoryId)) {
                  arrs.push(it);
                }
              });
              if (category && category.length) {
                const msg = Array.from(new Set(category)).join('、');
                message.error(`${msg}收入类别被删除，请重新选择`);
              }
              if (arrs.length) {
                const { details } = this.state;
                this.setState({
                  details: {
                    ...details,
                    officeId: arrs.length && officeList.findIndex(it => it.id === arrs[0].officeId) > -1
                      ? arrs[0].officeId
                      : officeList.length === 1
                      ? officeList[0].id
                      : '',
                  }
                }, () => {
                  this.onAddCost(arrs);
                });
              } else {
                this.onAddCost(arrs);
              }
            }
          });
          if (!costSelect) {
            this.getNode();
          }
        } else {
          const contents = JsonParse(contentJson);
          console.log('🚀 ~ file: index.js ~ line 229 ~ addInvoice ~ onShowHandle=async ~ contents', contents);
          const officeLists = await this.fetchOfficeList({
            dingUserId: contents.userJson && contents.userJson.length ? contents.userJson[0].userId : '' });
          if (contents.officeId && (officeLists.findIndex(it => it.id === contents.officeId) === -1)) {
            Object.assign(contents, {
              officeId: officeLists.length === 1 ? officeLists[0].id : undefined,
            });
          }
          this.onInit(contents, djDetails);
          // 处理选项关联 (编辑时)
          // this.getShowIdsObj(contents.expandSubmitFieldVos);
          this.getShowIdsObj(contents.selfSubmitFieldVos,djDetails.selfField);
          await this.setState({
            showField: obj,
            newshowField: djDetails.showField,
            accountList: account,
            historyParams: JsonParse(contentJson),
          });
        }
      });
    });
  }

  fetchOfficeList = (payload) => {
    return new Promise(resolve => {
      this.props.dispatch({
        type: 'costGlobal/officeList',
        payload,
      }).then(() => {
        const { officeList } = this.props;
        resolve(officeList);
      });
    });
  }

  // 编辑初始化数据
  onInit = async(detail, djDetails) => {
    // const { templateType } = detail;
    const expandField = [];
    const { userInfo } = this.props;

    const newDetail = {
      ...detail,
      receiptId: detail.receiptId ? detail.receiptId : '',
      processPersonId: djDetails.approveId,
      repaymentTime: detail.repaymentTime,
      startTime: detail.startTime,
      endTime: detail.endTime,
    };
    const userIds = detail.userId ? [detail.userId] : [];
    if (djDetails.expandField) {
      let newExpand =  detail.expandSubmitFieldVos || [];
      if (detail.selfSubmitFieldVos) {
        newExpand = [...newExpand, ...detail.selfSubmitFieldVos];
      }

      djDetails.expandField.forEach(it => {
        const index = newExpand && newExpand.findIndex(its => its.field === it.field);
        if (index > -1 && it.status) {
          expandField.push({
            ...it,
            msg: newExpand[index].msg,
            startTime: newExpand[index].startTime || '',
            endTime: newExpand[index].endTime || '',
          });
        } else if (it.status) {
          expandField.push({
            ...it,
          });
        }
      });
    }
    this.setState({
      fileUrl: detail.fileUrl || [], // 附件
      imgUrl: detail.imgUrl ? detail.imgUrl  : [],
      ossFileUrl: detail.ossFileUrl ? detail.ossFileUrl : [],
    });
    await this.props.dispatch({
      type: 'costGlobal/userDep',
      payload: {
        userIds: [...new Set(userIds)],
      }
    });
    this.setState({
      total: detail.receiptSum/100,
    });
    this.onInitBorrow([], detail.incomeDetailVo || []);
    const expandVos = [];
    expandField.forEach(it => {
      if (it.fieldType === 2 && it.field.indexOf('expand_') > -1){
        expandVos.push({
          field: it.field,
          msg: it.msg,
        });
      }
    });
    await this.setState({
      depList: detail.userId ? this.props.userDeps[detail.userId] : this.props.userDeps['-1'], // 所在部门
      details: {
        ...newDetail,
        loanEntities: detail.loanEntities || [],
        categorySumEntities: detail.categorySumEntities || [],
        creatorDeptId: detail.createDeptId,
        createDingUserId: userInfo.dingUserId,
        loanUserId: newDetail.userJson ? newDetail.userJson[0].userId : '',
        loanDeptId: detail.deptId,
        processPersonId: djDetails.approveId,
        projectId: detail.projectId || '',
        supplierId: detail.supplierId || '',
        supplier: detail.supplierAccountId ? `${detail.supplierAccountId}_${detail.supplierId}` : ''
      }, // 详情
      users: detail.userJson,
      loanUserId: newDetail.userJson ? newDetail.userJson[0].userId : '', // 审批人的userId
      expandField, // 扩展字段
      assessSum: detail.assessSum || 0, // 核销金额
      expandVos,
    }, () => {
      this.getNode();
    });
  }

  onInitBorrow = (arrs, costDetails) => {
    this.onInitFolder(costDetails || []);
  }

  onInitFolder = (arrs) => {
    const { expenseList } = this.props;
    console.log('🚀 ~ file: index.js ~ line 292 ~ addInvoice ~ Promise.all ~ expenseList', expenseList);
    const newArrs = [];
    const categoryIds = expenseList.map(it => it.id);
    const category = [];
    arrs.forEach(it => {
      if (categoryIds.includes(it.categoryId)) {
        newArrs.push(it);
      } else {
        category.push(it.categoryName);
      }
    });
    console.log('🚀 ~ file: index.js ~ line 467 ~ addInvoice ~ category', category);

    if (category && category.length) {
      const msg = Array.from(new Set(category)).join('、');
      message.error(`${msg}收入类别被删除，请重新选择`);
    }
    const newArr = this.onInitCategory(newArrs);
    console.log('🚀 ~ file: index.js ~ line 625 ~ addInvoice ~ newArr', arrs);
    const newArrKey = defaultFunc.onInitKey([...newArr]);
    console.log('🚀 ~ file: index.js ~ line 627 ~ addInvoice ~ newArrKey', newArrKey);
    // 初始化的数据存储后续比较
    this.setState({
      hisCostDetailsVo: newArrKey,
    });
    this.onAddCost(newArrKey);
  }

  onInitCategory = (selectInvoice) => {
    const { currencyList } = this.props;
    const arr = [];
    selectInvoice.forEach((it, index) => {
      let currency = {};
      if (it.currencyId && it.currencyId !== '-1') {
        // eslint-disable-next-line prefer-destructuring
        currency = currencyList.filter(its => its.id === it.currencyId)[0];
      }
      const obj = {
        ...it,
        key: `a_${index}`,
      };
      arr.push({
        ...obj,
        costSum: it.incomeSum || it.costSum,
        currencyId: it.currencyId || '-1',
        currencyName: currency.name || '',
        exchangeRate: currency.exchangeRate || 1,
        currencySymbol: currency.currencySymbol || '¥',
      });
    });
    return arr;
  }

  InitFolderData = (selectInvoice) => {
    const { currencyList } = this.props;
    const arr = [];
    selectInvoice.forEach(it => {
      let currency = {};
      if (it.currencyId && it.currencyId !== '-1') {
        // eslint-disable-next-line prefer-destructuring
        currency = currencyList.filter(its => its.id === it.currencyId)[0];
      }
      const obj = {
        ...it,
        key: it.id,
        folderType: 'folder',
        detailFolderId: it.id,
      };
      arr.push({
        ...obj,
        currencyId: it.currencyId || '-1',
        currencyName: currency.name || '',
        exchangeRate: currency.exchangeRate || 1,
        currencySymbol: currency.currencySymbol || '¥',
      });
    });
    return arr;
  }

  onCancel = () => {
    if (this.changeForm && this.changeForm.onRest) {
      this.changeForm.onRest();
    }
    if (this.props.onChangeVisible) {
      this.props.onChangeVisible();
    }
    if (this.handleCancel) {
      this.handleCancel();
    }
    localStorage.removeItem('contentJson');
    localStorage.removeItem('selectCost');
    this.setState({
      imgUrl: [],
      ossFileUrl: [],
      depList: [], // 所在部门
      createDepList: [], // 报销部门
      accountList: [], // 收款账户
      details: {}, // 详情
      users: [],
      costDetailsVo: [], // 分摊
      nodes: {},
      fileUrl: [], // 附件
      showField: {}, // 是否显示输入框
      total: 0,
      loanUserId: '', // 审批人的userId
      expandField: [],
      newshowField: [],
      assessSum: 0,
      modifyNote: '',
      historyParams: {}, // 历史数据
      hisCostDetailsVo: [], // 历史分摊数据
      expandVos: [],
      // submitParams: {},
    });
    this.props.history.goBack();
  }

  //  添加费用成功
  onAddCost = async(val, index, flag) => {
    const { costDetailsVo } = this.state;
    let  share = [...costDetailsVo];
    const detail = this.state.details;
    if (!flag) {
      if (index === 0 || index) {
        share.splice(index, 1, val);
      } else if (val instanceof Array) {
        share = share.filter(it => !it.detailFolderId);
        share.push(...val);
      } else {
        share.push(val);
      }
    }
    let mo = 0;
    const loanEntities = [];
    const categorySumEntities = [];
    share.forEach(it => {
      const moneys = it.exchangeRate ? Number(numMulti(it.exchangeRate, it.costSum)) : Number(it.costSum);
      mo=numAdd(moneys, mo);
      categorySumEntities.push({
        categoryId: it.categoryId,
        costSum: ((it.costSum*1000) /10).toFixed(0),
      });
    });
    this.setState({
      costDetailsVo: share,
      total: mo.toFixed(2),
      details: {
        ...detail,
        loanEntities,
        categorySumEntities,
      },
    }, () => {
      // const { costDetailsVo } = this.state;
      const { borrowArr } = this.state;
      this.onAddBorrow(borrowArr);
      this.getNode();
    });
  }

  selectPle = (val) => {
    return new Promise((resolve) => {
      this.props.dispatch({
        type: 'global/users',
        payload: val
      }).then(() => {
        const { deptInfo, userId } = this.props;
        resolve({ deptInfo, userId });
      });
    });
  }

  //  选择借款
  onAddBorrow = (val) => {
    console.log('AddInvoice -> onAddBorrow -> val', val);
    const detailList = [...val];
    const newArr = detailList.sort(sortBy('createTime', true));
    let money = Number(this.state.total);
    let assessSum = 0;
    if (money || (money === 0)) {
      newArr.forEach(it => {
        console.log(money);
        if(Number(money) < (it.waitAssessSum/100)) {
          it.money = money;
          assessSum+=money;
          money = 0;
        } else {
          money-=it.waitAssessSum/100;
          it.money = it.waitAssessSum/100;
          assessSum+=it.waitAssessSum/100;
        }
      });
    }
    this.setState({
      borrowArr: newArr.map((it, index) => { return { ...it, sort: index }; }),
      assessSum: Number(assessSum.toFixed(2)),
    });
  }

  getNode = (payload) => {
    const { details, loanUserId, total, expandVos, id, operateType } = this.state;
    console.log('🚀 ~ file: index.js ~ line 939 ~ AddInvoice ~ total', total);
      console.log('AddInvoice -> getNode -> details', details);
      const objs = {
        ...payload,
        deepQueryFlag: true,
        invoiceTemplateId: id,
        // loanEntities: details.loanEntities,
        // categorySumEntities: details.categorySumEntities,
        creatorDeptId: details.createDeptId || '',
        loanUserId: loanUserId || '',
        loanDeptId: details.deptId || '',
        processPersonId: details.processPersonId || '',
        createDingUserId: details.createDingUserId || '',
        receiptSum: ((total * 1000)/10).toFixed(0),
        projectId: details.projectId || '',
        supplierId: details.supplierId || '',
        expandVos,
        officeId: details.officeId || '',
        incomeCategoryIds: details.categorySumEntities.map(it => it.categoryId) || [],
      };
    if (operateType !== 'modify' && details.processPersonId) {
      this.props.dispatch({
        type: 'global/approveList',
        payload: {...objs},
      }).then(() => {
        const { nodes, userInfo } = this.props;
        this.setState({
          nodes: adjustApprove(nodes, { loginInfo: userInfo }),
        });
      });
    }
  }

  onChangeNode = (val) => {
    this.setState({
      nodes: val
    });
  }

  handleOk = async() => {
    const {
      nodes,
      costDetailsVo,
      details,
      total,
      showField,
      // newshowField,
      id,
      contractDetail
    } = this.state;
    const { userInfo } = this.props;
    let params = {
      ...details,
      incomeTemplateId: id,
      userId: details.userId || '',
      receiptSum: ((total * 1000)/10).toFixed(0),
      costSum: ((total * 1000)/10).toFixed(0),
      showField: JSON.stringify(showField),
      assessSum: 0,
    };
    // 关联收入合同
    if (contractDetail && contractDetail.length) {
      const loanSum = contractDetail.reduce((pre, {loanSum, freezeSum}) => pre + loanSum - freezeSum, 0);
      // 如果收款金额大于合同的未收金额
      if (total * 100 > loanSum) {
        message.error('收款总金额不能大于合同未收金额！');
        return;
      }
      params.contractId = contractDetail[0].id;
    }
    if (this.changeForm &&
      this.changeForm.onSaveForm &&
      this.changeForm.onSaveForm()) {
      params = {
        ...params,
        ...this.changeForm.onSaveForm(),
      };
    } else {
      return;
    }
    const arr = defaultFunc.handleCost(costDetailsVo, id);
    params = {
      ...params,
      nodeConfigInfo: adjustApprove(nodes, { loginInfo: userInfo }),
      incomeDetailVo: arr,
    };
    if ((showField.receiptId && !showField.receiptId.status) || !showField.receiptId) {
      Object.assign(params, {
        receiptId: '',
        receiptName: '',
        receiptNameJson: '',
      });
    }
    this.onSubmit(params);
  }

  // 保存草稿
  handelOkDraft = async() => {
    const val = (this.changeForm && this.changeForm.onGetVal()) || {};
    console.log('AddInvoice -> handelOkDraft -> val', val);
    // if (!val.reason) {
    //   message.error('请输入事由');
    //   return;
    // }
    const {
      imgUrl,
      ossFileUrl,
      fileUrl,
      nodes,
      costDetailsVo,
      depList,
      users,
      details,
      createDepList,
      total,
      expandField,
      draftId,
      id,
      templateType
    } = this.state;
    const { djDetail } = this.props;
    const dep = depList.filter(it => `${it.deptId}` === `${val.deptId}`);
    const dept = createDepList.filter(it => `${it.deptId}` === `${val.createDeptId}`);
    const expandSubmitFieldVos = [];
    const selfSubmitFieldVos = [];
    if (expandField && expandField.length > 0) {
      expandField.forEach(it => {
        let obj = {
          ...it,
        };
        console.log(val[it.field]);
        if (Number(it.fieldType) !== 9) {
          obj = {
            ...obj,
            msg: Number(it.fieldType) === 5 && val[it.field] ?
            JSON.stringify(val[it.field]) : val[it.field] ? val[it.field].toString() : val[it.field],
          };
        }
        if (Number(it.fieldType) === 5 && val[it.field]) {
          Object.assign(obj, {
            startTime: Number(it.dateType) === 2 ?
            moment(val[it.field][0]).format('x') : moment(val[it.field]).format('x'),
            endTime: Number(it.dateType) === 2 ? moment(val[it.field][1]).format('x') : '',
          });
        }
        if (it.status&& it.field.indexOf('expand_') > -1) {
          expandSubmitFieldVos.push(obj);
        } else if (it.status && it.field.indexOf('self_') > -1){
          selfSubmitFieldVos.push(obj);
        }
      });
    }
    let params = {
      ...details,
      incomeTemplateId: djDetail.id,
      reason: val.reason,
      note: val.note || '',
      userId: details.userId || '',
      deptId: val.deptId,
      deptName: dep && dep.length > 0 ? dep[0].name : '',
      userJson: users,
      createDeptId: val.createDeptId,
      createDeptName: dept && dept.length > 0 ? dept[0].name : '',
      nodeConfigInfo: nodes,
      month: val.month ? moment(val.month).format('x') : undefined,
      projectId: val.projectId || '',
      supplierAccountId: val.supplier ? val.supplier.split('_')[0] : '',
      supplierId: val.supplier ? val.supplier.split('_')[1] : '',
      imgUrl,
      fileUrl,
      ossFileUrl,
      receiptSum: ((total * 1000)/10).toFixed(0),
      costSum: ((total * 1000)/10).toFixed(0),
      expandSubmitFieldVos,
      selfSubmitFieldVos
    };
    const arr = defaultFunc.handleCost(costDetailsVo, id);
    params = {
      ...params,
      incomeDetailVo: arr,
    };
    const url = draftId ? 'costGlobal/editIncomeDraft' : 'costGlobal/addIncomeDraft';
    this.props.dispatch({
      type: url,
      payload: {
        contentJson: JSON.stringify(params),
        receiptSum: ((total * 1000)/10).toFixed(0),
        costSum: ((total * 1000)/10).toFixed(0),
        templateType,
        reason: val.reason,
        incomeTemplateName: djDetail.name,
        incomeTemplateId: djDetail.id,
        id: draftId || '',
        supplierAccountId: val.supplier ? val.supplier.split('_')[0] : '',
        supplierId: val.supplier ? val.supplier.split('_')[1] : '',
        receiptId: details.receiptId || '',
        receiptName: details.receiptName || ''
      }
    }).then(() => {
      message.success('保存草稿成功');
      this.onCancel();
    });
  }

  onSubmit = (params) => {
    const { dispatch } = this.props;
    const {
      costDetailsVo,
      historyParams,
      hisCostDetailsVo,
      modifyNote,
      draftId,
      templateType,
      operateType,
    } = this.state;
    if (params.imgUrl && params.imgUrl.length > 9) {
      message.error('图片不能超过9张');
      return;
    }
    if (operateType !== 'modify') {
      dispatch({
        type: 'global/addIncome',
        payload : {
          ...params,
          templateType,
          draftId: draftId || '',
          assessSum: 0,
        }
      }).then(() => {
        this.onCancel();
        message.success('发起单据成功');
      });
    } else {
      const compareParams = defaultFunc.compareParams({
        hisCostDetailsVo,
        hisParams: historyParams,
        params,
        costDetailsVo,
        templateType
      });
      if (!modifyNote) {
        message.error('请输入改单理由');
        return;
      }
      dispatch({
        type: templateType ? 'costGlobal/loanEdit' : 'costGlobal/invoiceEdit',
        payload: {
          ...compareParams,
          modifyNote,
        }
      }).then(() => {
        this.onCancel();
        message.success('修改单据成功');
      });
    }
  }

  onChangeData = (val) => {
    this.setState({
      costDetailsVo: val,
    }, () => {
      this.onAddCost(val, 0, true);
    });
  }

  onChangeContract = (val) => {

    this.setState({
      contractDetail: val,
    }, () => {
      // this.onAddCost(val, 0, true);
    });
  }

  // 子组件改变父组件的state
  changeSetData = (val, flag) => {
    this.setState({
      ...val,
    }, () => {
      if (flag) {
        this.getNode();
      }
    });
  }

  // 上传附件
  onUploadFiles = (callback) => {
    const _this = this;
    this.props.dispatch({
      type: 'global/grantUpload',
      payload: {},
    }).then(() => {
      const { uploadSpace } = this.props;
      fileUpload({spaceId: uploadSpace, max: 100}, (arr) => {
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

  changeBorrows = (val,keys) => {
    this.onAddBorrow(val, keys);
  }

  handelAcc = () => {
    let detail = this.state.details;
    this.props.dispatch({
      type: 'global/receiptAcc',
      payload: {
        pageNo: 1,
        pageSize: 100,
      }
    }).then(() => {
      const account = this.props.receiptAcc;
      const arr = account.filter(it => it.isDefault && (it.status === 1));
      if (arr && arr.length > 0) {
        detail = {
          ...detail,
          receiptId: arr[0].id,
          receiptName: arr[0].name,
          receiptNameJson: JSON.stringify(arr),
        };
      }
      this.setState({
        details: detail,
        accountList: account,
      });
    });
  }

  sortData = (data) => {
    for (let i = 0; i < data.length; i++) {
      const e = data[i];
      if (e.children && e.children.length) {
        this.sortData(e.children);
      }
    }
    data.sort((a, b) => {
      return a.sort - b.sort;
    });
  }

  onSelectTree = () => {
    const { usableSupplier } = this.props;
    const list = treeConvert({
      rootId: 0,
      pId: 'parentId',
      tName: 'title',
      tId: 'value',
      name: 'name',
      otherKeys: ['note', 'id', 'userJson', 'deptJson', 'isAllUse', 'type', 'status', 'sort', 'parentId', 'supplierAccounts']
    }, usableSupplier);
    this.sortData(list);
    return list;
  }

  onChangeOffice = (val) => {
    const { details } = this.state;
    this.setState({
      details: { ...details, officeId: val }
    }, () => {
      this.getNode({});
    });
  }

  checkOffice = (payload) => {
    const { details } = this.state;
    return new Promise(resolve => {
      this.props.dispatch({
        type: 'costGlobal/officeList',
        payload,
      }).then(() => {
        const { officeList } = this.props;
        console.log('🚀 ~ file: index.js ~ line 1014 ~ addInvoice ~ officeList', officeList);
        this.setState({
          details: {
            ...details,
            officeId: officeList.length === 1 ? officeList[0].id : '',
          }
        }, () => {
          resolve({
            flags: true,
            details: {
              ...details,
              officeId: officeList.length === 1 ? officeList[0].id : '',
            }
          });
        });

      });
    });
  }

  render() {
    const {
      userInfo,
      loading,
      draftLoading,
      djDetail,
      // operateType, // 操作类型，改单：modify, 复制：copy
      usableProject,
      officeList, // 所在公司列表,
      userDeps,
    } = this.props;
    const supplierList = this.onSelectTree();
    const {
      total,
      templateType,
      imgUrl,
      ossFileUrl,
      depList,
      createDepList,
      accountList,
      details,
      users,
      costDetailsVo,
      nodes,
      fileUrl,
      showField,
      expandField,
      assessSum,
      newshowField,
      operateType,
      expandVos,
      id,
      associatedIds,
      showIdsObj,
      contractDetail
    } = this.state;
    const modify = operateType === 'modify';
    const routes = [
      {
        path: 'second',
        breadcrumbName: `${operateType === 'modify' ? '编辑' : '新建'}${djDetail.name}单据`,
      },
    ];
    return (
      <div style={{ height: '100%' }}>
        <div style={{ width: '100%' }}>
          <PageHead title={
            <PageHeader
              title={null}
              breadcrumb={{routes}}
              style={{background: '#fff'}}
            />
            }
          />
        </div>
        <Spin spinning={this.props.initLoading}>
          <div className="content-dt" style={{height: 'calc(100vh - 200px)'}}>
            <div className="m-b-24">
              <Lines name="基本信息" />
            </div>
            <ChangeForm
              userInfo={userInfo}
              showField={showField}
              newshowField={newshowField}
              imgUrl={imgUrl}
              ossFileUrl={ossFileUrl}
              fileUrl={fileUrl}
              modify={modify}
              templateType={templateType}
              supplierList={supplierList}
              handelAcc={this.handelAcc}
              usableProject={usableProject}
              accountList={accountList}
              users={users}
              depList={depList}
              expandField={expandField}
              changeExpandField={this.changeExpandField}
              details={details}
              createDepList={createDepList}
              djDetail={djDetail}
              allDeptList={userDeps['-1']}
              uploadFiles={this.onUploadFiles}
              onChangeData={this.changeSetData}
              costDetailsVo={costDetailsVo}
              selectPle={this.selectPle}
              wrappedComponentRef={form => {this.changeForm = form;}}
              expandVos={expandVos}
              officeList={officeList}
              onChangeOffice={this.onChangeOffice}
              checkOffice={this.checkOffice}
              associatedIds={associatedIds}
              showIdsObj={showIdsObj}
              changeShowIdsObj={this.changeShowIdsObj}
            />
            <div style={{paddingTop: '24px', paddingBottom: '30px',
              width: this.state.costDetailsVo.length ? '100%' : '936px'}}
            >
              <Lines name={`收入明细${costDetailsVo && costDetailsVo.length > 0 ? `（合计¥${total}）` : ''}`} />
              <div className={costDetailsVo && costDetailsVo.length > 0 ? style.addBtns : style.addbtn}>
                {
                  !modify &&
                  <AddCost
                    userInfo={userInfo}
                    invoiceId={id}
                    onAddCost={this.onAddCost}
                    key="handle"
                    modify={modify}
                    templateType={Number(templateType)}
                    officeId={details.officeId}
                    isShowToast={officeList.length}
                  >
                    <Button
                      icon={costDetailsVo && costDetailsVo.length > 0 ? 'none' : 'plus'}
                      className={style.addHandle}
                      key="handle"
                      type={costDetailsVo && costDetailsVo.length > 0 ? 'primary' : 'default'}
                    >手动添加
                    </Button>
                  </AddCost>
                }
                {
                  costDetailsVo && costDetailsVo.length > 0 &&
                  <CostTable
                    list={costDetailsVo}
                    userInfo={userInfo}
                    invoiceId={id}
                    onChangeData={(val) => this.onChangeData(val)}
                    addCost={this.onAddCost}
                    modify={modify}
                    templateType={Number(templateType)}
                    officeId={details.officeId}
                  />
                }
              </div>
            </div>
            <div>
              <Lines name={`关联收入合同`}/>
              <div>
                <ChooseContract contractDetail={contractDetail} onOk={(val) => this.onChangeContract(val)}>
                  {
                    contractDetail && contractDetail.length > 0 ? (
                        <Button type="primary" className="m-r-16 m-t-16 m-b-16">选择收入合同</Button>
                      ): (
                      <Button
                        icon={'plus'}
                        className={style.addHandle}
                        key="handle"
                        type={ 'default'}
                        style={{width: 231}}
                      >手动添加
                      </Button>
                      )
                  }
                </ChooseContract>
                {
                  contractDetail && contractDetail.length > 0 && (
                    <ContractTable page={1} list={contractDetail} onOk={(val) => this.onChangeContract([])} hiddenRadio isShowDel></ContractTable>
                  )
                }
              </div>
            </div>
            {
              !modify &&
              <div style={{paddingTop: '24px', paddingBottom: '30px'}}>
                <Lines name="审批流程"/>
                <ApproveNode
                  approveNodes={nodes}
                  onChangeForm={(val) => this.onChangeNode(val)}
                />
              </div>
            }
          </div>
        </Spin>
        <Bottom
          total={total}
          onSave={this.handleOk}
          onCancel={this.onCancel}
          onDraft={this.handelOkDraft}
          loading={loading}
          draftLoading={draftLoading}
          djDetail={djDetail}
          assessSum={assessSum}
          modify={modify}
        />
      </div>
    );
  }
}

export default addInvoice;
