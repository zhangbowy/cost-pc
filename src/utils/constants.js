/**
 * 配置文件
 */
/* eslint-disable no-undef */
import { version } from 'dingtalk-jsapi';
/* ---------- System ----------*/
export default {
  // 分页每页条数
  PAGE_SIZE: 10,
  // appid
  // APPID,
  // sysId
  SYS_ID: 'framework',
  // 请求超时时间
  TIMEOUT: 30000,
  // 请求错误提示
  ERR_MSG: '系统错误，请稍后重试',
  // deviceId存储key
  DEVICEID_KEY: 'framework_deviceId',
  APP_API,
  APP_NAME,
  isInDingTalk: typeof version === 'string',
  classify: [{
    key: 'basic',
    value: '基础设置',
  }, {
    key: 'field',
    value: '字段设置',
  }, {
    key: 'shareField',
    value: '分摊设置',
  }],
  imgPath: `${APP_API}/cost/upload/image`
};

/* ---------- Layout ----------*/
export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

export const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 6,
    },
  },
};

export const batchStatus = [
  {
    key: '3',
    value: '待处理'
  },{
    key: '1',
    value: '待支付'
  },{
    key: '0',
    value: '全部'
  }];

export const accountType = [{
  key: 0,
  text: 0,
  value: '银行卡'
}, {
  key: 1,
  text: 1,
  value: '支付宝'
}, {
  key: 2,
  text: 2,
  value: '现金'
}];

export const filterAccount = [{
  value: 0,
  text: '银行卡'
}, {
  value: 1,
  text: '支付宝'
}, {
  value: 2,
  text: '现金'
}];

export const isAllUse = [{
  key: true,
  value: '全部人员'
}, {
  key: false,
  value: '部分人员'
}];
export const isAllCostCategory = [{
  key: true,
  value: '全部类别'
}, {
  key: false,
  value: '部分类别'
}];

export const costCategoryJson = [{
  key: 'reason',
  field: 'reason',
  name: '事由',
  status: true,
  isWrite: true,
  note: '',
}, {
  key: 'userJson',
  field: 'userJson',
  name: '承担人',
  status: true,
  isWrite: false,
  note: '',
}, {
  key: 'deptId',
  field: 'deptId',
  name: '承担部门',
  status: true,
  isWrite: true,
  note: '',
}, {
  key: 'project',
  field: 'project',
  name: '项目',
  status: false,
  isWrite: false,
  note: '',
}, {
  key: 'supplier',
  field: 'supplier',
  name: '供应商',
  status: false,
  isWrite: false,
  note: '',
}, {
  key: 'loan',
  field: 'loan',
  name: '借款核销',
  status: true,
  isWrite: false,
  note: '',
}, {
  key: 'note',
  field: 'note',
  name: '单据备注',
  status: false,
  isWrite: false,
  note: '',
}, {
  key: 'receiptId',
  field: 'receiptId',
  name: '收款账户',
  status: true,
  isWrite: false,
  note: '',
}, {
  key: 'imgUrl',
  field: 'imgUrl',
  name: '图片',
  status: true,
  isWrite: false,
  note: '',
}, {
  key: 'fileUrl',
  field: 'fileUrl',
  name: '附件',
  status: true,
  isWrite: false,
  note: '',
}];

export const borrowJson = [{
  key: 'reason',
  field: 'reason',
  name: '借款事由',
  status: true,
  isWrite: true,
  note: '',
  disabled: true,
}, {
  key: 'userJson',
  field: 'userJson',
  name: '借款人',
  status: true,
  isWrite: false,
  note: '',
  disabled: true,
}, {
  key: 'deptId',
  field: 'deptId',
  name: '借款部门',
  status: true,
  isWrite: true,
  note: '',
  disabled: true,
}, {
  key: 'loanSum',
  field: 'loanSum',
  name: '借款金额',
  status: true,
  isWrite: true,
  note: '',
  disabled: true,
}, {
  key: 'repaymentTime',
  field: 'repaymentTime',
  name: '预计还款时间',
  status: true,
  isWrite: true,
  note: '',
}, {
  key: 'project',
  field: 'project',
  name: '项目',
  status: false,
  isWrite: false,
  note: '',
}, {
  key: 'supplier',
  field: 'supplier',
  name: '供应商',
  status: false,
  isWrite: false,
  note: '',
}, {
  key: 'note',
  field: 'note',
  name: '单据备注',
  status: true,
  isWrite: false,
  note: '',
}, {
  key: 'receiptId',
  field: 'receiptId',
  name: '收款账户',
  status: true,
  isWrite: false,
  note: '',
}, {
  key: 'imgUrl',
  field: 'imgUrl',
  name: '图片',
  status: true,
  isWrite: false,
  note: '',
}, {
  key: 'fileUrl',
  field: 'fileUrl',
  name: '附件',
  status: true,
  isWrite: false,
  note: '',
}];

// 费用类别
export const costClassify = [{
  key: 'costCategory',
  field: 'costCategory',
  name: '费用类别',
  status: true,
  isWrite: true,
  note: '',
}, {
  key: 'amount',
  field: 'amount',
  name: '金额',
  status: true,
  isWrite: true,
  note: '',
}, {
  key: 'happenTime',
  field: 'happenTime',
  name: '发生日期',
  status: true,
  isWrite: false,
  note: '',
}, {
  key: 'costNote',
  field: 'costNote',
  name: '费用备注',
  status: true,
  isWrite: false,
  note: '',
}, {
  key: 'imgUrl',
  field: 'imgUrl',
  name: '图片',
  status: true,
  isWrite: false,
  note: '',
}];

// 费用类别分摊
export const classifyShare = [{
  key: 'user',
  field: 'user',
  disabled: true,
  name: '承担人',
  status: true,
  isWrite: false,
  note: '',
}, {
  key: 'dept',
  field: 'dept',
  name: '承担部门',
  disabled: true,
  status: true,
  isWrite: true,
  note: '',
}, {
  key: 'project',
  field: 'project',
  name: '项目',
  status: false,
  isWrite: false,
  note: '',
}];

export const dataType = [{
  key: '1',
  value: '指定日期',
}, {
  key: '2',
  value: '日期区间',
}];

export const defaultTitle = {
  edit: '编辑',
  copy: '复制',
  add: '新增'
};

export const targets = {
  project: '项目',
  group: '分组'
};

// 审批流
export const approveUser = [{
  key: 'assignMember',
  value: '指定审批人'
}, {
  key: 'leader',
  value: '指定主管'
}, {
  key: 'approverRole',
  value: '按审批角色分工'
}, {
  key: 'selfSelect',
  value: '提交人自选'
}];

export const approveLeader = [{
  key: 'first_leader',
  value: '一级主管'
}, {
  key: 'second_leader',
  value: '二级主管'
}, {
  key: 'third_leader',
  value: '三级主管'
}, {
  key: 'forth_leader',
  value: '四级主管'
}, {
  key: 'fifth_leader',
  value: '五级主管'
}];
export const approveCreate = [{
  key: 'make_user',
  value: '提交人'
}, {
  key: 'bear_user_or_dept',
  value: '承担人/部门'
}];

export const peopleType = {
  'START': '提交人',
  'CONDITION': '条件',
  'ROUTE': '路由（分叉）',
  'APPROVER': '审批人',
  'NOTIFIER': '抄送人',
  'GRANT': '发放'
};

export const approveSet = [{
  key: 'AND',
  value: '会签（需所有审批人同意）',
}, {
  key: 'OR',
  value: '或签（一名审批人同意或拒绝）',
}];

export const classifyIcon = [{
  key: 'morenleibietu1',
  value: 'iconmorenleibietu1',
  color: 'rgba(0, 199, 149, 1)',
}, {
  key: 'morenleibietu2',
  value: 'iconmorenleibietu2',
  color: 'rgba(103, 119, 255, 1)',
}, {
  key: 'morenleibietu3',
  value: 'iconmorenleibietu3',
  color: 'rgba(50, 197, 255, 1)',
}, {
  key: 'morenleibietu4',
  value: 'iconmorenleibietu4',
  color: 'rgba(247, 181, 0, 1)',
}];

export const defaultStatus = [{
  key: '1',
  value: '审批中'
}, {
  key: '2',
  value: '待发放'
}, {
  key: '0',
  value: '全部'
}];

export const statusList = [{
  key: '2',
  value: '待发放'
}, {
  key: '3',
  value: '已发放'
}];

export const invoiceStatus = [
//   {
//   key: '0',
//   value: '草稿'
// }, {
//   key: '1',
//   value: '审核中'
// },
{
  key: '2',
  value: '待发放'
}, {
  key: '3',
  value: '已发放'
},
// {
//   key: '4',
//   value: '已撤销'
// },
{
  key: '5',
  value: '已拒绝'
}];

// 审批状态
export const approveStatus = [{
  key: '1',
  value: '审批中'
}, {
  key: '2',
  value: '审批通过'
}, {
  key: '4',
  value: '已撤销'
}, {
  key: '5',
  value: '审批拒绝'
}];

// 还款状态
export  const loanStatus = [{
  key: '3',
  value: '待还款'
}, {
  key: '6',
  value: '已还款'
}];

// 签约状态
export const signStatus = [{
  key: '0',
  value: '未签约'
}, {
  key: '1',
  value: '签约处理中'
}, {
  key: '3',
  value: '已签约'
}];

// 审批默认配置
export const defaultFlow = [{
  key: 'CreatorFirstLeader',
  value: '差旅报销流程',
}, {
  key: 'CreatorSecondLeader',
  value: '采购报销流程',
}, {
  key: 'LoanUserFirstLeader',
  value: '对公报销流程',
}, {
  key: 'LoanUserSecondLeader',
  value: '承担人两级主管审批',
}, {
  key: 'CreatorSelfChoose',
  value: '提报人自选',
}];

// 审批默认配置
export const defaultFlowId = [{
  key: '1111',
  value: '提交人一级主管',
}, {
  key: '222',
  value: '提交人二级主管',
}, {
  key: '333',
  value: '承担人一级主管',
}, {
  key: '444',
  value: '承担人二级主管',
}, {
  key: '5555',
  value: '提报人自选',
}];

export const bankList = [
  '中国建设银行',
  '中国银行',
  '中国邮政储蓄银行',
  '中国光大银行',
  '交通银行',
  '中国农业银行',
  '兴业银行',
  '中信银行',
  '平安银行',
  '浦发银行',
  '招商银行',
  '中国工商银行',
  '广发银行'
];

export const repeatMethod = [{
  key: 'NONE',
  value: '不去重'
}, {
  key: 'RETAIN_FIRST',
  value: '当审批人出现多次时，去重保留第一个'
}, {
  key: 'RETAIN_LAST',
  value: '当审批人出现多次时，去重保留最后一个'
}];

// 包含/不包含条件
export const condExclude = [{
  key: 'include',
  value: '包含'
}, {
  key: 'exclude',
  value: '不包含'
}];
// 大于/小于条件
export const condThan = [{
  key: 'more_than',
  value: '>'
}, {
  key: 'less_than',
  value: '<'
}, {
  key: 'more_than_or_equal',
  value: '≥'
}, {
  key: 'less_than_or_equal',
  value: '≤'
}];

/* -----------------------------------------------------分支条件----------------------------------------------------------*/
export const condition = [{
  key: 'condition_creator_user_dept',
  value: '提交人/部门',
  sel: condExclude,
  type: 'people',
  ruleType: 'people',
}, {
  key: 'condition_bear_user_dept',
  value: '承担人/部门',
  sel: condExclude,
  type: 'people',
  ruleType: 'people',
}, {
  key: 'cost_category',
  value: '费用类别',
  sel: condExclude,
  type: 'selectTree',
  ruleType: 'category',
}, {
  key: 'invoice_submit_sum',
  value: '报销金额',
  sel: condThan,
  type: 'inputNumber',
  ruleType: 'submit_sum',
}, {
  key: 'cost_detail',
  value: '费用金额',
  sel: condThan,
  type: 'inputNumber',
  ruleType: 'detail_sum',
}, {
  key: 'project',
  value: '项目',
  sel: condExclude,
  type: 'selectTree',
  ruleType: 'project',
}, {
  key: 'supplier',
  value: '供应商',
  sel: condExclude,
  type: 'selectTree',
  ruleType: 'supplier',
}];

export const conditionObj = {
  '0': [{
    key: 'condition_creator_user_dept',
    value: '提交人/部门',
    sel: condExclude,
    type: 'people',
    ruleType: 'people',
  }, {
    key: 'condition_bear_user_dept',
    value: '承担人/部门',
    sel: condExclude,
    type: 'people',
    ruleType: 'people',
  }, {
    key: 'cost_category',
    value: '费用类别',
    sel: condExclude,
    type: 'selectTree',
    ruleType: 'category',
  }, {
    key: 'invoice_submit_sum',
    value: '报销金额',
    sel: condThan,
    type: 'inputNumber',
    ruleType: 'submit_sum',
  }, {
    key: 'cost_detail',
    value: '费用金额',
    sel: condThan,
    type: 'inputNumber',
    ruleType: 'detail_sum',
  }, {
    key: 'project',
    value: '项目',
    sel: condExclude,
    type: 'selectTree',
    ruleType: 'project',
  }, {
    key: 'supplier',
    value: '供应商',
    sel: condExclude,
    type: 'selectTree',
    ruleType: 'supplier',
  }],
  '1': [{
    key: 'condition_creator_user_dept',
    value: '提交人/部门',
    sel: condExclude,
    type: 'people',
    ruleType: 'people',
  }, {
    key: 'loan_detail',
    value: '借款金额',
    sel: condThan,
    type: 'inputNumber',
    ruleType: 'loan_amount',
  }, {
    key: 'project',
    value: '项目',
    sel: condExclude,
    type: 'selectTree',
    ruleType: 'project',
  }, {
    key: 'supplier',
    value: '供应商',
    sel: condExclude,
    type: 'selectTree',
    ruleType: 'supplier',
  }]
};


export const getObjValue = (list, key) => {
  let obj = {};
  list.forEach(it => {
    if (it.key === key) {
      obj={...it};
    }
  });
  return obj;
};


/* ---------- Business ----------*/
/**
 * 变量值提取
 *
 * @param {String} value
 * @param {Array} source
 * @param {Object} attributes
 * @param {String} [attributes.origin='key'] 原始key
 * @param {String} [attributes.key='value'] 提取key
 * @param {String} [attributes.format='--'] 无匹配项格式化
 * @param {String} [format='--'] 无匹配项格式化
 * @return {String}
 * @example
 *
 * const source = [
 *   { key: 'male', value: '男'},
 *   { key: 'female', value: '女'}
 * ];
 * getMapValue('male', source);
 * // => 男
 * getMapValue('other', source);
 * // => --
 */
export function getMapValue(key, map = {}, format = '--') {
  return map[key] || format;
}

export function getArrayValue(key, arr = [], format ='-') {
  let str = format;
  arr.forEach(item => {
    // eslint-disable-next-line eqeqeq
    if (item.key == key) {
      str = item.value;
    }
  });
  return str;
}

export function getArrayColor(key, arr = [], format ='-') {
  let str = format;
  arr.forEach(item => {
    if (item.key === key) {
      str = item.color;
    }
  });
  return str;
}

// 性别
export const sexMap = {
  male: '男',
  female: '女',
};

// 自定义字段的类型
export const customFields = [{
  key: '0',
  value: '单行输入框'
}, {
  key: '1',
  value: '多行输入框'
}, {
  key: '2',
  value: '单选框'
}];

export const refuseReason = [{
  key: 'o1',
  value: '发票抬头有误',
}, {
  key: 'o2',
  value: '票务不符合财务规范',
}, {
  key: 'o3',
  value: '报销内容与发票不符',
}, {
  key: 'o4',
  value: '有借款未结清',
}, {
  key: 'o5',
  value: '其他',
}];

// 工作台的选择
export const workbenchStatus = [{
  key: '1',
  value: '审批中',
}, {
  key: '2',
  value: '待发放',
}, {
  key: '7',
  value: '待核销',
}, {
  key: '0',
  value: '全部',
}];

// 单据类型
export const templateTypeList = {
  '0': '报销单',
  '1': '借款单'
};
