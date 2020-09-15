import constants from '@/utils/constants';

const { APP_API } = constants;
export default {
  getTime: `${APP_API}/cost/manage/query/time`,
  del: `${APP_API}/cost/manage/invoice/del`,
  delCompany: `${APP_API}/cost/manage/synCompany`,
  queryUsers: `${APP_API}/cost/manage/queryUsers`,
  modifyGrant: `${APP_API}/cost/manage/modifyGrant`,
  getCompanyAuthResult: `${APP_API}/cost/workPay/getCompanyAuthResult`,
  exportTemplate: `${APP_API}/cost/export/userInfo/template`,
  userInfoExcel: `${APP_API}/cost/workPay/import/userInfoExcel`,
  failData: `${APP_API}/cost/export/userInfo/failData`,
  getImportInfo: `${APP_API}/cost/workPay/getImportInfo`,
  getAuthUrl: `${APP_API}/cost/workPay/getAuthUrl`,
  complete: `${APP_API}/cost/workPay/complete`,
};
