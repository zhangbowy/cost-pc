const mockjs = require('mockjs');

export default {
  'GET /api/rbac/service/menuPlusV2/leftMenu/v1': (_, res) => {
    setTimeout(() => {
      res.send({
        code: '200',
        data: [{
          id: 'list',
          name: '列表',
          children: [{
            id: 'list_basic',
            name: '查询列表',
          }, {
            id: 'list_basicEditFecth',
            name: '查询列表2',
          }, {
            id: 'list_basicMultiple',
            name: '高级搜索列表',
          }]
        }, {
          id: 'storageList',
          name: '记忆列表',
          children: [{
            id: 'storageList_basic',
            name: '查询列表',
          }, {
            id: 'storageList_basicDate',
            name: '时间查询列表',
          }, {
            id: 'storageList_basicMultiple',
            name: '高级搜索列表',
          }]
        }],
      });
    }, 1000);
  },
  'POST /api/service/add': (_, res) => {
    setTimeout(() => {
      res.send({
        code: '200',
        data: '成功',
      });
    }, 1000);
  },
  'POST /api/service/update': (_, res) => {
    setTimeout(() => {
      res.send({
        code: '200',
        data: '成功',
      });
    }, 1000);
  },
  'POST /api/service/delete': (_, res) => {
    setTimeout(() => {
      res.send({
        code: '200',
        data: '成功',
      });
    }, 1000);
  },
  'POST /api/service/getEmployeeList': (_, res) => {
    setTimeout(() => {
      res.send(mockjs.mock({
        code: '200',
        'data|10': [{
          id: '@id',
          name: '@cname',
          phone: /1\d{10}/,
          email: '@email',
          idcard: '@id',
          address: '@city(true)',
          'sex|1': ['male', 'female'],
          entryTime: '@date',
        }],
      }));
    }, 1000);
  },
  'POST /api/service/getEmployeeDetail': (_, res) => {
    setTimeout(() => {
      res.send(mockjs.mock({
        code: '200',
        data: {
          id: '@id',
          name: '@cname',
          phone: /1\d{10}/,
          email: '@email',
          idcard: '@id',
          address: '@city(true)',
          'sex|1': ['male', 'female'],
          entryTime: '@date',
        },
      }));
    }, 1000);
  },
};
