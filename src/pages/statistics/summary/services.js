import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  submitList: `${APP_API}/cost/statistics/detail/submit`,
  submitExport: `${APP_API}/cost/export/detail/submit`,
  loanList: `${APP_API}/cost/statistics/detail/loan`,
  loanExport: `${APP_API}/cost/export/detail/loan`,
  applicationList: `${APP_API}/cost/statistics/detail/application`,
  applicationExport: `${APP_API}/cost/export/detail/application`,
};
