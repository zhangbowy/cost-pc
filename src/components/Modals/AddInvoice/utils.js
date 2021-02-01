import moment from 'moment';
import { changeDefaultStr } from '../../../utils/constants';

export default {
  range: (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  },
  disabledDate: (current) => {
    // Can not select days before today and today
    return current && current < moment(new Date()).subtract(1, 'day');
  },
  disabledDateTime: () => {
    return {
      disabledHours: () => this.range(0, 24).splice(4, 20),
      disabledMinutes: () => this.range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  },
  compareParams: (obj) => {
    const { hisCostDetailsVo, hisParams, params, costDetailsVo, templateType } = obj;
    console.log('costDetailsVo', costDetailsVo);
    console.log('hisCostDetailsVo', hisCostDetailsVo);
    let newParams = {
      id: params.id,
      expandSubmitFieldVos: params.expandSubmitFieldVos,
      selfSubmitFieldVos: params.selfSubmitFieldVos,
    };
    const costDetailEditVos = [];
    const costDetailIds = [];

    if (JSON.stringify(hisCostDetailsVo) !== JSON.stringify(costDetailsVo) && !Number(templateType)) {
      const newCostDetailsVo = params.costDetailsVo;
      const historyDetail = hisParams.costDetailsVo;
      const newIds = [];
      newCostDetailsVo.forEach(item => {
        if (item.id) {
          const news = costDetailsVo.filter(it => it.id === item.id)[0];
          const old = hisCostDetailsVo.filter(it => it.id === item.id)[0];
          if (JSON.stringify(old) !== JSON.stringify(news)) {
            costDetailEditVos.push(item);
          }
          newIds.push(item.id);
        } else {
          costDetailEditVos.push(item);
        }
      });
      historyDetail.forEach(item => {
        if (!newIds.includes(item.id)) {
          costDetailIds.push(item.id);
        }
      });
    }
    changeDefaultStr[templateType].forEach(item => {
      if (hisParams[item] !== params[item]) {
        Object.assign(newParams, { [item]: params[item] });
      }
    });
    if (!Number(templateType)) {
      newParams = {...newParams, costDetailEditVos, costDetailIds};
    }
    return {...newParams};
  }
};
