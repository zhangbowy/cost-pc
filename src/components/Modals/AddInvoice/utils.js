import React from 'react';
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
    console.log('params', params);
    console.log('hisParams', hisParams);
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
        if (item === 'imgUrl') {
          const imgs = hisParams[item] ? hisParams[item].map(it => it.imgUrl) : [];
          const newImg = params[item] ? params[item].map(it => it.imgUrl) : [];
          if (JSON.stringify(imgs) !== JSON.stringify(newImg)) {
            Object.assign(newParams, { [item]: params[item] });
          }
        } else {
          Object.assign(newParams, { [item]: params[item] });
        }
      }
    });
    if (!Number(templateType)) {
      newParams = {...newParams, costDetailEditVos, costDetailIds};
    }
    return {...newParams};
  },
  handleAliTrip: ({ costArr, invoiceArr }) => {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    };
    const fields = [{
      field: 'alitripCostCenterId',
      label: '成本中心',
      type: 'Select',
      options: costArr,
      formItemLayout,
    }, {
      field: 'alitripInvoiceTitleId',
      label: '发票抬头',
      type: 'Select',
      options: invoiceArr,
      formItemLayout,
    }, {
      field: 'fellowTravelers',
      label: '同行人',
      type: 'Select',
      options: costArr,
      formItemLayout,
      required: false,
    }, {
      field: 'alitripExpensesOwner',
      type: 'Select',
      label: (
        <span>
          <span>费用归属</span>
          <i className="iconfont iconshuomingwenzi c-black-36 m-l-4 m-r-4" style={{ verticalAlign: 'middle' }} />
        </span>
      ),
      options: [{
        label: '按分摊计入',
        value: '按分摊计入',
      }, {
        label: '均计入申请人',
        value: '均计入申请人',
      }],
      formItemLayout,
    }];
    return fields;
  }
};
