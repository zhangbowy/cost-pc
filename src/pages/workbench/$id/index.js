/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { message, PageHeader, Button, Input, Modal, Spin } from 'antd';
import { connect } from 'dva';
import moment  from 'moment';
import PageHead from '@/components/pageHead';
import defaultFunc from './component/utils';
import style from './index.scss';
import Lines from '../../../components/StyleCom/Lines';
import Bottom from './component/Bottom';
import ChangeForm from './component/FormList';
import { JsonParse, sortBy } from '../../../utils/common';
import AddCost from '../../../components/Modals/AddInvoice/AddCost';
import AddFolder from '../../../components/Modals/AddInvoice/AddFolder';
import CostTable from '../../../components/Modals/AddInvoice/CostTable';
import CategoryTable from '../../../components/Modals/AddInvoice/InvoiceTable/CategoryTable';
import AddTravel from '../../../components/Modals/AddInvoice/InvoiceTable/AddTravel';
import AddBorrow from '../../../components/Modals/AddInvoice/AddBorrow';
import BorrowTable from '../../../components/Modals/AddInvoice/BorrowTable';
import AddApply from '../../../components/Modals/AddInvoice/AddApply';
import ApplyTable from '../../../components/Modals/AddInvoice/ApplyTable';
import ApproveNode from '../../../components/Modals/ApproveNode';
import StandardModal from '../../../components/Modals/AddInvoice/StandardModal';
import { invoiceJson } from '../../../utils/constants';
import { numAdd, numMulti } from '../../../utils/float';
import { fileUpload } from '../../../utils/ddApi';
import treeConvert from '../../../utils/treeConvert';
import { adjustApprove } from '../../../utils/approve';


const { TextArea } = Input;
const { confirm } = Modal;
@connect(({ session, global, loading, costGlobal }) => ({
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
  aliCostAndI: costGlobal.aliCostAndI,
  deptTree: costGlobal.deptTree,
  checkStandard: costGlobal.checkStandard,
  checkStandMsg: costGlobal.checkStandMsg,
  loading: loading.effects['global/addInvoice'] || loading.effects['global/addLoan'] ||
  loading.effects['global/invoiceEdit'] || loading.effects['global/addApply'] ||
  loading.effects['global/addSalary'] ||
  loading.effects['global/addPay'] || false,
  draftLoading: loading.effects['costGlobal/addDraft'] || false,
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
      inDetails: {},
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
      applyArr: [], // 申请单
      historyParams: {}, // 历史数据
      hisCostDetailsVo: [], // 历史分摊数据
      modifyNote: '',
      applyDetailList: [],  // 产品明细
      expandVos: [], // 审批流的自定义信息
      travelList: {}, // 行程的form表单以及数据
      aliTripFields: [],
      aliTripAuth: {}, // 判断是否有商旅权限
      hisAliTrip: {}, // 历史数据
      exceedVisible: false,
      submitParams: {},
      id: '',
      operateType: '', // 操作类型，add: 新增
      associatedIds: [],// 所有被关联项的集合
      showIdsObj: {}, // 是否显示的对象
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
// 改变showIdsObj
  
  changeShowIdsObj = (val) => {
    const { showIdsObj } = this.state;
    this.setState({showIdsObj:Object.assign(showIdsObj, val)});
    console.log(showIdsObj, '父级最新的showIdsObj');
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
        id
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
      console.log('🚀 ~ file: index.js ~ line 198 ~ addInvoice ~ Promise.all ~ create', create);
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
  getShowIdsObj=(selfField)=> {
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

  // console.log(this.state.details,'最新的details吗');
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
      let aliCostAndI = {costArr: [], invoiceArr: []};
      let deptTree = {};
      const { djDetail, dispatch } = this.props;
      console.log('AddInvoice -> onShowHandle -> djDetail666', djDetail);

      // const optionsRelevance = []; // 所有关联项
      // const optionsRelevanceIds = []; // 所有关联项的ids集合
      // djDetail.selfField.forEach(item => {
      //   optionsRelevance.push(...item.optionsRelevance);
      // });
      // optionsRelevance.forEach(item => {
      //   optionsRelevanceIds.push(...item.ids);
      // });
      // const associatedIds = [...new Set(optionsRelevanceIds)];
      // console.log(associatedIds, 'associatedIds');
      // this.setState({ associatedIds });

      const arrUrl = [{
        url: 'global/users',
        payload: {}
      }];
      const selfTravels = djDetail.selfField.filter(it => Number(it.fieldType) === 10);
      if (selfTravels && selfTravels.length && selfTravels[0].alitripSetting) {
        aliCostAndI = await this.fetchs({
          type: 'costGlobal/aliTripCostAndI',
          payload: {},
        }, 'aliCostAndI');
        deptTree = await this.fetchs({
          type: 'costGlobal/deptTree',
          payload: {},
        }, 'deptTree');
      }
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
        const selfTravel = djDetails.selfField.filter(it => Number(it.fieldType) === 10);
        this.setState({
          createDepList: dep,
          travelList: selfTravel && selfTravel.length ? selfTravel[0] : {},
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
        const aliTripArr = [...djDetails.selfField, ...djDetails.expandField];
        const aliTripAuth = aliTripArr.filter(it => it.fieldType === 10);
        if (aliCostAndI && aliTripAuth && aliTripAuth.length) {
          this.setState({
            aliTripFields: { aliCostAndI, deptTree, aliAuth: aliTripAuth[0] },
          });
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
          this.getShowIdsObj(djDetail.selfField);
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
            inDetails: djDetails,
            aliTripAuth: aliTripAuth && aliTripAuth.length ? aliTripAuth[0] : {},
          }, () => {
            if (costSelect) {
              costSelect = JSON.parse(costSelect);
              const { expenseList } = this.props;
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
                message.error(`${msg}支出类别被删除，请重新选择`);
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
          this.getShowIdsObj(contents.selfSubmitFieldVos);
          await this.setState({
            showField: obj,
            newshowField: djDetails.showField,
            accountList: account,
            inDetails: djDetails,
            historyParams: JsonParse(contentJson),
            hisAliTrip: contents.trip,
            aliTripAuth: aliTripAuth && aliTripAuth.length ? aliTripAuth[0] : {},
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
  onInit = async (detail, djDetails) => {
    // const { templateType } = detail;
    const expandField = [];
    const { userInfo } = this.props;
    const { operateType } = this.state;
    console.log('AddInvoice -> onInit -> detail', detail);
    let applyArr = detail.applicationIds && detail.applicationIds.length &&
      operateType !== 'modify' && operateType !== 'copy' ?
      this.onInitApply(detail.applicationIds) : [];
    if (operateType === 'modify') {
      applyArr = detail.applicationAssociageVOS || [];
    }
    let newDetail = {
      ...detail,
      receiptId: detail.receiptId ? detail.receiptId : '',
      processPersonId: djDetails.approveId,
      repaymentTime: detail.repaymentTime,
      startTime: detail.startTime,
      endTime: detail.endTime,
    };
    const userIds = detail.userId ? [detail.userId] : [];
    if (detail.costDetailsVo && (djDetails.templateType === 2 && djDetails.categoryStatus)) {
      detail.costDetailsVo.forEach(it => {
        if (it.costDetailShareVOS) {
          it.costDetailShareVOS.forEach(item => {
            if (item.userId) {
              userIds.push(item.userId);
            }
          });
        }
      });
    }
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
    if (Number(djDetails.templateType) === 0) {
      this.setState({
        total: detail.submitSum/100,
      });
      this.onInitBorrow(detail.invoiceLoanAssessVos || [], detail.costDetailsVo || []);
    } else if (Number(djDetails.templateType) === 2) {
      if (djDetails.categoryStatus) {
        this.onInitBorrow([], detail.costDetailsVo || []);
      }
      this.setState({
        total: detail.applicationSum/100
      });
      newDetail = {
        ...newDetail,
        total: detail.applicationSum/100,
        applicationSum: detail.applicationSum/100
      };
    } else if (Number(djDetails.templateType) === 1) {
      newDetail = {
        ...newDetail,
        total: detail.loanSum/100,
        loanSum: detail.loanSum/100
      };
      this.setState({
        total: detail.loanSum/100
      });
    } else if (Number(djDetails.templateType) === 3) {
      newDetail = {
        ...newDetail,
        total: detail.salaryAmount/100,
        loanSum: detail.salaryAmount/100
      };
      this.setState({
        total: detail.salaryAmount/100
      });
      this.onInitBorrow([], detail.costDetailsVo || []);
    }
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
      applyArr,
      applyDetailList: detail.detailList,
      expandVos,
    }, () => {
      this.getNode();
    });
  }

  onInitBorrow = (arrs, costDetails) => {
    console.log('AddInvoice -> onInitBorrow -> arrs', arrs);
    console.log('AddInvoice -> onInitBorrow -> arrs', costDetails);
    const { operateType } = this.state;
    const ids = arrs.map(it => it.loanId);
    const arr = operateType === 'modify' ? arrs : [];
    if (ids.length && operateType !== 'modify' && operateType !== 'copy') {
      this.props.dispatch({
        type: 'costGlobal/waitAssessIds',
        payload: {
          ids
        }
      }).then(() => {
        const { waitAssessIds } = this.props;
        arrs.forEach(it => {
          const index = waitAssessIds.findIndex(item => item.loanId === it.loanId);
          if (index > -1) {
            arr.push({
              ...waitAssessIds[index]
            });
          }
        });
        this.setState({
          borrowArr: arr,
        }, () => {
          this.onInitFolder(costDetails || []);
        });
      });
    } else {
      this.setState({
        borrowArr: arr,
      }, () => {
        this.onInitFolder(costDetails || []);
      });
    }
  }

  onInitFolder = (arrs) => {
    const ids = arrs.map(it => it.detailFolderId);
    const arr = [];
    const banArr = [];
    const { operateType } = this.state;
    const { expenseList } = this.props;
    let isShowMsg = false;
    const categoryIds = expenseList.map(it => it.id);
    this.props.dispatch({
      type: 'costGlobal/folderIds',
      payload: {
        ids
      }
    }).then(() => {
      const { folderIds } = this.props;
      const newArrs = this.InitFolderData(folderIds);
      arrs.forEach(it => {
        const index = newArrs.findIndex(item => item.id === it.detailFolderId);
        if (index > -1 && it.detailFolderId
          && !newArrs[index].isDelete4Category
          && categoryIds.includes(newArrs[index].categoryId)) {
          arr.push({
            ...newArrs[index],
            detailFolderId: it.detailFolderId,
            key: it.detailFolderId,
            costType: 1,
          });
        } else if ((!it.detailFolderId && categoryIds.includes(it.categoryId)) || (operateType === 'modify')){
          banArr.push({
            ...it
          });
        }
        if (!categoryIds.includes(it.categoryId)) {
          isShowMsg = true;
        }
      });
      if (isShowMsg && (operateType === 'copy')) {
        message.error('部分支出类别不可用，已自动删除');
      }
      console.log('🚀 ~ file: index.js ~ line 625 ~ addInvoice ~ newArr', arr);
      const newArr = this.onInitCategory(banArr);
      console.log('🚀 ~ file: index.js ~ line 625 ~ addInvoice ~ newArr', newArr);
      const newArrKey = defaultFunc.onInitKey([...arr, ...newArr]);
      console.log('🚀 ~ file: index.js ~ line 627 ~ addInvoice ~ newArrKey', newArrKey);
      // 初始化的数据存储后续比较
      this.setState({
        hisCostDetailsVo: newArrKey,
      });
      this.onAddCost(newArrKey);
    });
  }

  onInitCategory = (selectInvoice) => {
    const { currencyList } = this.props;
    const arr = [];
    const { userDeps } = this.props;
    selectInvoice.forEach((it, index) => {
      let currency = {};
      const costDetailShareVOS = [];
      if (it.currencyId && it.currencyId !== '-1') {
        // eslint-disable-next-line prefer-destructuring
        currency = currencyList.filter(its => its.id === it.currencyId)[0];
      }
      const obj = {
        ...it,
        key: `a_${index}`,
      };
      if (it.costDetailShareVOS) {
        it.costDetailShareVOS.forEach((item, i) => {
          const userJsons = item.userJson ? item.userJson.map(its => { return { ...its, userName: its.name }; }) : [];
          costDetailShareVOS.push({
            key: `b_${i}`,
            ...item,
            depList: item.userId ? userDeps[item.userId] : userDeps['-1'],
            users: userJsons,
          });
        });
      }
      arr.push({
        ...obj,
        costDetailShareVOS,
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
      const costDetailShareVOS = [];
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
      if (it.costDetailShareVOS) {
        it.costDetailShareVOS.forEach(item => {
          costDetailShareVOS.push({
            ...item,
          });
        });
      }
      arr.push({
        ...obj,
        costDetailShareVOS,
        currencyId: it.currencyId || '-1',
        currencyName: currency.name || '',
        exchangeRate: currency.exchangeRate || 1,
        currencySymbol: currency.currencySymbol || '¥',
      });
    });
    return arr;
  }

  onInitApply = (arrs) => {
    const ids = arrs;
    const arr = [];
    this.props.dispatch({
      type: 'costGlobal/applyIds',
      payload: {
        ids
      }
    }).then(() => {
      const { applyIds } = this.props;
      arrs.forEach(it => {
        const index = applyIds.findIndex(item => item.id === it);
        if (index > -1) {
          arr.push({
            ...applyIds[index]
          });
        }
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
      inDetails: {},
      users: [],
      costDetailsVo: [], // 分摊
      nodes: {},
      fileUrl: [], // 附件
      showField: {}, // 是否显示输入框
      total: 0,
      loanUserId: '', // 审批人的userId
      borrowArr: [],
      expandField: [],
      newshowField: [],
      assessSum: 0,
      applyArr: [], // 申请单
      modifyNote: '',
      historyParams: {}, // 历史数据
      hisCostDetailsVo: [], // 历史分摊数据
      applyDetailList: [],  // 产品明细
      expandVos: [],
      hisAliTrip: {},
      travelList: {}, // 行程的form表单以及数据
      aliTripFields: [],
      aliTripAuth: {}, // 判断是否有商旅权限
      exceedVisible: false,
      submitParams: {},
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
      if (it.costDetailShareVOS) {
        it.costDetailShareVOS.forEach(item => {
          loanEntities.push({
            loanUserId: item.loanUserId || item.dingUserId || '',
            loanDeptId: item.deptId,
            projectId: item.projectId,
          });
        });
      }
      categorySumEntities.push({
        categoryId: it.categoryId,
        costSum: ((it.costSum*1000) /10).toFixed(0),
      });
    });
    // const { loanUserId } = this.state;
    const { djDetail } = this.props;
    if (share && share.length && djDetail.templateType === 0) {
      const { standardArr } = await this.checkStandard(share);
      if (standardArr.length > 0) {
        share = standardArr;
      }
    }
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
      const { borrowArr, total } = this.state;
      this.onAddBorrow(borrowArr);
      if (Number(total) === 0 && (djDetail.categoryStatus && djDetail.templateType === 2)) {
        this.setState({
          total: (this.changeForm && this.changeForm.onGetSingleVal('applicationSum')) || 0,
        }, () => {
          this.getNode();
        });
      } else {
        this.getNode();
      }
    });
  }

  checkStandard = (costDetailsVo, flag) => {
    const { id } = this.props;
    const { users, details } = this.state;
    console.log('改单了吗');// getShowIdsObj
    if (details.selfSubmitFieldVos && details.selfSubmitFieldVos.length) {
      console.log('调用了吗');
      this.getShowIdsObj(details.selfSubmitFieldVos);
    };
    const newCostDetailsVo = flag ? costDetailsVo : defaultFunc.handleCost(costDetailsVo, id);
    return new Promise((resolve) => {
      this.props.dispatch({
        type: 'costGlobal/checkStandard',
        payload: {
          costDetailsVo: newCostDetailsVo,
          userId: details.userId,
          dingUserId: users && users.length ? users[0].userId : '',
          deptId: details.deptId,
        }
      }).then(() => {
        const { checkStandard, checkStandMsg} = this.props;
        let newArr = [];
        let error = '';
        if (!flag) {
          if (checkStandard && checkStandard.second) {
            newArr = defaultFunc.handleExceed(newCostDetailsVo, checkStandard);
          } else if (checkStandMsg) {
            newArr = newCostDetailsVo;
            error = true;
            message.error(checkStandMsg);
          }
        }
        if (flag) {
          resolve({
            checkStandMsg,
            checkStandard,
          });
        } else {
          resolve({
            standardArr: newArr,
            error,
          });
        }
      });
    });
  }

  selectPle = (val) => {
    return new Promise((resolve) => {
      this.props.dispatch({
        type: 'global/users',
        payload: {
          userJson: val,
        }
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

  // 选择申请单
  onAddApply = (val) => {
    this.setState({
      applyArr: val,
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
        loanEntities: details.loanEntities,
        categorySumEntities: details.categorySumEntities,
        creatorDeptId: details.createDeptId || '',
        loanUserId: loanUserId || '',
        loanDeptId: details.deptId || '',
        processPersonId: details.processPersonId || '',
        createDingUserId: details.createDingUserId || '',
        total: ((total * 1000)/10).toFixed(0),
        projectId: details.projectId || '',
        supplierId: details.supplierId || '',
        expandVos,
        officeId: details.officeId || ''
      };
    const { templateType } = this.state;
    if (Number(templateType) === 1) {
      Object.assign(objs, { borrowAmount: (payload && payload.borrowArr) || (total*1000)/10 });
    } else if (Number(templateType) === 2) {
      Object.assign(objs, { applicationSum: (payload && payload.applicationSum) || (total*1000)/10 });
    }
    if (operateType !== 'modify') {
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
      borrowArr,
      applyArr,
      id,
    } = this.state;
    const { djDetail, detailJson, detailType, userInfo } = this.props;
    let params = {
      ...details,
      invoiceTemplateId: id,
      userId: details.userId || '',
      submitSum: ((total * 1000)/10).toFixed(0),
      salaryAmount: ((total * 1000)/10).toFixed(0),
      showField: JSON.stringify(showField)
    };
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
      costDetailsVo: arr,
    };
    if (djDetail.isRelationLoan) {
      Object.assign(params, {
        invoiceLoanAssessVos: borrowArr.map(it => { return { loanId: it.loanId, sort: it.sort }; }) || []
      });
    }
    if (djDetail.isRelationApply) {
      Object.assign(params, {
        applicationIds: applyArr.map(it => it.id) || [],
      });
    }
    if ((showField.receiptId && !showField.receiptId.status) || !showField.receiptId) {
      Object.assign(params, {
        receiptId: '',
        receiptName: '',
        receiptNameJson: '',
      });
    }
    if (this.onCategoryStatus && this.onCategoryStatus.onSave) {
      if (this.onCategoryStatus.onSave() === false) {
        return;
      }
      Object.assign(params, {
        detailList: this.onCategoryStatus.onSave(),
        detailJson,
        detailType,
      });
    }
    if (this.handleOpenModal) {
      const aliTrips = await this.handleOpenModal();
      Object.assign(params, {
        trip: aliTrips,
      });
    }
    this.chargeHandle({...params, exceedReason: ''});
  }

  // 保存草稿
  handelOkDraft = async() => {
    const val = (this.changeForm && this.changeForm.onGetVal()) || {};
    console.log('AddInvoice -> handelOkDraft -> val', val);
    if (!val.reason) {
      message.error('请输入事由');
      return;
    }
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
      showField,
      borrowArr,
      applyArr,
      draftId,
      id,
      templateType
    } = this.state;
    const { djDetail, detailJson,
      detailType, } = this.props;
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
        if (it.status) {
          expandSubmitFieldVos.push(obj);
        } else if (it.status && it.field.indexOf('self_') > -1){
          selfSubmitFieldVos.push(obj);
        }
      });
    }
    let params = {
      ...details,
      invoiceTemplateId: djDetail.id,
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
      submitSum: ((total * 1000)/10).toFixed(0),
      expandSubmitFieldVos,
      selfSubmitFieldVos
    };
    const arr = defaultFunc.handleCost(costDetailsVo, id);
    params = {
      ...params,
      costDetailsVo: arr,
    };
    if(Number(templateType) === 1) {
      Object.assign(params, {
        loanSum: (val.loanSum*1000)/10,
        repaymentTime: val.repaymentTime ? moment(val.repaymentTime).format('x') : '',
      });
    } else if (Number(templateType) === 2) {
      Object.assign(params, {
        applicationSum: (val.applicationSum*1000)/10,
      });
      if (
        showField.happenTime &&
        (showField.happenTime.dateType === '2' ||
        showField.happenTime.dateType === 2)
      ) {
        Object.assign(params, {
          startTime: val.time ? moment(val.time[0]).format('x') : '',
          endTime: val.time ? moment(val.time[1]).format('x') : ''
        });
      } else if (
        showField.happenTime &&
        (showField.happenTime.dateType === '1' ||
          showField.happenTime.dateType === 1)
      ) {
        Object.assign(params, {
          startTime: val.time ? moment(val.time).format('x') : ''
        });
      }
    }
    if (borrowArr) {
      Object.assign(params, {
        invoiceLoanAssessVos: borrowArr.map(it => { return { loanId: it.loanId, sort: it.sort }; })
      });
    }
    if (applyArr) {
      Object.assign(params, {
        applicationIds: applyArr.map(it => it.id),
      });
    }
    if (this.onCategoryStatus && this.onCategoryStatus.onSave) {
      if (this.onCategoryStatus.onSave() === false) {
        return;
      }
      Object.assign(params, {
        detailList: this.onCategoryStatus.onSave(),
        detailJson,
        detailType,
      });
    }
    if (this.handleOpenModal) {
      const aliTrips = await this.handleOpenModal();
      console.log('AddInvoice -> handleOk -> aliTrips', aliTrips);
      Object.assign(params, {
        trip: aliTrips,
      });
    }
    const url = draftId ? 'costGlobal/editDraft' : 'costGlobal/addDraft';
    this.props.dispatch({
      type: url,
      payload: {
        contentJson: JSON.stringify(params),
        costSum: ((total * 1000)/10).toFixed(0),
        templateType,
        reason: val.reason,
        invoiceName: djDetail.name,
        invoiceTemplateId: djDetail.id,
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

  // 提交
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
        type: templateType ? invoiceJson[templateType].addUrl : 'global/addInvoice',
        payload : {
          ...params,
          templateType,
          draftId: draftId || ''
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

  checkExceed = async(params) => {
    const { checkStandard, checkStandMsg } = await this.checkStandard(params.costDetailsVo, true);
    if (checkStandard && (checkStandard.first || checkStandard.first === 0)) {
      const { applyArr } = this.state;
      const { first, caNames, caName4Application } = checkStandard;
      if (first === 0 || (first === 10 && applyArr.length)) {
        this.setState({
          exceedVisible: true,
          submitParams: params,
        });
      } else if ((first === 1 && !applyArr.length)
      || (first === 10 && !applyArr.length)) {
        message.error(`${caName4Application.join('、')}超标需关联申请单`);
      } else if (first === 2) {
        message.error(`${caNames.join('、')}超标，无法提交报销`);
      } else {
        this.onSubmit(params);
      }
    } else {
      message.error(checkStandMsg);
    }

  }

  handleExceed = (val) => {
    const { submitParams } = this.state;
    this.onSubmit({...submitParams, ...val});
    this.setState({
      submitParams: {},
      exceedVisible: false,
    });
  }

  exceedCancel = () => {
    this.setState({
      exceedVisible: false,
    });
  }

  chargeHandle = (params) => {
    const { borrowArr, operateType, templateType } = this.state;
    const { waitLists } = this.props;
    if (templateType && Number(templateType)) {
      this.onSubmit(params);
    } else if (borrowArr.length === 0 && (waitLists.length > 0) && operateType !== 'modify') {
      confirm({
        title: '还有借款未核销，确认提交吗？',
        okText: '确定提交',
        cancelText: '继续核销',
        onOk: () => {
          this.checkExceed(params);
          // this.onSubmit(params);
        },
        onCancel: () => {
          console.log('Cancel');
        },
      });
    } else if (!Number(templateType)) {
      this.checkExceed(params);
    } else {
      this.onSubmit(params);
    }
  }

  onChangeData = (val) => {
    this.setState({
      costDetailsVo: val,
    }, () => {
      this.onAddCost(val, 0, true);
    });
  }

  // 子组件改变父组件的state
  changeSetData = (val, flag) => {
  console.log('🚀 ~ file: index.js ~ line 1344 ~ addInvoice ~ val', val);
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

  changeApply = (val, keys) => {
    this.onAddApply(val, keys);
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

  onChangeOffice = (val, callback) => {
    const { details, costDetailsVo, applyArr, borrowArr } = this.state;
    const { djDetail } = this.props;
    const arr = [];
    let newArr = [];
    if (costDetailsVo.length) {
      newArr = costDetailsVo.filter(it => it.costDetailShareVOS && it.costDetailShareVOS.length === 0 && !it.detailFolderId);
    };
    if (newArr.length !== costDetailsVo.length) {
      arr.push('支出明细');
    }
    if (applyArr.length) arr.push('关联申请单');
    if (borrowArr.length) arr.push('借款核销');
    if(arr.length && (djDetail.templateType !== 2)) {
      confirm({
        title: `切换所在公司将会清空${arr.join(',')}`,
        onOk: () => {
          this.setState({
            details: { ...details, officeId: val },
            costDetailsVo: newArr,
            applyArr: [],
            borrowArr: []
          }, () => {
            this.getNode({});
          });
        },
        onCancel: () => {
          if (callback) callback();
        }
      });
    } else {
      this.setState({
        details: { ...details, officeId: val }
      }, () => {
        this.getNode({});
      });
    }
  }

  checkOffice = (payload) => {
    const { djDetail } = this.props;
    return new Promise(resolve => {
      this.props.dispatch({
        type: 'costGlobal/officeList',
        payload,
      }).then(() => {
        const { officeList } = this.props;
        const { details, costDetailsVo, applyArr, borrowArr } = this.state;
        if (officeList.findIndex(it => it.id === details.officeId) === -1 && (djDetail.templateType !== 2)) {
          const arr = [];
          let newArr = [];
          if (costDetailsVo.length) {
            newArr = costDetailsVo.filter(it => it.costDetailShareVOS && it.costDetailShareVOS.length === 0 && !it.detailFolderId);
          };
          if (newArr.length !== costDetailsVo.length) {
            arr.push('支出明细');
          }
          if (applyArr.length) arr.push('关联申请单');
          if (borrowArr.length) arr.push('借款核销');
          if(arr.length) {
            confirm({
              title: `切换所在公司将会清空${arr.join(',')}`,
              onOk: () => {
                this.setState({
                  costDetailsVo: newArr,
                  applyArr: [],
                  borrowArr: []
                });
                resolve(true);
              },
              onCancel: () => {
                resolve(false);
              }
            });
          } else {
            resolve(true);
          }
        } else {
          resolve(true);
        }
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
      detailJson,
      usableProject,
      officeList, // 所在公司列表,
      aliCostAndI,
      checkStandard,
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
      inDetails,
      users,
      costDetailsVo,
      nodes,
      fileUrl,
      showField,
      expandField,
      borrowArr,
      assessSum,
      applyArr,
      newshowField,
      modifyNote,
      operateType,
      applyDetailList,
      expandVos,
      travelList,
      aliTripFields,
      aliTripAuth,
      hisAliTrip,
      exceedVisible,
      id,
      associatedIds,
      showIdsObj
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
            <Lines name="基本信息" />
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
            {
                (!templateType ||
                templateType === 3 ||
                (templateType === 2 && !!djDetail.categoryStatus)) &&
                <>
                  <div style={{paddingTop: '24px', paddingBottom: '30px',
                    width: this.state.costDetailsVo.length ? '100%' : '936px'}}
                  >
                    <Lines name={`支出明细${costDetailsVo && costDetailsVo.length > 0 ? `（合计¥${total}）` : ''}`} />
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
                        !modify && !Number(templateType) &&
                        <AddFolder
                          userInfo={userInfo}
                          invoiceId={id}
                          onAddCost={this.onAddCost}
                          key="export"
                          list={costDetailsVo}
                          invoiceName={inDetails.name}
                          officeId={details.officeId}
                          isShowToast={officeList.length}
                        >
                          <Button
                            icon={costDetailsVo && costDetailsVo.length > 0 ? 'none' : 'plus'}
                            className={style.costExport}
                            key="export"
                          >账本导入
                          </Button>
                        </AddFolder>
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
                </>
              }
            {
              (detailJson && detailJson.length > 0) && templateType === 2 &&
              <CategoryTable
                list={detailJson}
                onRef={ref => {this.onCategoryStatus = ref;}}
                detailList={applyDetailList}
              />
            }
            {
              templateType === 2 && aliTripAuth.status &&
              <AddTravel
                travelList={travelList}
                aliTripFields={aliTripFields}
                aliCostAndI={aliCostAndI}
                aliTripAuth={aliTripAuth}
                hisAliTrip={hisAliTrip || {}}
                userInfo={userInfo}
                onGetFunc={func => {
                  this.handleOpenModal = func;
                }}
                onResetFun={func => {
                  this.handleCancel = func;
                }}
              />
            }
            {
              djDetail.isRelationLoan && (!modify || (modify && this.state.borrowArr && borrowArr.length > 0 )) &&
              <>
                <div style={{paddingTop: '24px', paddingBottom: '30px',
                  width: this.state.borrowArr.length ? '100%' : '936px'}}
                >
                  <Lines name="借款核销" />
                  <div style={{textAlign: 'center'}} className={style.addbtn}>
                    {
                      !modify &&
                      <AddBorrow
                        userInfo={userInfo}
                        invoiceId={id}
                        onAddBorrow={arr => this.onAddBorrow(arr)}
                        list={borrowArr}
                        officeId={details.officeId}
                      >
                        <Button icon="plus" style={{ width: '231px' }}>选择借款</Button>
                      </AddBorrow>
                    }
                    {
                      this.state.borrowArr && this.state.borrowArr.length > 0 &&
                      <BorrowTable
                        list={borrowArr}
                        userInfo={userInfo}
                        invoiceId={id}
                        onChangeData={(val,keys) => this.changeBorrows(val,keys)}
                        modify={modify}
                      />
                    }
                  </div>
                </div>
              </>
            }
            {
              djDetail.isRelationApply && (!modify || (modify && this.state.applyArr && applyArr.length > 0 )) ?
                <>
                  <div style={{paddingTop: '24px', paddingBottom: '30px',
                    width: this.state.applyArr.length ? '100%' : '936px'}}
                  >
                    <Lines name="关联申请单" />
                    <div style={{textAlign: 'center'}} className={style.addbtn}>
                      {
                        !modify &&
                        <AddApply
                          userInfo={userInfo}
                          invoiceId={id}
                          onAddBorrow={arr => this.onAddApply(arr)}
                          list={applyArr}
                          costList={costDetailsVo}
                          onAddCost={this.onAddCost}
                          officeId={details.officeId}
                        >
                          <Button icon="plus" style={{ width: '231px' }}>选择申请单</Button>
                        </AddApply>
                      }
                      {
                        this.state.applyArr && applyArr.length > 0 &&
                        <ApplyTable
                          list={applyArr}
                          userInfo={userInfo}
                          invoiceId={id}
                          modify={modify}
                          onChangeData={(val,keys) => this.changeApply(val,keys)}
                        />
                      }
                    </div>
                  </div>
                </>
                :
                null
            }
            {
              !modify &&
              <div style={{paddingTop: '24px', paddingBottom: '30px'}}>
                <Lines name="审批流程" />
                <ApproveNode
                  approveNodes={nodes}
                  onChangeForm={(val) => this.onChangeNode(val)}
                />
              </div>
            }
            {
              modify &&
              <div style={{paddingTop: '24px', paddingBottom: '100px'}}>
                <div className={style.header} style={{padding: 0, marginBottom: '16px'}}>
                  <div className={style.line} />
                  <p className="isRequired">改单理由</p>
                </div>
                <TextArea
                  placeholder="请输入改单理由(必填)"
                  style={{height: '128px'}}
                  value={modifyNote}
                  onInput={(e) => { this.setState({ modifyNote: e.target.value }); }}
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
        <StandardModal
          visible={exceedVisible}
          callback={this.handleExceed}
          onCancel={this.exceedCancel}
          note={checkStandard && checkStandard.third ? checkStandard.third : ''}
        />
      </div>
    );
  }
}

export default addInvoice;
