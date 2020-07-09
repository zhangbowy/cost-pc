import constants from '@/utils/constants';

const {
  APP_API,
} = constants;

export default{
  list: `${APP_API}/cost/project/list`,
  detail: `${APP_API}/cost/project/detail`,
  projectEdit: `${APP_API}/cost/project/edit`,
  projectAdd: `${APP_API}/cost/project/add`,
  delete: `${APP_API}/cost/project/del`,
  uploadFile: `${APP_API}/cost/project/import/projectExcel`,
  downloadFile: `${APP_API}/cost/project/export/template`,
};
