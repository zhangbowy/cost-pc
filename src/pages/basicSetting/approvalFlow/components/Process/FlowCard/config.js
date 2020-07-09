export default {
  start: {
    nodeType: 'start',
    content: '所有人',
    bizData: { title: '发起人', initiator: 'ALL' }
  },
  approver: {
    nodeType: 'approver',
    content: '请设置审批人',
    name: '审批人',
    bizData: { approveNode: {}, }
  },
  notifier:{
    nodeType: 'notifier',
    content: '请设置抄送人',
    name: '抄送人',
    bizData: {
      approveNode: {
        userList: [],
      },
    }
  },
  condition: {
    nodeType: 'condition',
    content: '请设置条件',
    name: '条件',
    bizData: {
      conditionNode: {
        conditions: [],
        method: 'OR'
      }
    }
  },
  route: { nodeType: 'route', content: '条件分支', bizData: {} },
  empty: { nodeType: 'empty', content: '', bizData: {} }
};
