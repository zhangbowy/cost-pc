import constants from '@/utils/constants';

const { APP_API } = constants;
export default {
  detail: `${APP_API}/cost/invoice/template/detail`,
  add: `${APP_API}/cost/invoice/template/add`,
  list: `${APP_API}/cost/invoice/template/list`,
  del: `${APP_API}/cost/invoice/template/del`,
  addGroup: `${APP_API}/cost/invoice/template/addGroup`,
  editGroup: `${APP_API}/cost/invoice/template/editGroup`,
  edit: `${APP_API}/cost/invoice/template/edit`,
  delPer: `${APP_API}/cost/invoice/template/checkDel`,
  approve: `${APP_API}/cost/approve/apProcessPerson/getApproveProcessPersonList`,
  delCheck: `${APP_API}/cost/invoice/template/checkDelExpand`,
};
