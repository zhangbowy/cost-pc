// import { func } from "prop-types";
import moment from 'moment';
import { debounce } from 'lodash-decorators';

export const getQueryString = (name) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const search = window.location.href.split('?')[1];
  if (search) {
    const r = search.match(reg);
    if (r !== null) {
      return decodeURIComponent(r[2]);
    }
  }
  return '';
};

export const isPreview = false;

export const isLoc = false;

export const isInDingTalk = true;

export const getAllParams = () => {

};

// 工具函数，获取树parentId
export const findIndexArray = (data, id, indexArray) => {
  const arr = Array.from(indexArray);
  for (let i = 0, len = data.length; i < len; i += 1) {
    arr.push(data[i].id);
    if (data[i].id === id) {
      return arr;
    }
    const { children } = data[i];
    if (children && children.length) {
      const result = findIndexArray(children, id, arr);
      if (result) return result;
    }
    arr.pop();
  }
  return false;
};

export const eventChange = ((() =>{
  let obj = {};
  let keyArr = [];
  let removeFun = null;
  return (fn,isClear,...arg) => {
    if(removeFun){
      window.removeEventListener('resize',removeFun);
    }
    if(isClear){
      obj = {};
      keyArr = {};
    }
    keyArr.push(1);
    obj[keyArr.length] ={};
    obj[keyArr.length].func = fn;
    obj[keyArr.length].context = this;
    obj[keyArr.length].args = arg;
    const fun = debounce(() => {
      keyArr.map((_,index) => {
        const { func , context, args } = obj[index+1];
        func.apply(context, args);
        return false;
      });
    },300);
    removeFun = () => { console.log(1111111); fun(); };
    window.addEventListener('resize',removeFun);
  };
})());

export const dateToTime = str => {
  const arr = str.split('_');
  let startTime = '';
  let endTime = '';
  if (arr[0] === '0' && arr[1] === 'm') { // 当前月
    startTime = moment().startOf('month').valueOf();
    endTime = moment().endOf('month').valueOf();
  } else if (arr[0] === '-1' && arr[1] === 'm') { // 上一个月
    startTime = moment().month(moment().month() - 1).startOf('month').valueOf();
    endTime = moment().month(moment().month() - 1).endOf('month').valueOf();
  } else if (arr[0] === '-1' && arr[1] === 'q') { // 上一个季度
    startTime = moment().quarter(moment().quarter() - 1).startOf('quarter').valueOf();
    endTime = moment().quarter(moment().quarter() - 1).endOf('quarter').valueOf();
  } else if (arr[0] === '0' && arr[1] === 'q') { // 当前季度
    startTime = moment().startOf('quarter').valueOf();
    endTime = moment().endOf('quarter').valueOf();
  } else if (arr[0] === '0' && arr[1] === 'y') { // 今年
    startTime = moment().startOf('year').valueOf();
    endTime = moment().endOf('year').valueOf();
  } else if (arr[0] === '-1' && arr[1] === 'y') { // 上年
    startTime = moment().add('y', -1).startOf('year').valueOf();
    endTime = moment().add('y', -1).endOf('year').valueOf();
  } else if (arr[1].indexOf('cm') > -1) { // 最近几个月
    startTime = moment(new Date()).subtract(arr[0] -1,'months').format('YYYY-MM-DD 00: 00: 01');
    endTime = moment().format('YYYY-MM-DD 23:59:59');
  } else if (arr[1].indexOf('cy') > -1) { // 最近一年
    startTime = moment(new Date()).subtract(1,'years').format('YYYY-MM-DD 00: 00: 01');
    endTime = moment().format('YYYY-MM-DD 23:59:59');
  }
  return {
    startTime: moment(startTime).format('x'),
    endTime: moment(endTime).format('x')
  };
};
