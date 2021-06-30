import constants from '@/utils/constants';

const { APP_API } = constants;
export default {
  query: `${APP_API}/cost/setting/detail`,
  change: `${APP_API}/cost/setting/edit`,
};
