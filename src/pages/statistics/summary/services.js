import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  submitList: `${APP_API}/cost/statistics/detail/submit`,
  submitExport: `${APP_API}/cost/export/detail/submit`,
  loanList: `${APP_API}/cost/statistics/detail/loan`,
  salaryList: `${APP_API}/cost/statistics/detail/salary`,
  loanExport: `${APP_API}/cost/export/detail/loan`,
  applicationList: `${APP_API}/cost/statistics/detail/apply`,
  applicationExport: `${APP_API}/cost/export/detail/apply`,
  salaryExport: `${APP_API}/cost/export/detail/salary`,
  thirdList: `${APP_API}/cost/statistics/detail/third`,
  thirdExport: `${APP_API}/cost/export/detail/third`,
  historyList: `${APP_API}/cost/excel/list`,
  del: `${APP_API}/cost/excel/deleteImportExcel`,
  submit: `${APP_API}/cost/statistics/modifyMonth/submit`,
  statisticsDimension:`${APP_API}/cost/setting/detail`,
  incomeList: `${APP_API}/cost/income/statistics/detail/income`
};
