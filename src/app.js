import { message } from 'antd';
import constants from '@/utils/constants';

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      if (!window.APPSSO.httpCheck(err)) {
        return;
      }
      if (err.message === 'Failed to fetch') {
        err.message = '';
      }
      message.error(err.message || constants.ERR_MSG);
    },
  },
};
