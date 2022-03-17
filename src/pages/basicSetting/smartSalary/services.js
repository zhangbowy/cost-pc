import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  authorize: `${APP_API}/cost/smartSalary/authorization`,
  save: `${APP_API}/cost/smartSalary/typeRef`,
  assetsList: `${APP_API}/cost/smartSalary/type`,
  list: `${APP_API}/cost/assets/typeRef`,
  del: `${APP_API}/cost/smartSalary/deleteTypeRef`,
  edit: `${APP_API}/cost/smartSalary/editTypeRef`,
  add: `${APP_API}/cost/smartSalary/typeRef`,
};
