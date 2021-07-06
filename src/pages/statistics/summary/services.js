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
};
