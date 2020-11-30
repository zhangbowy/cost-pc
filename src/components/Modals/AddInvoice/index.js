/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Divider, Button, Icon, Select, message, TreeSelect, InputNumber, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import cs from 'classnames';
import fileIcon from '@/utils/fileIcon.js';
import TextArea from 'antd/lib/input/TextArea';
import style from './index.scss';
import AddCost from './AddCost';
import UploadImg from '../../UploadImg';
import SelectPeople from '../SelectPeople';
import { fileUpload } from '../../../utils/ddApi';
import CostTable from './CostTable';
import BorrowTable from './BorrowTable';
import AddBorrow from './AddBorrow';
import ApproveNode from '../ApproveNode';
import ReceiptModal from '../ReceiptModal';
import { numAdd, numSub, numMulti } from '../../../utils/float';
import AddApply from './AddApply';
import { invoiceJson } from '../../../utils/constants';
import { JsonParse, compare } from '../../../utils/common';
import ApplyTable from './ApplyTable';
import AddFolder from './AddFolder';

const {Option} = Select;
const { RangePicker } = DatePicker;
const { TreeNode } = TreeSelect;
const labelInfo = {
  reason: '事由',
  userId: '报销人',
  deptId: '报销部门',
  note: '单据备注',
  receiptId: '收款账户',
  createDeptId: '所在部门',
  imgUrl: '图片',
  fileUrl: '附件',
  project: '项目',
  supplier: '供应商'
};
const { confirm } = Modal;
@connect(({ session, global, loading, workbench, costGlobal }) => ({
  userInfo: session.userInfo,
  deptInfo: global.deptInfo,
  receiptAcc: global.receiptAcc,
  djDetail: global.djDetail,
  uploadSpace: global.uploadSpace,
  nodes: global.nodes,
  userId: global.userId,
  usableSupplier: global.usableSupplier,
  usableProject: global.usableProject,
  waitLists: workbench.waitLists,
  applyIds: costGlobal.applyIds,
  waitAssessIds: costGlobal.waitAssessIds,
  folderIds: costGlobal.folderIds,
  expenseList: global.expenseList,
  currencyList: global.currencyList,
  userDeps: costGlobal.userDeps,
  loading: loading.effects['global/addInvoice'] || loading.effects['global/addLoan'] || false,
  draftLoading: loading.effects['costGlobal/addDraft'] || false,
}))
@Form.create()
class AddInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      imgUrl: [],
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
    };
  }

  componentDidUpdate(prevProps){
    if(prevProps.visible !==  this.props.visible) {
      if (this.props.visible) {
        this.onShowHandle();
      } else {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          visible: this.props.visible
        });
      }
    }
  }

  onShowHandle = async() => {
    let detail = this.state.details;
    const { id, userInfo, templateType, contentJson, isTemplateDel, isTemplateUsed } = this.props;
    const _this = this;
    if (isTemplateDel) {
      message.error('管理员已删除该单据模板，草稿无效请删除');
      return;
    }
    if (isTemplateUsed === false) {
      message.error('该单据模板不可用，草稿无效请删除');
      return;
    }
    this.props.dispatch({
      type: 'global/getCurrency',
      payload: {},
    });
    if (!Number(templateType)) {
      this.props.dispatch({
        type: 'workbench/waitLists',
        payload: {
          pageNo: 1,
          pageSize: 200,
        }
      });
    }
    const userJson = [{
      userName: userInfo.name,
      userId: userInfo.dingUserId,
      avatar: userInfo.avatar,
      name: userInfo.name,
    }];
    await this.props.dispatch({
      type: 'global/users',
      payload: {
        userJson: JSON.stringify(userJson),
      }
    });
    await this.props.dispatch({
      type: 'global/getApplyList',
      payload: {}
    });
    const create = await _this.props.deptInfo;
    await this.setState({
      depList: create,
      users: userJson,
      loanUserId: userInfo.dingUserId,
    });
    if (create && create.length > 0) {
      this.props.form.setFieldsValue({
        deptId: `${create[0].deptId}`,
      });
      detail = await {
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
    await this.props.dispatch({
      type: 'global/users',
      payload: {}
    });
    const dep = await _this.props.deptInfo;
    if (dep && dep.length > 0) {
      detail = {
        ...detail,
        createDeptId: `${dep[0].deptId}`,
        createDepName: dep[0].name,
      };
    }
    this.setState({
      createDepList: dep
    });
    await this.props.dispatch({
      type: 'global/djDetail',
      payload: {
        id,
        type: 1,
        templateType,
      }
    });
    await this.props.dispatch({
      type: 'global/expenseList',
      payload: {
        id
      }
    });
    await this.props.dispatch({
      type: 'global/receiptAcc',
      payload: {
        pageNo: 1,
        pageSize: 100,
      }
    });
    await this.props.dispatch({
      type: 'global/usableSupplier',
      payload: {},
    });
    await this.props.dispatch({
      type: 'global/usableProject',
      payload: {
        type: 1,
      },
    });

    const djDetails = await this.props.djDetail;
    const obj = {};
    if (djDetails.showField && djDetails.showField.length) {
      djDetails.showField.forEach(item => {
        obj[item.field] = {...item};
      });
    }
    const account = await _this.props.receiptAcc;
    const arr = account.filter(it => it.isDefault);

    if (arr && arr.length > 0 && (Number(templateType) !== 2)) {
      detail = {
        ...detail,
        receiptId: arr[0].id,
        receiptName: arr[0].name,
        receiptNameJson: JSON.stringify(arr),
      };
    }
    const params = {
      creatorDeptId: detail.createDeptId || '',
      processPersonId: djDetails.approveId,
      loanUserId: detail.loanUserId,
      loanDeptId: detail.loanDeptId,
      createDingUserId: detail.createDingUserId,
    };
    if (!contentJson) {
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
        visible: true
      }, () => {
        if (this.props.costSelect) {
          // if (this.props.onFolder) {
          //   this.props.onFolder();
          // }
          const { costSelect, expenseList } = this.props;
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
            message.error(`${msg}费用类别被删除，请重新选择`);
          }
          this.onAddCost(arrs);
        }
      });
      if (!this.props.costSelect) {
        this.getNode(params);
      }
    } else {
      const contents = JsonParse(contentJson);
      this.onInit(contents, djDetails);
      await this.setState({
        showField: obj,
        newshowField: djDetails.showField,
        accountList: account,
        inDetails: djDetails,
        visible: true
      });
    }

  }

  // 编辑初始化数据
  onInit = async(detail, djDetails) => {
    // const { templateType } = detail;
    const expandField = [];
    console.log('AddInvoice -> onInit -> detail', detail);
    const applyArr = detail.applicationIds && detail.applicationIds.length ? this.onInitApply(detail.applicationIds) : [];
    console.log('AddInvoice -> onInit -> applyArr', applyArr);
    let newDetail = {
      ...detail,
      receiptId: detail.receiptId ? detail.receiptId : '',
      processPersonId: djDetails.approveId,
      repaymentTime: detail.repaymentTime,
      startTime: detail.startTime,
      endTime: detail.endTime,
    };
    const userIds = detail.userId ? [detail.userId] : [];
    if (detail.costDetailsVo) {
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
      console.log('AddInvoice -> onInit -> newExpand', newExpand);

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
    });
    await this.props.dispatch({
      type: 'costGlobal/userDep',
      payload: {
        userIds: [...new Set(userIds)],
      }
    });
    let params = {};
    if (Number(djDetails.templateType) === 0) {
      this.setState({
        total: detail.submitSum/100,
      });
      this.onInitBorrow(detail.invoiceLoanAssessVos || [], detail.costDetailsVo || []);
    } else if (Number(djDetails.templateType) === 2) {
      this.setState({
        total: detail.applicationSum/100
      });
      newDetail = {
        ...newDetail,
        total: detail.applicationSum/100,
        applicationSum: detail.applicationSum/100
      };
      params = {
        loanEntities: detail.loanEntities || [],
        categorySumEntities: detail.categorySumEntities || [],
        creatorDeptId: detail.createDeptId,
        loanUserId: detail.userJson ? detail.userJson[0].userId : '',
        loanDeptId: detail.deptId,
        processPersonId: djDetails.approveId,
        applicationSum: detail.applicationSum,
        projectId: detail.projectId || '',
        supplierId: detail.supplierId || '',
      };
      this.getNode(params);
    } else if (Number(djDetails.templateType) === 1) {
      params = {
        loanEntities: detail.loanEntities || [],
        categorySumEntities: detail.categorySumEntities || [],
        creatorDeptId: detail.createDeptId,
        loanUserId: detail.userJson ? detail.userJson[0].userId : '',
        loanDeptId: detail.deptId,
        processPersonId: djDetails.approveId,
        borrowArr: detail.loanSum,
        projectId: detail.projectId || '',
        supplierId: detail.supplierId || ''
      };
      newDetail = {
        ...newDetail,
        total: detail.loanSum/100,
        loanSum: detail.loanSum/100
      };
      this.getNode(params);
      this.setState({
        total: detail.loanSum/100
      });
    }
    await this.setState({
      depList: detail.userId ? this.props.userDeps[detail.userId] : this.props.userDeps['-1'], // 所在部门
      details: {
        ...newDetail,
        loanEntities: detail.loanEntities || [],
        categorySumEntities: detail.categorySumEntities || [],
        creatorDeptId: detail.createDeptId,
        loanUserId: detail.userJson ? detail.userJson[0].userId : [],
        loanDeptId: detail.deptId,
        processPersonId: djDetails.approveId,
        projectId: detail.projectId || '',
        supplierId: detail.supplierId || '',
        supplier: detail.supplierAccountId ? `${detail.supplierAccountId}_${detail.supplierId}` : ''
      }, // 详情
      users: detail.userJson,
      loanUserId: detail.loanUserId, // 审批人的userId
      expandField, // 扩展字段
      assessSum: detail.assessSum || 0, // 核销金额
      applyArr,
    });
    console.log('AddInvoice -> onInit -> detail.imgUrl', detail.imgUrl);
  }

  onInitBorrow = (arrs, costDetails) => {
    console.log('AddInvoice -> onInitBorrow -> arrs', arrs);
    const ids = arrs.map(it => it.loanId);
    const arr = [];
    if (ids.length) {
      this.props.dispatch({
        type: 'costGlobal/waitAssessIds',
        payload: {
          ids
        }
      }).then(() => {
        const { waitAssessIds } = this.props;
        console.log('AddInvoice -> onInitBorrow -> waitAssessIds', waitAssessIds);
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
    console.log('AddInvoice -> onInitFolder -> arrs', arrs);
    const ids = arrs.map(it => it.detailFolderId);
    const arr = [];
    const banArr = [];
    const { expenseList } = this.props;
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
        } else if (!it.detailFolderId && categoryIds.includes(it.categoryId)){
          banArr.push({
            ...it
          });
        }
      });
      const newArr = this.onInitCategory(banArr);
      this.onAddCost([...arr, ...newArr]);
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
        costSum: currency.id ? it.costSum/100 : it.costSum/100,
        shareTotal: it.costDetailShareVOS.length ? it.costSum/100 : 0,
      };
      if (it.costDetailShareVOS) {
        it.costDetailShareVOS.forEach((item, i) => {
          const userJsons = item.userJson ? item.userJson.map(its => { return { ...its, userName: its.name }; }) : [];
          costDetailShareVOS.push({
            key: `b_${i}`,
            ...item,
            shareScale: item.shareScale ? item.shareScale/100 : 0,
            shareAmount: currency.id ? item.shareAmount/100 : item.shareAmount/100,
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
        costSum: currency.id ? it.currencySum/100 : it.costSum/100,
        detailFolderId: it.id,
      };
      if (it.costDetailShareVOS) {
        it.costDetailShareVOS.forEach(item => {
          costDetailShareVOS.push({
            ...item,
            shareScale: item.shareScale ? item.shareScale/100 : 0,
            shareAmount: currency.id ? item.currencySum/100 : item.shareAmount/100,
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
    this.props.form.resetFields();
    if (this.props.onChangeVisible) {
      this.props.onChangeVisible();
    }
    console.log('调用');
    this.setState({
      visible: false,
      imgUrl: [],
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
    });
  }

  selectPle = (val) => {
    let detail = this.state.details;
    const { total } = this.state;
    let params = {};
    if (val.users && val.users.length > 0) {
      this.props.dispatch({
        type: 'global/users',
        payload: {
          userJson: JSON.stringify(val.users),
        }
      }).then(() => {
        const { deptInfo } = this.props;
        this.setState({
          users: val.users,
          depList: deptInfo,
        });
        if (deptInfo.length === 1) {
          this.props.form.setFieldsValue({
            deptId: `${deptInfo[0].deptId}`,
          });
          detail = {
            ...detail,
            userId: this.props.userId,
            deptId: deptInfo[0].deptId,
          };
          params = {
            loanEntities: detail.loanEntities || [],
            categorySumEntities: detail.categorySumEntities || [],
            creatorDeptId: detail.createDeptId,
            loanUserId: val.users[0].userId,
            loanDeptId: deptInfo[0].deptId,
            processPersonId: detail.processPersonId,
            createDingUserId: detail.createDingUserId,
            total: (total * 1000)/10,
            projectId: detail.projectId || '',
            supplierId: detail.supplierId || ''
          };
        } else {
          this.props.form.setFieldsValue({
            deptId: '',
          });
          detail = {
            ...detail,
            userId: this.props.userId,
          };
          params = {
            loanEntities: detail.loanEntities || [],
            categorySumEntities: detail.categorySumEntities || [],
            creatorDeptId: detail.createDeptId,
            loanUserId: val.users[0].userId,
            processPersonId: detail.processPersonId,
            createDingUserId: detail.createDingUserId,
            total: (total * 1000)/10,
            projectId: detail.projectId || '',
            supplierId: detail.supplierId || ''
          };
        }
        this.getNode(params);
        this.setState({
          users: val.users,
          details: {
            ...detail,
            userName: val.users[0].userName,
            loanUserId: val.users[0].userId,
          },
          loanUserId: val.users[0].userId,
        });
      });
    }
  }

  onChangeAcc = (val) => {
    let detail = this.state.details;
    const { accountList } = this.state;
    accountList.forEach(item => {
      if (item.id === val) {
        const arr = [item];
        detail = {
          ...detail,
          receiptId: val,
          receiptName: item.name,
          receiptNameJson: JSON.stringify(arr),
        };
      }
    });
    this.props.form.setFieldsValue({
      receiptId: val,
    });
    this.setState({
      details: detail,
    });
  }

  //  添加费用成功
  onAddCost = (val, index, flag) => {
    let  share = this.state.costDetailsVo;
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
    console.log('AddInvoice -> onAddCost -> share', share);
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
    const { loanUserId } = this.state;
    this.getNode({
      loanEntities,
      categorySumEntities,
      creatorDeptId: detail.createDeptId || '',
      loanUserId: loanUserId || '',
      loanDeptId: detail.deptId || '',
      processPersonId: detail.processPersonId,
      createDingUserId: detail.createDingUserId,
      total: ((mo * 1000)/10).toFixed(0),
      projectId: detail.projectId || '',
      supplierId: detail.supplierId || ''
    });
    this.setState({
      costDetailsVo: share,
      total: mo.toFixed(2),
      details: {
        ...detail,
        loanEntities,
        categorySumEntities,
      }
    }, () => {
      const { borrowArr } = this.state;
      this.onAddBorrow(borrowArr);
    });
  }

  //  选择借款
  onAddBorrow = (val) => {
    console.log('AddInvoice -> onAddBorrow -> val', val);
    const detailList = [...val];
    let money = Number(this.state.total);
    let assessSum = 0;
    if (money || (money === 0)) {
      detailList.forEach(it => {
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
      borrowArr: detailList,
      assessSum: Number(assessSum.toFixed(2)),
    });
  }

  // 选择申请单
  onAddApply = (val) => {
    this.setState({
      applyArr: val,
    });
  }

  // 上传附件
  uploadFiles = () => {
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
      });
    });
  }

  //  预览附件
  previewFiless = () => {
    message.error('钉钉暂时不支持未提交单据附件的预览，请提交后预览/下载');
    // this.props.dispatch({
    //   type: 'global/grantDownload',
    //   payload: {
    //     fileIds: options.fileId
    //   }
    // }).then(() => {
    //   previewFile(options);
    // });
  }

  getNode = (payload) => {
    const { id } = this.props;
    Object.assign(payload, {
      deepQueryFlag: true,
      invoiceTemplateId: id,
    });
    const { templateType } = this.props;
    const { total } = this.state;
    if (Number(templateType) === 1) {
      Object.assign(payload, { borrowAmount: payload.borrowArr || (total*1000)/10 });
    } else if (Number(templateType) === 2) {
      Object.assign(payload, { applicationSum: payload.applicationSum || (total*1000)/10 });
    }
    this.props.dispatch({
      type: 'global/approveList',
      payload,
    }).then(() => {
      const { nodes } = this.props;
      this.setState({
        nodes,
      });
    });
  }

  onChangeNode = (val) => {
    this.setState({
      nodes: val
    });
  }

  onDelFile = (index, e) => {
    e.stopPropagation();
    const files = this.state.fileUrl;
    files.splice(index, 1);
    this.setState({
      fileUrl: files,
    });
  }

  onChangeImg = (val) => {
    console.log('调用2');
    this.setState({
      imgUrl: val,
    });
  }

  handleOk = () => {
    const {
      imgUrl,
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
      applyArr
    } = this.state;
    const { id, templateType, djDetail } = this.props;
    this.props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        const dep = depList.filter(it => `${it.deptId}` === `${val.deptId}`);
        const dept = createDepList.filter(it => `${it.deptId}` === `${val.createDeptId}`);
        const expandSubmitFieldVos = [];
        const selfSubmitFieldVos = [];
        if (expandField && expandField.length > 0) {
          expandField.forEach(it => {
            const obj = {
              ...it,
              msg: Number(it.fieldType) === 5 && val[it.field] ? JSON.stringify(val[it.field]) : val[it.field],
            };
            if (Number(it.fieldType) === 5 && val[it.field]) {
              Object.assign(obj, {
                startTime: Number(it.dateType) === 2 ? moment(val[it.field][0]).format('x') : moment(val[it.field]).format('x'),
                endTime: Number(it.dateType) === 2 ? moment(val[it.field][1]).format('x') : '',
              });
            }
            if (it.status && it.field.indexOf('expand_') > -1) {
              expandSubmitFieldVos.push(obj);
            } else if (it.status && it.field.indexOf('self_') > -1){
              selfSubmitFieldVos.push(obj);
            }
          });
        }
        let params = {
          ...details,
          invoiceTemplateId: id,
          reason: val.reason,
          note: val.note || '',
          userId: details.userId || '',
          deptId: val.deptId,
          deptName: dep && dep.length > 0 ? dep[0].name : '',
          userJson: users,
          createDeptId: val.createDeptId,
          createDeptName: dept && dept.length > 0 ? dept[0].name : '',
          nodeConfigInfo: nodes,
          projectId: val.projectId || '',
          supplierAccountId: val.supplier ? val.supplier.split('_')[0] : '',
          supplierId: val.supplier ? val.supplier.split('_')[1] : '',
          imgUrl,
          fileUrl,
          submitSum: ((total * 1000)/10).toFixed(0),
          expandSubmitFieldVos,
          selfSubmitFieldVos
        };
        const arr = [];
        costDetailsVo.forEach((item, index) => {
          arr.push({
            'categoryId': item.categoryId,
            'icon': item.icon,
            'categoryName': item.categoryName,
            'costSum': (((item.costSum) * 1000)/10).toFixed(0),
            'note': item.note,
            'costDate':item.costDate,
            'startTime':item.startTime || '',
            'endTime':item.endTime || '',
            'imgUrl':item.imgUrl,
            'invoiceBaseId':id,
            costDetailShareVOS: [],
            currencyId: item.currencyId,
            currencyName: item.currencyName,
            expandCostDetailFieldVos: item.expandCostDetailFieldVos,
            selfCostDetailFieldVos: item.selfCostDetailFieldVos,
            detailFolderId: item.detailFolderId || '',
          });
          if (item.costDetailShareVOS) {
            item.costDetailShareVOS.forEach(it => {
              arr[index].costDetailShareVOS.push({
                'shareAmount': (it.shareAmount * 1000)/10,
                'shareScale': (it.shareScale * 1000)/10,
                'deptId': it.deptId,
                'userId': it.userId,
                'userJson':it.users,
                deptName: it.deptName,
                userName: it.userName,
                projectId: it.projectId,
              });
            });
          }
        });
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
            repaymentTime: val.repaymentTime ? moment(val.repaymentTime).format('x') : '',
          });
          if (showField.happenTime.dateType === '2' || showField.happenTime.dateType === 2) {
            Object.assign(params, {
              startTime: val.time ? moment(val.time[0]).format('x') : '',
              endTime: val.time ? moment(val.time[1]).format('x') : ''
            });
          } else if (showField.happenTime.dateType === '1' || showField.happenTime.dateType === 1) {
            Object.assign(params, {
              startTime: val.time ? moment(val.time).format('x') : ''
            });
          }
        }
        if (djDetail.isRelationLoan) {
          // if (showField.loan.isWrite && (borrowArr.length === 0)) {
          //   message.error('请选择借款核销');
          //   return;
          // }
          Object.assign(params, {
            invoiceLoanAssessVos: borrowArr.map(it => { return { loanId: it.loanId, sort: it.sort }; }) || []
          });
        }
        if (djDetail.isRelationApply) {
          // if (showField.apply.isWrite && (applyArr.length === 0)) {
          //   message.error('请选择关联申请单');
          //   return;
          // }
          Object.assign(params, {
            applicationIds: applyArr.map(it => it.id) || [],
          });
        }
        this.chargeHandle(params);
      }
    });
  }

  // 保存草稿
  handelOkDraft = () => {
    const val = this.props.form.getFieldsValue();
    if (!val.reason) {
      message.error('请输入事由');
      return;
    }
    const {
      imgUrl,
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
      applyArr
    } = this.state;
    const { id, templateType, draftId, djDetail } = this.props;
    const dep = depList.filter(it => `${it.deptId}` === `${val.deptId}`);
    const dept = createDepList.filter(it => `${it.deptId}` === `${val.createDeptId}`);
    const expandSubmitFieldVos = [];
    const selfSubmitFieldVos = [];
    if (expandField && expandField.length > 0) {
      expandField.forEach(it => {
        const obj = {
          ...it,
          msg: Number(it.fieldType) === 5 && val[it.field] ? JSON.stringify(val[it.field]) : val[it.field],
        };
        if (Number(it.fieldType) === 5 && val[it.field]) {
          Object.assign(obj, {
            startTime: Number(it.dateType) === 2 ? moment(val[it.field][0]).format('x') : moment(val[it.field]).format('x'),
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
      projectId: val.projectId || '',
      supplierAccountId: val.supplier ? val.supplier.split('_')[0] : '',
      supplierId: val.supplier ? val.supplier.split('_')[1] : '',
      imgUrl,
      fileUrl,
      submitSum: ((total * 1000)/10).toFixed(0),
      expandSubmitFieldVos,
      selfSubmitFieldVos
    };
    const arr = [];
    costDetailsVo.forEach((item, index) => {
    console.log('handelOkDraft -> costDetailsVo', costDetailsVo);
      arr.push({
        'categoryId': item.categoryId,
        'categoryName': item.categoryName,
        'costSum': (((item.costSum) * 1000)/10).toFixed(0),
        'note': item.note,
        'costDate':item.costDate,
        'startTime':item.startTime || '',
        'endTime':item.endTime || '',
        'imgUrl':item.imgUrl,
        'invoiceBaseId':id,
        costDetailShareVOS: [],
        currencyId: item.currencyId && item.currencyId !== '-1' ? item.currencyId : '',
        currencyName: item.currencyName || '',
        selfCostDetailFieldVos: item.selfCostDetailFieldVos,
        expandCostDetailFieldVos: item.expandCostDetailFieldVos,
        detailFolderId: item.detailFolderId || '',
        icon: item.icon,
      });
      if (item.costDetailShareVOS) {
        item.costDetailShareVOS.forEach(it => {
          arr[index].costDetailShareVOS.push({
            'shareAmount': (it.shareAmount * 1000)/10,
            'shareScale': (it.shareScale * 1000)/10,
            'deptId': it.deptId,
            'userId': it.userId,
            'userJson':it.users,
            deptName: it.deptName,
            userName: it.userName,
            projectId: it.projectId,
          });
        });
      }
    });
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
      if (showField.happenTime.dateType === '2' || showField.happenTime.dateType === 2) {
        Object.assign(params, {
          startTime: val.time ? moment(val.time[0]).format('x') : '',
          endTime: val.time ? moment(val.time[1]).format('x') : ''
        });
      } else if (showField.happenTime.dateType === '1' || showField.happenTime.dateType === 1) {
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
      this.onCancel();
      message.success('保存草稿成功');
      this.props.onHandleOk();
    });
  }

  onSubmit = (params) => {
    const { dispatch, templateType, draftId } = this.props;
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
      this.props.onHandleOk();
    });
  }

  chargeHandle = (params) => {
    const { borrowArr } = this.state;
    const { templateType, waitLists } = this.props;
    if (templateType && Number(templateType)) {
      this.onSubmit(params);
    } else if (borrowArr.length === 0 && (waitLists.length > 0)) {
      confirm({
        title: '还有借款未核销，确认提交吗？',
        okText: '确定提交',
        cancelText: '继续核销',
        onOk: () => {
          this.onSubmit(params);
        },
        onCancel: () => {
          console.log('Cancel');
        },
      });
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

  changeBorrows = (val,keys) => {
    this.onAddBorrow(val, keys);
  }

  changeApply = (val, keys) => {
    this.onAddApply(val, keys);
  }

  onChangeCreate = (val) => {
    const detail = this.state.details;
    const { loanUserId, total } = this.state;
    this.getNode({
      creatorDeptId: val,
      loanUserId: loanUserId || '',
      loanDeptId: detail.deptId || '',
      loanEntities: detail.loanEntities || [],
      categorySumEntities: detail.categorySumEntities || [],
      processPersonId: detail.processPersonId,
      createDingUserId: detail.createDingUserId,
      total: (total * 1000)/10,
      projectId: detail.projectId || '',
      supplierId: detail.supplierId || ''
    });
    this.setState({
      details: {
        ...detail,
        createDeptId: val,
      },
    });
  }

  onChangeDept = (val) => {
    const detail = this.state.details;
    const { loanUserId, total } = this.state;
    this.getNode({
      creatorDeptId: detail.createDeptId,
      loanUserId: loanUserId || '',
      loanDeptId: val,
      loanEntities: detail.loanEntities || [],
      categorySumEntities: detail.categorySumEntities || [],
      processPersonId: detail.processPersonId,
      createDingUserId: detail.createDingUserId,
      total: (total * 1000)/10,
      projectId: detail.projectId || '',
      supplierId: detail.supplierId || ''
    });
    this.setState({
      details: {
        ...detail,
        loanDeptId: val,
      },
    });
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

  check = (rule, value, callback) => {
    const { showField } = this.state;
    if (showField[rule.field].isWrite) {
      if (value) {
        callback();
      } else  {
        callback('请选择收款账户');
      }
    } else {
      callback();
    }
  }

  onSelectTree = () => {
    const { usableSupplier } = this.props;
    const list = [];
    usableSupplier.forEach(item => {
      const obj = {
        value: item.id,
        title: item.name,
        children: [],
        disabled: true,
      };
      item.supplierAccounts.forEach(it => {
        obj.children.push({
          value: `${it.id}_${it.supplierId}`,
          title: it.name,
          parentId: it.supplierId,
          type: it.type,
          account: it.account
        });
      });
      list.push(obj);
    });
    return list;
  }

  treeNodeRender = (treeNode) => {
  if(!treeNode || !treeNode.length){
    return;
  }
    return treeNode.map((v) => {
      return (
        <TreeNode
          value={v.value}
          title={(
            <span className="c-black-85" style={{color: 'rgba(0,0,0,0.85)!important'}}>{v.title}</span>
          )}
          key={v.value}
          searchs={v.title}
          disabled
        >
          {v.children && this.treeNodeChildRender(v.children, v.title)}
        </TreeNode>
      );
    });
  }

  treeNodeChildRender = (list, titles) => {
    return list.map(it => (
      <TreeNode
        key={it.value}
        value={it.value}
        name={it.title}
        searchs={titles}
        title={(
          <div>
            <div className={style.treeOption}>
              {
                it.type === 0 &&
                <i className="iconfont iconyinhangka" />
              }
              {
                it.type === 1 &&
                <i className="iconfont iconzhifubao" />
              }
              {
                it.type === 2 &&
                <i className="iconfont iconxianjin" />
              }
              {it.title}
            </div>
            <p className="c-black-36 m-l-20 fs-12" style={{marginBottom: 0}}>
              {it.type === 0 && '银行卡'}
              {it.type === 1 && '支付宝'}
              {it.type === 2 && '现金'}
              {it.account}
            </p>
          </div>
        )}
      />
    ));
  }

  onChangePro = (val, name) => {
    let data = this.state.details;
    if (name === 'project') {
      data = {
        ...data,
        projectId: val,
      };
    } else {
      data = {
        ...data,
        supplierId: val.split('_')[1],
      };
    }
    const { loanUserId, total } = this.state;
    this.getNode({
      creatorDeptId: data.createDeptId || '',
      loanUserId: loanUserId || '',
      loanDeptId: data.deptId || '',
      loanEntities: data.loanEntities || [],
      categorySumEntities: data.categorySumEntities || [],
      processPersonId: data.processPersonId,
      createDingUserId: data.createDingUserId,
      total: (total * 1000)/10,
      projectId: data.projectId || '',
      supplierId: data.supplierId || ''
    });
    this.setState({
      details: data,
    });
  }

  inputMoney = (value) => {
    const { details } = this.state;
    this.setState({
      total: value
    }, () => {
      if(!/((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/.test(value)) {
        return;
      }
      if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(value)) {
        return;
      }
      if (value > 100000000 || value === 100000000) {
        return;
      }
      if (value < 0) {
        return;
      }
      this.getNode({
        projectId: details.projectId || '',
        supplierId: details.supplierId || '',
        createDingUserId: details.createDingUserId,
        creatorDeptId: details.createDeptId || '',
        processPersonId: details.processPersonId,
      });
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

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  disabledDate = (current) => {
    console.log(current);
    // Can not select days before today and today
    return current && current < moment(new Date()).subtract(1, 'day');
  }

  disabledDateTime = () => {
    return {
      disabledHours: () => this.range(0, 24).splice(4, 20),
      disabledMinutes: () => this.range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }

  render() {
    const {
      children,
      form: { getFieldDecorator },
      userInfo,
      id,
      loading,
      usableProject,
      templateType,
      draftLoading,
      djDetail,
    } = this.props;
    const supplierList = this.onSelectTree();
    const {
      visible,
      imgUrl,
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
      total,
      expandField,
      borrowArr,
      assessSum,
      applyArr,
      newshowField,
    } = this.state;
    const newForm = [...newshowField, ...expandField].sort(compare('sort'));
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
        sm: { span: 13 },
      },
    };
    return (
      <span className="invoiceFirst">
        <span onClick={() => this.onShowHandle()} className="invoiceSecond">{ children }</span>
        <Modal
          visible={visible}
          width="980px"
          bodyStyle={{height: '470px', overflowY: 'scroll'}}
          title={inDetails.name}
          onCancel={this.onCancel}
          maskClosable={false}
          onOk={this.handleOk}
          footer={(
            <div className={style.footerBtn}>
              <Button key="cancel" onClick={() => this.onCancel()}>取消</Button>
              <div className={style.moneyList}>
                {
                  !Number(templateType) ?
                    <>
                      <span className={cs('fs-15', 'c-black-50', style.moneyList)}>报销金额：<span className="fs-20 fw-500 c-black-85">¥{total}</span></span>
                      <Divider type="vertical" />
                      <span className={cs('fs-15', 'c-black-50', style.moneyList)}>核销金额：<span className="fs-20 fw-500 c-black-85">¥{assessSum}</span></span>
                      <Divider type="vertical" />
                      <span className={cs('fs-15', 'c-black-50', style.moneyList, 'm-r-8')}>收款金额：<span className="fs-20 fw-500 c-black-85">¥{total-assessSum > 0 ? (numSub(total,assessSum)) : 0}</span></span>
                    </>
                  :
                    <span className={cs('fs-15', 'c-black-50', 'm-r-8', style.moneyList)}>合计：¥<span className="fs-20 fw-500 c-black-85">{total}</span></span>
                }
                <Button key="draft" onClick={() => this.handelOkDraft()} loading={draftLoading}>保存</Button>
                <Button key="save" type="primary" onClick={() => this.handleOk()} loading={loading}>确定</Button>
              </div>
            </div>
          )}
        >
          <div className={style.addInvoice}>
            <div className={style.header}>
              <div className={style.line} />
              <span>基本信息</span>
            </div>
            <Form className="formItem" refs={forms => {this.invoice = forms;}}>
              <Row>
                <Col span={12}>
                  <Form.Item label={showField.reason && showField.reason.name} {...formItemLayout}>
                    {
                      getFieldDecorator('reason', {
                        initialValue: details.reason || '',
                        rules:[{ required: true, message: '请输入事由' }]
                      })(
                        <Input placeholder="请输入"  />
                      )
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={showField.userJson && showField.userJson.name} {...formItemLayout}>
                    <SelectPeople
                      users={users}
                      placeholder='请选择'
                      onSelectPeople={(val) => this.selectPle(val)}
                      invalid={false}
                      disabled={Number(templateType)}
                      flag="users"
                      isInput
                      multiple={false}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{display: 'flex', flexWrap: 'wrap'}}>
                <Col span={12}>
                  <Form.Item label={showField.deptId && showField.deptId.name} {...formItemLayout}>
                    {
                      getFieldDecorator('deptId', {
                        rules: [{ required: true, message: `请选择${showField.deptId && showField.deptId.name}` }]
                      })(
                        <Select placeholder="请选择" onChange={this.onChangeDept}>
                          {
                            depList && depList.map(it => (
                              <Option key={it.deptId}>{it.name}</Option>
                            ))
                          }
                        </Select>
                      )
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={labelInfo.createDeptId} {...formItemLayout}>
                    {
                      getFieldDecorator('createDeptId', {
                        initialValue: details.createDeptId ? `${details.createDeptId}` : '',
                        rules: [{ required: true, message: '请选择部门' }]
                      })(
                        <Select
                          placeholder="请选择"
                          onChange={this.onChangeCreate}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                          {
                            createDepList && createDepList.map(it => (
                              <Option key={`${it.deptId}`}>{it.name}</Option>
                            ))
                          }
                        </Select>
                      )
                    }
                  </Form.Item>
                </Col>
                {
                  newForm && (newForm.length > 0) &&
                  newForm.map(itw => {
                    if (itw.field.indexOf('expand_') > -1 || itw.field.indexOf('self_') > -1) {
                      let renderForm = null;
                      let rule = [];
                      let initMsg = itw.msg || '';
                      if (Number(itw.fieldType) === 0) {
                        renderForm = (<Input placeholder='请输入' />);
                        rule = [{ max: 20, message: '限制20个字' }];
                      } else if (Number(itw.fieldType) === 1) {
                        renderForm = (<TextArea placeholder='请输入' />);
                        rule = [{ max: 128, message: '限制128个字' }];
                      } else if(Number(itw.fieldType) === 2) {
                        renderForm = (
                          <Select placeholder='请选择'>
                            {
                              itw.options && itw.options.map(iteems => (
                                <Select.Option key={iteems}>{iteems}</Select.Option>
                              ))
                            }
                          </Select>
                        );
                      } else if (itw.fieldType === 5) {
                        if (itw.dateType === 1) {
                          initMsg = itw.startTime ? moment(moment(Number(itw.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD') : '';
                          renderForm = (
                            <DatePicker style={{width: '100%'}} />
                          );
                        } else {
                          initMsg = itw.startTime && itw.endTime ?
                              [moment(moment(Number(itw.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD'), moment(moment(Number(itw.endTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD')] : [];
                          renderForm = (
                            <RangePicker
                              style={{width: '280px' }}
                              placeholder="请选择时间"
                              format="YYYY-MM-DD"
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
                            itw.status ?
                              <Col span={12}>
                                <Form.Item label={itw.name} {...formItemLayout}>
                                  {
                                    getFieldDecorator(itw.field, {
                                      initialValue: initMsg,
                                      rules: [
                                        {
                                          required: !!(itw.isWrite),
                                          message: `请${Number(itw.fieldType === 2) ? '选择' : '输入'}${itw.name}`
                                        },
                                        ...rule,
                                      ],
                                    })(
                                      renderForm
                                    )
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
                            itw.field === 'loanSum' && itw.status ?
                              <Col span={12}>
                                <Form.Item label={showField.loanSum && showField.loanSum.name} {...formItemLayout}>
                                  {
                                    getFieldDecorator('loanSum', {
                                      initialValue: details.loanSum || '',
                                      rules: [{
                                        required: !!(showField.loanSum && showField.loanSum.isWrite),
                                        message: `请输入${showField.loanSum && showField.loanSum.name}`
                                      }, {
                                        validator: this.checkMoney
                                      }]
                                    })(
                                      <InputNumber
                                        onChange={val => this.inputMoney(val)}
                                        placeholder={`请输入${showField.loanSum && showField.loanSum.name}`}
                                        style={{width: '100%'}}
                                      />
                                    )
                                  }
                                </Form.Item>
                              </Col>
                              :
                              null
                          }
                          {
                            itw.field === 'applicationSum' && itw.status ?
                              <Col span={12}>
                                <Form.Item label={showField.applicationSum && showField.applicationSum.name} {...formItemLayout}>
                                  {
                                    getFieldDecorator('applicationSum', {
                                      initialValue: details.applicationSum || '',
                                      rules: [{
                                        required: !!(showField.applicationSum && showField.applicationSum.isWrite),
                                        message: `请输入${showField.applicationSum && showField.applicationSum.name}`
                                      }, {
                                        validator: this.checkMoney
                                      }]
                                    })(
                                      <InputNumber
                                        onChange={val => this.inputMoney(val)}
                                        placeholder={`请输入${showField.applicationSum && showField.applicationSum.name}`}
                                        style={{width: '100%'}}
                                      />
                                    )
                                  }
                                </Form.Item>
                              </Col>
                              :
                              null
                          }
                          {
                            itw.field === 'repaymentTime' && itw.status ?
                              <Col span={12}>
                                <Form.Item label={showField.repaymentTime && showField.repaymentTime.name} {...formItemLayout}>
                                  {
                                    getFieldDecorator('repaymentTime', {
                                      initialValue: details.repaymentTime ? moment(moment(Number(details.repaymentTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD') : '',
                                      rules: [{
                                        required: !!(showField.repaymentTime && showField.repaymentTime.isWrite),
                                        message: `请选择${showField.repaymentTime && showField.repaymentTime.name}`
                                      }]
                                    })(
                                      <DatePicker
                                        disabledDate={this.disabledDate}
                                        disabledTime={this.disabledDateTime}
                                      />
                                    )
                                  }
                                </Form.Item>
                              </Col>
                              :
                              null
                          }
                          {
                            itw.field === 'happenTime' && itw.status ?
                              <Col span={12}>
                                <Form.Item label={showField.happenTime && showField.happenTime.name} {...formItemLayout}>
                                  {
                                    Number(showField.happenTime.dateType) === 1 &&
                                    getFieldDecorator('time', {
                                      initialValue: details.startTime ? moment(moment(Number(details.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD') : '',
                                      rules: [{ required: !!(showField.happenTime.isWrite), message: '请选择时间' }]
                                    })(
                                      <DatePicker style={{width: '100%'}} />
                                    )
                                  }
                                  {
                                    Number(showField.happenTime.dateType) === 2 &&
                                    getFieldDecorator('time', {
                                      initialValue: details.startTime && details.endTime ?
                                        [moment(moment(Number(details.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD'), moment(moment(Number(details.endTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD')]
                                        :
                                        [],
                                      rules: [{ required: !!(showField.happenTime.isWrite), message: '请选择时间' }]
                                    })(
                                      <RangePicker
                                        style={{width: '280px' }}
                                        placeholder="请选择时间"
                                        format="YYYY-MM-DD"
                                        showTime={{
                                          hideDisabledOptions: true,
                                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                        }}
                                      />
                                    )
                                  }
                                </Form.Item>
                              </Col>
                              :
                              null
                          }
                          {
                            itw.field === 'imgUrl' && showField.imgUrl.status ?
                              <Col span={12}>
                                <Form.Item label={labelInfo.imgUrl} {...formItemLayout}>
                                  <UploadImg onChange={(val) => this.onChangeImg(val)} imgUrl={imgUrl} userInfo={userInfo} />
                                </Form.Item>
                              </Col>
                              :
                              null
                          }
                          {
                            itw.field === 'fileUrl' && showField.fileUrl.status ?
                              <Col span={12}>
                                <Form.Item label={labelInfo.fileUrl} {...formItemLayout}>
                                  <Button onClick={() => this.uploadFiles()} disabled={fileUrl && (fileUrl.length > 9 || fileUrl.length === 9)}>
                                    <Icon type="upload" /> 上传文件
                                  </Button>
                                  <p className="fs-14 c-black-45 li-1 m-t-8" style={{marginBottom: 0}}>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</p>
                                  {
                                    fileUrl.map((it, index) => (
                                      <div key={it.fileId} className={style.fileList} onClick={() => this.previewFiless(it)}>
                                        <div className={style.fileIcon}>
                                          <img
                                            className='attachment-icon'
                                            src={fileIcon[it.fileType]}
                                            alt='attachment-icon'
                                          />
                                          <span className="eslips-1">{it.fileName}</span>
                                        </div>
                                        <i className="iconfont icondelete_fill" onClick={(e) => this.onDelFile(index, e)} />
                                      </div>
                                    ))
                                  }
                                </Form.Item>
                              </Col>
                              :
                              null
                          }
                          {
                            itw.field === 'project' && showField.project.status ?
                              <Col span={12}>
                                <Form.Item label={labelInfo.project} {...formItemLayout}>
                                  {
                                    getFieldDecorator('projectId', {
                                      initialValue: details.projectId || '',
                                      rules: [{ required: !!(showField.project.isWrite), message: '请选择项目' }]
                                    })(
                                      <Select
                                        placeholder={`请选择${labelInfo.project}`}
                                        onChange={(val) => this.onChangePro(val, 'project')}
                                        dropdownClassName="selectClass"
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                      >
                                        {
                                          usableProject.map(it => (
                                            <Option key={it.id}>{it.name}</Option>
                                          ))
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
                            itw.field === 'supplier' && showField.supplier.status ?
                              <Col span={12}>
                                <Form.Item label={labelInfo.supplier} {...formItemLayout}>
                                  {
                                    getFieldDecorator('supplier', {
                                      initialValue: details.supplier || '',
                                      rules: [{ required: !!(showField.supplier.isWrite), message: '请选择供应商账号' }]
                                    })(
                                      <TreeSelect
                                        showSearch
                                        treeNodeFilterProp='searchs'
                                        placeholder="请选择"
                                        style={{width: '100%'}}
                                        treeDefaultExpandAll
                                        dropdownStyle={{height: '300px'}}
                                        onChange={(val) => this.onChangePro(val, 'supplier')}
                                        treeNodeLabelProp="name"
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                      >
                                        {this.treeNodeRender(supplierList)}
                                      </TreeSelect>
                                    )
                                  }
                                </Form.Item>
                              </Col>
                              :
                              null
                          }
                          {
                            itw.field === 'note' && showField.note.status ?
                              <Col span={12}>
                                <Form.Item label={labelInfo.note} {...formItemLayout}>
                                  {
                                    getFieldDecorator('note',{
                                      initialValue: details.note || '',
                                      rules: [{ required: !!(showField.note.isWrite), message: '请输入备注' }]
                                    })(
                                      <Input placeholder="请输入"  />
                                    )
                                  }
                                </Form.Item>
                              </Col>
                              :
                              null
                          }
                          {
                            itw.field === 'receiptId' && showField.receiptId.status ?
                              <Col span={12} style={{position: 'relative'}}>
                                <Form.Item label={labelInfo.receiptId} {...formItemLayouts}>
                                  {
                                    getFieldDecorator('receiptId', {
                                      initialValue: details.receiptId ? [details.receiptId] : null,
                                      rules: [{ required: !!(showField.receiptId && showField.receiptId.isWrite), message: '请输入收款账户' }],
                                    })(
                                      <Select
                                        placeholder="请选择"
                                        dropdownClassName={style.opt}
                                        onChange={(val) => this.onChangeAcc(val)}
                                        optionLabelProp="label"
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        // value={details.receiptId}
                                      >
                                        {
                                          accountList.map(it => (
                                            <Option key={it.id} value={it.id} label={it.name}>
                                              <div className={style.selects}>
                                                <p className="c-black fs-14">{it.name} </p>
                                                <p className="c-black-36 fs-13">{it.account}</p>
                                              </div>
                                              <Divider type="horizontal" />
                                            </Option>
                                          ))
                                        }
                                      </Select>
                                    )
                                  }
                                </Form.Item>
                                <ReceiptModal title="add" onOk={this.handelAcc}>
                                  <a className={style.addReceipt}>新增</a>
                                </ReceiptModal>
                              </Col>
                              :
                              null
                          }
                        </>
                      );
                  })
                }
              </Row>
            </Form>
            {
              !Number(templateType) &&
              <>
                <Divider type="horizontal" />
                <div style={{paddingTop: '24px', paddingBottom: '30px'}}>
                  <div className={style.header}>
                    <div className={style.line} />
                    <span>费用明细</span>
                  </div>
                  <div style={{textAlign: 'center'}} className={style.addbtn}>
                    <AddCost userInfo={userInfo} invoiceId={id} onAddCost={this.onAddCost} key="handle">
                      <Button icon="plus" className="m-r-8" style={{ width: '231px' }} key="handle">手动添加费用</Button>
                    </AddCost>
                    <AddFolder
                      userInfo={userInfo}
                      invoiceId={id}
                      onAddCost={this.onAddCost}
                      key="export"
                      list={costDetailsVo}
                      invoiceName={inDetails.name}
                    >
                      <Button icon="plus" style={{ width: '231px' }} key="export">费用夹导入</Button>
                    </AddFolder>
                    {
                      costDetailsVo && costDetailsVo.length > 0 &&
                      <CostTable
                        list={costDetailsVo}
                        userInfo={userInfo}
                        invoiceId={id}
                        onChangeData={(val) => this.onChangeData(val)}
                        addCost={this.onAddCost}
                      />
                    }
                  </div>
                </div>
              </>
            }
            {
              djDetail.isRelationLoan &&
              <>
                <Divider type="horizontal" />
                <div style={{paddingTop: '24px', paddingBottom: '30px'}}>
                  <div className={style.header}>
                    <div className={style.line} />
                    <span>借款核销</span>
                  </div>
                  <div style={{textAlign: 'center'}} className={style.addbtn}>
                    <AddBorrow
                      userInfo={userInfo}
                      invoiceId={id}
                      onAddBorrow={arr => this.onAddBorrow(arr)}
                      list={borrowArr}
                    >
                      <Button icon="plus" style={{ width: '231px' }}>选择借款</Button>
                    </AddBorrow>
                    {
                      this.state.borrowArr && this.state.borrowArr.length > 0 &&
                      <BorrowTable
                        list={borrowArr}
                        userInfo={userInfo}
                        invoiceId={id}
                        onChangeData={(val,keys) => this.changeBorrows(val,keys)}
                      />
                    }
                  </div>
                </div>
              </>
            }
            {
              djDetail.isRelationApply  ?
                <>
                  <Divider type="horizontal" />
                  <div style={{paddingTop: '24px', paddingBottom: '30px'}}>
                    <div className={style.header} style={{padding: 0}}>
                      <div className={style.line} />
                      <span>关联申请单</span>
                    </div>
                    <div style={{textAlign: 'center'}} className={style.addbtn}>
                      <AddApply
                        userInfo={userInfo}
                        invoiceId={id}
                        onAddBorrow={arr => this.onAddApply(arr)}
                        list={applyArr}
                      >
                        <Button icon="plus" style={{ width: '231px' }}>选择申请单</Button>
                      </AddApply>
                      {
                        this.state.applyArr && applyArr.length > 0 &&
                        <ApplyTable
                          list={applyArr}
                          userInfo={userInfo}
                          invoiceId={id}
                          onChangeData={(val,keys) => this.changeApply(val,keys)}
                        />
                      }
                    </div>
                  </div>
                </>
                :
                null
            }
            <Divider type="horizontal" />
            <div style={{paddingTop: '24px', paddingBottom: '30px'}}>
              <div className={style.header} style={{padding: 0}}>
                <div className={style.line} />
                <span>审批流程</span>
              </div>
              <ApproveNode
                approveNodes={nodes}
                onChangeForm={(val) => this.onChangeNode(val)}
              />
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}

export default AddInvoice;
