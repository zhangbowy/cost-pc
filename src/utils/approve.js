import { message } from 'antd';

export const adjustApprove = (approve, { loginInfo }) => {
  if (
    approve &&
    approve.autoPass &&
    approve.autoPass === 'AUTO_PASS' &&
    loginInfo
  ) {
    const r = JSON.parse(JSON.stringify(approve));
    const { dingUserId } = loginInfo;
    let parentNode = r;
    let currentNode = r.node;
    while (currentNode) {
      const { nodeType, childNode, bizData = {} } = currentNode;
      if (nodeType === 'approver') {
        const { approveNode = {} } = bizData;
        const { userList = [] } = approveNode;
        if (userList.some(({ userId }) => userId === dingUserId)) {
          approveNode.userList = userList.filter(
            ({ userId }) => userId !== dingUserId
          );
          if (!approveNode.userList.length) {
            parentNode.childNode = childNode;
            currentNode = parentNode.childNode;
          } else {
            parentNode = currentNode;
            currentNode = parentNode.childNode;
          }
        } else {
          parentNode = currentNode;
          currentNode = parentNode.childNode;
        }
      } else {
        parentNode = currentNode;
        currentNode = parentNode.childNode;
      }
    }
    return r;
  }
  return approve;
};

export const checkNode = oNode => {
  if (!oNode) {
    return true;
  }
  let { node } = oNode;
  while (node) {
    const { childNode, bizData } = node;
    if (bizData && bizData.approveNode) {
      const { approveNode: { isRequired, userList } } = bizData;
      if (isRequired && (!userList || !userList.length)) {
        message.error('请选择审批人');
        return false;
      }
    }
    node = childNode;
  }
  return true;
};

export default null;
