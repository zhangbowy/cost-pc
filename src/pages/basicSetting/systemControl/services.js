import constants from '@/utils/constants';

const { APP_API } = constants;
export default {
  query: `${APP_API}/cost/manage/querySysSwitch`,
  change: `${APP_API}/cost/manage/modifyInvoice`,
};
