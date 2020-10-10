import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/currency/list`,
  del: `${APP_API}/cost/currency/modify`,
  add: `${APP_API}/cost/approve/role/add`,
  edit: `${APP_API}/cost/approve/role/edit`,
  detail: `${APP_API}/cost/approve/role/detail`,
};
