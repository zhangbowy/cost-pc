import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  authorize: `${APP_API}/cost/assets/authorization`,
  save: `${APP_API}/cost/assets/typeRef`,
  assetsList: `${APP_API}/cost/assets/assetsType`,
  list: `${APP_API}/cost/assets/typeRef`
};
