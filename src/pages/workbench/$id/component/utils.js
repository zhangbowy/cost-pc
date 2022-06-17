/* eslint-disable no-nested-ternary */
import React from 'react';
import moment from 'moment';
import { Tooltip } from 'antd';
import { changeDefaultStr } from '@/utils/constants';
import { getTimeIdNo, setTime } from '@/utils/common';

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
        }else if (item === 'fileUrl') {
          const file = hisParams[item] ? hisParams[item].map(it => it.fileId) : [];
          const newFile = params[item] ? params[item].map(it => it.fileId) : [];
          if (JSON.stringify(file) !== JSON.stringify(newFile)) {
            Object.assign(newParams, { [item]: params[item] });
          }
        }else if (item === 'ossFileUrl') {
          const ossFile = hisParams[item] ? hisParams[item].map(it => it.fileUrl) : [];
          const newOssFile = params[item] ? params[item].map(it => it.fileUrl) : [];
          if (JSON.stringify(ossFile) !== JSON.stringify(newOssFile)) {
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
  handleAliTrip: ({ costArr, invoiceArr }, arr, auth) => {
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
    let fields = [{
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
    }];
    if (auth.alitripSetting && auth.alitripSetting.isEnable) {
      fields = [...fields, {
        field: 'fellowTravelers',
        label: '同行人',
        type: 'TreeSelect',
        options: arr,
        formItemLayout,
        required: false,
        otherProps: {
          placeholder: '请选择',
          style: {width: '100%'},
          dropdownStyle: {height: '300px'},
          treeCheckable: true,
          getPopupContainer: triggerNode => triggerNode.parentNode,
          showSearch: true,
        }
      }, {
        field: 'alitripExpensesOwner',
        type: 'Select',
        label: (
          <span>
            <span>费用归属</span>
            <Tooltip
              title={(
                <>
                  <p>·按分摊计入：商旅订单有除申请人之外的其他同行人，费用归属按照对应承担金额分别统计</p>
                  <p>·均计入申请人：无论是否有同行人(分摊)，该申请单的行程费用均计入申请人及其部门</p>
                </>
              )}
            >
              <i className="iconfont iconshuomingwenzi c-black-36 m-l-4 m-r-4" style={{ verticalAlign: 'middle' }} />
            </Tooltip>
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
    }
    return fields;
  },
  handleCost: (costDetailsVo, id) => {
    const arr = [];
    costDetailsVo.forEach((item, index) => {
      const obj = {
        id: item.id || '',
        key: item.key || getTimeIdNo(),
        'categoryId': item.categoryId,
        'icon': item.icon,
        'categoryName': item.categoryName,
        'costSum': (((item.costSum) * 1000)/10).toFixed(0),
        'note': item.note,
        'costDate':item.costDate,
        'startTime':item.startTime || '',
        'endTime':item.endTime || '',
        'imgUrl':item.imgUrl,
        'invoiceBaseId':id,
        costDetailShareVOS: [],
        currencyId: item.currencyId,
        currencyName: item.currencyName,
        expandCostDetailFieldVos: item.expandCostDetailFieldVos,
        selfCostDetailFieldVos: item.selfCostDetailFieldVos,
        detailFolderId: item.detailFolderId || '',
        attribute: item.attribute,
        exceedMessage: item.exceedMessage || '',
        exceedContents: item.exceedContents || [],
        fileUrl: item.fileUrl || [],
        ossFileUrl: item.ossFileUrl || [],
        officeId: item.officeId || '',
      };
      if (item.flightLevel || (item.flightLevel === 0)) {
        Object.assign(obj, {
          flightLevel: item.flightLevel
        });
      }
      if (item.trainLevel || (item.trainLevel === 0)) {
        Object.assign(obj, {
          trainLevel: item.trainLevel
        });
      }
      if (item.belongCity) {
        Object.assign(obj, {
          belongCity: item.belongCity,
        });
      }
      if (item.userCount) {
        Object.assign(obj, {
          userCount: item.userCount,
        });
      }
      arr.push(obj);
      if (item.costDetailShareVOS) {
        item.costDetailShareVOS.forEach(it => {
          arr[index].costDetailShareVOS.push({
            id: it.id || '',
            key: it.key || getTimeIdNo(),
            'shareAmount': Number(((it.shareAmount * 1000)/10).toFixed(0)),
            'shareScale': Number(((it.shareScale * 1000)/10).toFixed(0)),
            'deptId': it.deptId,
            'userId': it.userId,
            dingUserId: it.users && it.users.length ?
              it.users[0].userId : it.dingUserId ? it.dingUserId : '',
            'userJson':it.users || it.userJson,
            deptName: it.deptName,
            userName: it.userName,
            projectId: it.projectId,
            exceedContents: it.exceedContents || [],
          });
        });
      }
    });
    return arr;
  },
  onInitKey: (arr) => {
    const newArr = [];
    arr.forEach((item, i) => {
      const obj = {
        ...item,
        key: (getTimeIdNo()+i),
        costSum: item.costSum/100,
        shareTotal: item.costDetailShareVOS.length ? item.costSum/100 : 0,
      };
      if (item.costDetailShareVOS) {
        const newShare = [];
        item.costDetailShareVOS.forEach((it, index) => {
          newShare.push({
            ...it,
            key: `${getTimeIdNo()}_chid${index}`,
            shareScale: it.shareScale ? it.shareScale/100 : 0,
            shareAmount: it.shareAmount/100,
          });
        });
        Object.assign(obj, {
          costDetailShareVOS: newShare,
        });
      }
      newArr.push(obj);
    });
    console.log('🚀 ~ file: utils.js ~ line 248 ~ newArr', newArr);

    return newArr;
  },
  addCostValue: ({
    costDate,
    val,
    imgUrl,
    fileUrl,
    ossFileUrl,
    shareAmount,
    details,
    lbDetail,
    costTitle,
    id,
    expandField,
    currencyId,
    currencyName,
    exchangeRate,
    currencySymbol,
    arr
  }) => {
    let detail = {
      costDate,
      fileUrl,
      ossFileUrl,
      note: val.note || '',
      costSum: val.costSum,
      categoryId: val.categoryId,
      imgUrl,
      shareTotal: shareAmount,
      categoryName: details.categoryName,
      icon: lbDetail.icon,
      detailFolderId: costTitle === 'edit' ? id : '',
      attribute: lbDetail.attribute,
      officeId: details.officeId || '',
    };
    if (val.flightLevel) {
      detail = {
        ...detail,
        flightLevel: val.flightLevel
      };
    }
    if (val.trainLevel) {
      Object.assign(detail, {
        trainLevel: val.trainLevel
      });
    }
    if (val.belongCity) {
      const len = val.belongCity.length;
      Object.assign(detail, {
        belongCity: val.belongCity.length ? val.belongCity[len-1] : '',
      });
    }
    if (val.userCount) {
      Object.assign(detail, {
        userCount: val.userCount,
      });
    }
    if (val.officeId) {
      Object.assign(detail, {
        officeId: val.officeId,
      });
    }
    const expandCostDetailFieldVos = [];
    const selfCostDetailFieldVos = []; // 私有字段
    if (expandField && expandField.length > 0) {
      expandField.forEach(it => {
        let obj = {
          ...it,
        };
        if (Number(it.fieldType) !== 9) {
          obj = {
            ...obj,
            msg: Number(it.fieldType) === 5 && val[it.field] ? JSON.stringify(val[it.field]) : val[it.field],
          };
        }
        if (Number(it.fieldType) === 8) {
          obj = {
            ...obj,
            msg: val[it.field] ? val[it.field].toString() : '',
          };
        }
        if (Number(it.fieldType) === 9) {
          obj = {
            ...obj,
            msg: it.note,
          };
        }
        if (Number(it.fieldType) === 5 && val[it.field]) {
          Object.assign(obj, {
            startTime: Number(it.dateType) === 2 ?
            moment(val[it.field][0]).format('x') : moment(val[it.field]).format('x'),
            endTime: Number(it.dateType) === 2 ?
            setTime({ time: val[it.field][1], type: 'x' }) : '',
          });
        }
        if (it.status && it.field.indexOf('expand_') > -1) {
          expandCostDetailFieldVos.push(obj);
        } else if (it.status) {
          selfCostDetailFieldVos.push(obj);
        }
      });
    }
    if (costDate === 1) {
      detail = {
        ...detail,
        startTime: val.time ? moment(val.time).format('x') : ''
      };
    }
    if (costDate === 2) {
      if (val.time && val.time.length > 0) {
        detail = {
          ...detail,
          startTime: moment(val.time[0]).format('x'),
          endTime: moment(val.time[1]).format('x')
        };
      }
    }

    detail = {
      ...detail,
      expandCostDetailFieldVos,
      selfCostDetailFieldVos,
      costDetailShareVOS: arr,
      currencyId,
      currencyName,
      exchangeRate,
      currencySymbol,
      key: detail.key ? detail.key : getTimeIdNo(),
    };
    console.log('detail', detail);
    return detail;
  },
  handleExceed: (costDetailsVo, checkStandard) => {
    const newArr = [];
    costDetailsVo.forEach(item => {
      let obj = { ...item,costSum: item.costSum/100,
        shareTotal: item.costDetailShareVOS.length ? item.costSum/100 : 0, };
      if (checkStandard.second[item.key] && checkStandard.second[item.key].length) {
        obj = { ...obj, exceedMessage: checkStandard.second[item.key].join('；') };
      } else {
        obj = { ...obj, exceedMessage: '' };
      }
      const arr = [];
      if (checkStandard.exceedContents && checkStandard.exceedContents[item.key]) {
        obj = {...obj, exceedContents: checkStandard.exceedContents[item.key].exceedContents};
        const shares = checkStandard.exceedContents[item.key].shares || {};
        if (item.costDetailShareVOS) {
          item.costDetailShareVOS.forEach(it => {
            if (shares[it.key]) {
              arr.push({ ...it, exceedContents: shares[it.key],shareScale: it.shareScale ? it.shareScale/100 : 0,
                shareAmount: it.shareAmount/100, });
            } else {
              arr.push({ ...it, exceedContents: [],shareScale: it.shareScale ? it.shareScale/100 : 0,
                shareAmount: it.shareAmount/100, });
            }
          });
          obj = {...obj, costDetailShareVOS: arr};
        }
      } else if (item.costDetailShareVOS) {
        item.costDetailShareVOS.forEach(it => {
          arr.push({ ...it, exceedContents: [],shareScale: it.shareScale ? it.shareScale/100 : 0,
            shareAmount: it.shareAmount/100, });
        });
        obj = {...obj, costDetailShareVOS: arr};
      }
      newArr.push(obj);
    });
    console.log('🚀 ~ file: utils.js ~ line 399 ~ newArr', newArr);

    return newArr;
  },
  // handleChildren(tree, arr){
  //   for(i=0; i<tree.length; i++) {
  //     let obj = tree[i];
  //     if (obj.type) {
  //       arr.push(obj);
  //     } else {

  //     }
  //   }
  // },
  // checkInvoice: ({ first, third }) => {
  //   let flag = 0;
  //   switch(first) {
  //     case -1:
  //       flag = true;
  //     break;
  //     case 0:
  //       flag = false;
  //     break;
  //     case 1:
  //       flag = false;
  //     default:
  //       break;
  //   }
  // }
};
