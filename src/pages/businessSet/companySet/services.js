import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/branch/office/list`,
  add: `${APP_API}/cost/branch/office/add`,
  detail: `${APP_API}/cost/branch/office/detail`,
  del: `${APP_API}/cost/branch/office/del`,
  edit: `${APP_API}/cost/branch/office/edit`,
  sorts: `${APP_API}/cost/branch/office/sort`,
};
