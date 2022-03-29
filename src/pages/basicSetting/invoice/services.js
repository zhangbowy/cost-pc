import constants from '@/utils/constants';

const { APP_API } = constants;
export default {
  detail: `${APP_API}/cost/invoice/template/detail`,
  add: `${APP_API}/cost/invoice/template/add`,
  list: `${APP_API}/cost/invoice/template/list`,
  del: `${APP_API}/cost/invoice/template/del`,
  delIncome: `${APP_API}/cost/income/template/del`,
  addGroup: `${APP_API}/cost/invoice/template/addGroup`,
  addIncomeGroup: `${APP_API}/cost/income/template/addGroup`,
  editGroup: `${APP_API}/cost/invoice/template/editGroup`,
  editIncomeGroup: `${APP_API}/cost/income/template/editGroup`,
  copyGroup: `${APP_API}/cost/invoice/template/copy`,
  copyIncomeGroup: `${APP_API}/cost/income/template/copy`,
  edit: `${APP_API}/cost/invoice/template/edit`,
  delPer: `${APP_API}/cost/invoice/template/checkDel`,
  approve: `${APP_API}/cost/approve/apProcessPerson/getApproveProcessPersonList`,
  delCheck: `${APP_API}/cost/invoice/template/checkDelExpand`,
  expandLists: `${APP_API}/cost/invoice/template/queryExpand`,
  sorts: `${APP_API}/cost/invoice/template/sort`,
};
