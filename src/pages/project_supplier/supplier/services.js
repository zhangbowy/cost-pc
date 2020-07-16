import constants from '@/utils/constants';

const {
  APP_API,
} = constants;

export default{
  list: `${APP_API}/cost/supplier/list`,
  detail: `${APP_API}/cost/supplier/detail`,
  edit: `${APP_API}/cost/supplier/edit`,
  add: `${APP_API}/cost/supplier/add`,
  del: `${APP_API}/cost/supplier/del`
};
