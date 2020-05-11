import constants from '@/utils/constants';

const {
  SSO_API,
  APP_API,
} = constants;

export default {
  /* ---------- sso ----------*/
  // 获取左侧菜单
  getLeftMenu: `${SSO_API}/api/rbac/service/menuPlusV2/leftMenu/v1`,

  /* ---------- business ----------*/
  add: `${APP_API}/api/service/add`,
  update: `${APP_API}/api/service/update`,
  delete: `${APP_API}/api/service/delete`,
  getUserList: `${APP_API}/api/service/getUserList`,
  getEmployeeList: `${APP_API}/api/service/getEmployeeList`,
  getEmployeeDetail: `${APP_API}/api/service/getEmployeeDetail`,
};
