import constants from '@/utils/constants';

const {
  APP_API,
} = constants;

export default{
  list: `${APP_API}/cost/approve/apProcessPerson/getApproveNodeInfo`,
  add: `${APP_API}/cost/approve/apProcessPerson/saveApproveNodes`,
};
