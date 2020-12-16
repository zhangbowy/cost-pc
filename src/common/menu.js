// {
// const menuData = [
//   {
//     id: 'workbench',
//     name: '工作台',
//     myIcon: 'icongongzuotai',
//     path: 'workbench',
//   },{
//     id: 'borrowering',
//     name: '借款管理',
//     myIcon: 'icongongzuotai',
//     path: 'borrowering',
//   },{
//     id: 'redirect',
//     name: '中转页',
//     myIcon: 'icongongzuotai',
//     path: 'redirect',
//   },
//   {
//     id: 'payment',
//     name: '付款',
//     myIcon: 'iconbaoxiaodanguanli',
//     path: 'payment',
//     children: [{
//       id: 'payment_invoicePay',
//       name: '报销付款',
//       path: 'invoicePay'
//     }, {
//       id: 'payment_borrowPay',
//       name: '借款付款',
//       path: 'borrowPay'
//     },{
//       id: 'payment_batch',
//       name: '付款批次',
//       path: 'batch',
//     }],
//   },
  // {
  //   id: 'product_supplier',
  //   name: '项目/供应商',
  //   myIcon: 'xiangmugongyingshang',
  //   path: 'project_supplier',
  //   children: [{
  //     id: 'product_supplier_product',
  //     name: '项目',
  //     path: 'project'
  //   }, {
  //     id: 'product_supplier_supplier',
  //     name: '供应商',
  //     path: 'supplier'
  //   }]
  // },
//   {
//     id: 'statistics',
//     name: '支出费用明细',
//     myIcon: 'iconzhichufeiyongtongji',
//     path: 'statistics',
//   },
  // {
  //   id: 'basicSetting',
  //   name: '基础设置',
  //   myIcon: 'iconjichushezhi',
  //   path: 'basicSetting',
  //   children: [{
  //     id: 'basicSetting_costCategory',
  //     name: '费用类别',
  //     path: 'costCategory',
  //   }, {
  //     id: 'basicSetting_payAccount',
  //     name: '付款账户',
  //     path: 'payAccount',
  //   }, {
  //     id: 'basicSetting_receiptAccount',
  //     name: '收款账户',
  //     path: 'receiptAccount',
  //   }, {
  //     id: 'basicSetting_invoice',
  //     name: '单据模板',
  //     path: 'invoice',
  //   }, {
  //     id: 'basicSetting_approvalFlow',
  //     name: '审批流',
  //     path: 'approvalFlow',
  //   },{
  //     id: 'basicSetting_workpay',
  //     name: '花呗工作花',
  //     path: 'workpay',
  //   },{
  //     id: 'basicSetting_currency',
  //     name: '多币种与汇率',
  //     path: 'currency',
  //   }, {
  //     id: 'basicSetting_controller',
  //     name: '控制中心',
  //     path: 'controller',
  //   }],
  // },
  // {
  //   id: 'system',
  //   name: '系统设置',
  //   myIcon: 'iconxitongshezhi',
  //   path: 'system',
  //   children: [{
  //     id: 'system_auth',
  //     name: '权限设置',
  //     path: 'auth',
  //   }, {
  //     id: 'system_peopleSetting',
  //     name: '名额配置',
  //     path: 'peopleSetting',
  //   }, {
  //     id: 'system_approve',
  //     name: '审批角色',
  //     path: 'approve',
  //   }],
  // }
// ];
// }
const menuData = [
  {
    id: 'workbench',
    name: '工作台',
    myIcon: 'icongongzuotai',
    path: 'workbench',
  },{
    id: 'payment',
    name: '财务',
    myIcon: 'iconbaoxiaodanguanli',
    path: 'payment',
    children:[{
      id: 'payment_invoicePay',
      name: '报销单支付',
      path: 'invoicePay'
    }, {
      id: 'payment_borrowPay',
      name: '借款单支付',
      path: 'borrowPay'
    },{
      id: 'payment_batch',
      name: '对账批次',
      path: 'batch',
    },{
      id: 'payment_borrowering',
      name: '借款管理',
      myIcon: '',
      path: 'borrowering',
    }]
  },{
    id: 'redirect',
    name: '中转页',
    myIcon: 'icongongzuotai',
    path: 'redirect',
  },{
    id: 'statistics',
    name: '统计',
    myIcon: 'iconzhichufeiyongtongji',
    path: 'statistics',
    children: [{
      id: 'statistics_overview',
      name: '统计概览',
      myIcon: '',
      path: 'overview',
    }, {
      id: 'statistics_summary',
      name: '台账汇总',
      myIcon: '',
      path: 'summary',
    }, {
      id: 'statistics_department',
      name: '部门支出表',
      myIcon: '',
      path: 'department',
    }, {
      id: 'statistics_classify',
      name: '费用类别支出表',
      myIcon: '',
      path: 'classify',
    }, {
      id: 'statistics_project',
      name: '项目支出表',
      myIcon: '',
      path: 'project',
    }, {
      id: 'statistics_supplier',
      name: '供应商支出表',
      myIcon: '',
      path: 'supplier',
    }, {
      id: 'statistics_people',
      name: '员工支出表',
      myIcon: '',
      path: 'people',
    }, {
      id: 'statistics_costDetail',
      name: '支出费用明细',
      myIcon: '',
      path: 'costDetail',
    }]
  },{
    id: 'basicSettings',
    name: '设置',
    myIcon: 'iconxitongshezhi',
    path: 'basicSettings',
  },
  {
    id: 'basicSetting',
    name: '基础设置',
    myIcon: 'iconjichushezhi',
    path: 'basicSetting',
    children: [{
      id: 'basicSetting_costCategory',
      name: '费用类别',
      path: 'costCategory',
    }, {
      id: 'basicSetting_payAccount',
      name: '付款账户',
      path: 'payAccount',
    }, {
      id: 'basicSetting_receiptAccount',
      name: '收款账户',
      path: 'receiptAccount',
    }, {
      id: 'basicSetting_invoice',
      name: '单据模板',
      path: 'invoice',
    }, {
      id: 'basicSetting_approvalFlow',
      name: '审批流',
      path: 'approvalFlow',
    },{
      id: 'basicSetting_workpay',
      name: '花呗工作花',
      path: 'workpay',
    },{
      id: 'basicSetting_currency',
      name: '多币种与汇率',
      path: 'currency',
    }, {
      id: 'basicSetting_controller',
      name: '控制中心',
      path: 'controller',
    }, {
      id: 'basicSetting_Initialization',
      name: '数据初始化',
      path: 'Initialization',
    }],
  },
  {
    id: 'system',
    name: '系统设置',
    myIcon: 'iconxitongshezhi',
    path: 'system',
    children: [{
      id: 'system_auth',
      name: '权限设置',
      path: 'auth',
    }, {
      id: 'system_peopleSetting',
      name: '名额配置',
      path: 'peopleSetting',
    }, {
      id: 'system_approve',
      name: '审批角色',
      path: 'approve',
    }],
  },
  {
    id: 'productSupplier',
    name: '项目/供应商',
    myIcon: 'xiangmugongyingshang',
    path: 'projectSupplier',
    children: [{
      id: 'productSupplier_product',
      name: '项目',
      path: 'project'
    }, {
      id: 'productSupplier_supplier',
      name: '供应商',
      path: 'supplier'
    }]
  },
];
// 菜单访问路径解析
function formatter(data, parentPath = '/') {
  return data.map(item => {
    const path = parentPath + item.path;
    const result = {
      ...item,
      path,
    };
    if (item.children && item.children.length > 0) {
      result.children = formatter(item.children, `${path}/`);
    }
    return result;
  });
}

export default formatter(menuData);
