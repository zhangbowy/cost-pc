export default {
  start: {
    nodeType: 'start',
    content: '所有人',
    bizData: { title: '发起人', initiator: 'ALL' }
  },
  approver: {
    nodeType: 'approver',
    content: '请设置审批人',
    bizData: { title: '审批人' }
  },
  notifier:{
    nodeType: 'notifier',
    content: '发起人自选',
    bizData: {
      title: '抄送人',
      menbers: [],
      userOptional: true
    }
  },
  condition: {
    nodeType: 'condition',
    content: '请设置条件',
    bizData: { title: '条件', conditions: [], initiator: null }
  },
  route: { nodeType: 'route', content: '', bizData: {} },
  empty: { nodeType: 'empty', content: '', bizData: {} }
};
