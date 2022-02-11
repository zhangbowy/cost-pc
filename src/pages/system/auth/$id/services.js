import constants from '@/utils/constants';

const { APP_API } = constants;
export default {
  detail: `${APP_API}/cost/role/detailByPurview`,
  add: `${APP_API}/cost/role/setUpUser`,
  list: `${APP_API}/cost/role/roleUserList`,
  del: `${APP_API}/cost/role/roleUserDel`,
  menu: `${APP_API}/cost/menu/nav`,
  userIdList: `${APP_API}/cost/role/dingUserIdList`,
  roleLists: `${APP_API}/cost/role/ding/role/list`,
  addddRole: `${APP_API}/cost/role/syn/ding/role`,

};
