import constants from '@/utils/constants';

const { APP_API } = constants;

// 供应商和员工详情没写
export default {
  detail: `${APP_API}/cost/statistics/v3/pc/detail`,
  dept: `${APP_API}/cost/statistics/v3/dept/pc`,
  deptDetail: `${APP_API}/cost/statistics/v3/dept/list`,
  classifyDetail: `${APP_API}/cost/statistics/v3/category/list`,
  projectDetail: `${APP_API}/cost/statistics/v3/project/list`,
  supplierDetail: `${APP_API}/cost/statistics/v3/supplier/list`,
  peopleDetail: `${APP_API}/cost/statistics/v3/staff/list`,
  classify: `${APP_API}/cost/statistics/v3/category/pc`,
  project: `${APP_API}/cost/statistics/v3/project/pc`,
  supplier: `${APP_API}/cost/statistics/v3/supplier/pc`,
  people: `${APP_API}/cost/statistics/v3/staff/pc`,
  exports: `${APP_API}/cost/export/v3/statistics`,
  chart: `${APP_API}/cost/statistics/v3/project/category`,
  supplierChart: `${APP_API}/cost/statistics/v3/supplier/pie/chart`,
  deptExport: `${APP_API}/cost/export/dept/pc`,
  classifyExport: `${APP_API}/cost/export/category/pc`,
  projectExport: `${APP_API}/cost/export/project/pc`,
  peopleExport: `${APP_API}/cost/export/staff/pc`,
  supplierExport: `${APP_API}/cost/export/supplier/pc`,
  office: `${APP_API}/cost/statistics/v3/office/pc`, // 分公司列表
  officeExport: `${APP_API}/cost/export/office/pc`, // 分公导出
  officeDetail: `${APP_API}/cost/statistics/v3/office/list`,
  setDetail: `${APP_API}/cost/userSetting/detail`,
  set: `${APP_API}/cost/userSetting/edit`,
};
