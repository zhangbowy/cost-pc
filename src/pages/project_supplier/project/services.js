import constants from '@/utils/constants';

const {
  APP_API,
} = constants;

export default{
  list: `${APP_API}/cost/project/list`,
  detail: `${APP_API}/cost/project/detail`,
  edit: `${APP_API}/cost/project/edit`,
  add: `${APP_API}/cost/project/add`,
  del: `${APP_API}/cost/project/del`,
  sort: `${APP_API}/cost/project/sort`,
};
