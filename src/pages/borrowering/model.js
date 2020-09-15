import { post, get } from '@/utils/request';
import constants from '@/utils/constants';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'borrowering',
  state: {
    list: [],
    recordList: [],
    loanSumObj:{},
    query: {
      pageNo: 1,
      pageSize: PAGE_SIZE,
    },
    total: 0,
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);

    //   const response = {
    //         list: [
    //             {
    //                 loanId: "469526889729003520", //借款单id,
    //                 reason: "事由",
    //                 loanSum: 200, //借款总金额
    //                 waitLoanSum: 100, //待还款总金额 = 待核销金额+ 核销中金额
    //                 waitAssessSum:50,//待核销金额
    //                 invoiceNo: "单号", 
    //                 invoiceTemplateId:"单据类型id",
    //                 invoiceTemplateName:"单据类型名称",
    //                 userId:"提交人userId 这里就是指借款人",
    //                 userName:"提交人 这里就是指借款人",
    //                 deptId:"提交人部门 这里是指借款人",
    //                 deptName:"提交人部门名称",
    //                 createTime: 1589873534000,
    //                 repaymentTime: 1589873534000,//预计归还时间
    //                 realRepaymentTime:1589873534000 //实际归还时间
    //             }
    //         ],
    //         page: {
    //           prePage: 0,
    //           currentPage: 1,
    //           nextPage: 0,
    //           totalPage: 1,
    //           total: 1
    //         }
    // }
      // eslint-disable-next-line no-return-assign
      console.log(response.list);
      const lists = response.pageResult.list && response.pageResult.list.map(it => { return {...it, id: it.loanId}; });
      yield put({
        type: 'save',
        payload: {
          list: lists || [],
          // list: [{ id: 1 }, { id: 2 }],
          loanSumObj:response.loanSum || {},
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.pageResult.page ? response.pageResult.page.total : 0,
        },
      });
    },
    *send({ payload }, { call }) {
      yield call(post, api.send, payload);
    },
    // 已发放
    *exported({ payload }, { call }) {
      Object.assign(payload, { type: 'export', fileName: '已发放列表' });
      yield call(post, api.payedExport, payload);
    },
    // 待发放
    *exporting({ payload }, { call }) {
      Object.assign(payload, { type: 'export', fileName: '待发放列表' });
      yield call(post, api.payingExport, payload);
    },
    *refuse({ payload }, { call }) {
      yield call(post, api.refuse, payload);
    },
    // 手动还款
    *repaySum({ payload }, { call }) {
      yield call(post, api.repaySum, payload);
    },
    // 借还记录
    *repayRecord({ payload }, { call, put }) {
      const response = yield call(get, api.repayRecord, payload);
      // const response = {
      //   list : [
      //     {
      //         type: '0 核销还款  1 手动还款 2 2借款',
      //         typeStr:'类型得一个解释 前端可直接取这个值',
      //         status:'0 一个流离状态(type为借款，手动还款时存在) 1 核销中  2 核销完成',
      //         repaySum:100,// 金额
      //         note:'备注和事由',
      //         createName:'操作人姓名',
      //         createTime:1233,
      //         invoiceSubmitId:'报销单id，手动还款返回为null',
      //         accountVo:{
      //             accountId:'收款账户id',
      //             account:'收款账户',
      //             accountName:'收款账户名称',
      //             accountType:'账户类型 0-银行卡 1-支付宝 2-现金',
      //             bankName:'银行名称',
      //             isSupplier:'是否是供应商'
      //         }
      //     }
      //   ]
      // };
      // console.log('response=====',response);
      yield put({
        type: 'save',
        payload: {
          recordList: (response && response.list) || [],
        },
      });
    }
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  }
};
