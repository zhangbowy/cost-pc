import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/role/list`,
  add: `${APP_API}/cost/role/add`,
  del: `${APP_API}/cost/role/del`,
  edit: `${APP_API}/cost/role/edit`,
  detail: `${APP_API}/cost/role/detailByPurview`,
  roleList: `${APP_API}/cost/role/detailByPurview`,
  setUser: `${APP_API}/cost/role/setUpUser`,
  roleUserList: `${APP_API}/cost/role/roleUserList`,
  roleUserDel: `${APP_API}/cost/role/roleUserDel`,
  menu: `${APP_API}/cost/menu/nav`,
};
