import constants from '@/utils/constants';

const {
  APP_API,
} = constants;

export default{
  list: `${APP_API}/cost/approve/apProcessPerson/getApproveNodeInfo`,
  add: `${APP_API}/cost/approve/apProcessPerson/saveApproveNodes`,
  edit: `${APP_API}/cost/approve/apProcessPerson/updateProcessName`, // 修改模板名称
  approvalList: `${APP_API}/cost/approve/apProcessPerson/getApproveProcessPersonList`, // 审批流列表
};
