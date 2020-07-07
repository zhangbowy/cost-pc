import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/approve/role/userList`,
  del: `${APP_API}/cost/approve/role/delUser`,
  add: `${APP_API}/cost/approve/role/addUser`,
  edit: `${APP_API}/cost/approve/role/editUser`,
  detail: `${APP_API}/cost/approve/role/userDetail`,
};
