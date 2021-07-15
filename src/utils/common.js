/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
import moment from 'moment';
import { condExclude, condThan } from './constants';

const conditionType = {
  'condition_creator_user_dept': {
    type: 'people',
    ruleType: 'people',
  },
  'condition_bear_user_dept': {
    type: 'people',
    ruleType: 'people',
  },
  'cost_category': {
    type: 'selectTree',
    ruleType: 'category',
  },
  'invoice_submit_sum': {
    type: 'inputNumber',
    ruleType: 'submit_sum',
  },
  'cost_detail': {
    type: 'inputNumber',
    ruleType: 'detail_sum',
  },
  'project': {
    type: 'selectTree',
    ruleType: 'project',
  },
  'supplier': {
    type: 'selectTree',
    ruleType: 'supplier',
  },
  'loan_detail': {
    type: 'inputNumber',
    ruleType: 'loan_amount',
  },
  'application_sum': {
    type: 'inputNumber',
    ruleType: 'application_sum',
  },
  'salary_amount': {
    type: 'inputNumber',
    ruleType: 'salary_amount',
  },
  'other': {
    type: 'select',
    ruleType: 'other',
  }
};
// /system/user/id => ['/system','/system/user,'/system/user/id']
export function urlToList(url) {
  const urlList = url.split('/').filter(i => i);
  console.log('urlToList -> urlList', urlList.map((_, index) => {
    return `/${urlList.slice(0, index + 1).join('/')}`;
  }));
  return urlList.map((_, index) => {
    return `/${urlList.slice(0, index + 1).join('/')}`;
  });
}

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
};

// antd列数据配置
export function setColumns(data = [], w = 120) {
  return data.map((el) => ({
    width: w,
    // render: text => stringUtil.filterNull(text, '--'),
    ...el,
  }));
}

// 空值判断
export function isNull(value) {
  if (
    value === null
    || value === undefined
    || (typeof value === 'string' && value.trim() === '')
  ) {
    return true;
  }
  return false;
}
/**
 * 非法字符校验
 * 非法字符集：【",\,\n,\t,\v】
 */
export function illegalChar(value) {
  return /["\\\n\t\v]/.test(value);
}

/**
 * 找到树中的路径
 * @param {愿数组} data
 * @param {需要遍历的id} id
 * @param {初始化数组} indexArray
 */
export function findIndexArray(data, id, indexArray){
  const arr = Array.from(indexArray);
  for (let i = 0, len = data.length; i < len; i+=1) {
    arr.push(data[i].id);
    if (data[i].id === id) {
      return arr;
    }
    const {children} = data[i];
    if (children && children.length) {
      const result = findIndexArray(children, id, arr);
      if (result) return result;
    }
    arr.pop();
  }
  return false;
}

export const DataType = (val = '', type) => {
  const typeStr = Object.prototype.toString
    .call(val)
    .match(/\[object (.*?)\]/)[1]
    .toLowerCase(0);
  return type ? type === typeStr : typeStr;
};

// 时间戳转多进制
export const timeStampToHex = (hex = 36, time = new Date().getTime()) => {
  // eslint-disable-next-line no-nested-ternary
  return (DataType(time, 'number')
    ? time : (DataType(time, 'date')
      ? time.getTime() : new Date().getTime())).toString((hex >= 36 || hex < 2) ? 36 : hex);
};


export const JsonParse = (string) => {
  let arr = [];
  try{
    arr = JSON.parse(string);
  } catch(e) {
    console.log(e);
  }
  return arr;
};

export const dataType = (val = '', type) => {
  const typeStr = Object.prototype.toString
    .call(val)
    .match(/\[object (.*?)\]/)[1]
    .toLowerCase(0);
  return type ? type === typeStr : typeStr;
};

// abtd表格勾选框操作
export const rowSelect = {
  onSelect(attributes, record, selected, key = 'id') {
      const selectedRows = [...attributes.selectedRows];
      const selectedRowKeys = [...attributes.selectedRowKeys];
      // const { key = 'id' } = attributes;

      if (selected) {
          selectedRows.push(record);
          selectedRowKeys.push(record[key]);
      } else {
          selectedRows.some((item, index) => {
              if (item[key] === record[key]) {
                  selectedRows.splice(index, 1);
                  return true;
              }
              return false;
          });

          selectedRowKeys.some((value, index) => {
              if (value === record[key]) {
                  selectedRowKeys.splice(index, 1);
                  return true;
              }
              return false;
          });
      }

      return {
          selectedRows,
          selectedRowKeys,
      };
  },
  onSelectAll(attributes, selected, changeRows, key = 'id') {
      const selectedRows = [...attributes.selectedRows];
      const selectedRowKeys = [...attributes.selectedRowKeys];
      // const { key = 'id' } = attributes;

      if (selected) {
          changeRows.forEach((item) => {
              selectedRows.push(item);
              selectedRowKeys.push(item[key]);
          });
      } else {
          changeRows.forEach((item) => {
              // eslint-disable-next-line no-plusplus
              for (let i = selectedRows.length; i--;) {
                  if (item[key] === selectedRows[i][key]) {
                      selectedRows.splice(i, 1);
                      selectedRowKeys.splice(i, 1);
                      break;
                  }
              }
          });
      }

      return {
          selectedRows,
          selectedRowKeys,
      };
  },
  onDelete(attributes, keyValue, key = 'id') {
      const selectedRows = [...attributes.selectedRows];
      const selectedRowKeys = [...attributes.selectedRowKeys];
      // const { key = 'id' } = attributes;

      selectedRows.some((item, index) => {
          if (item[key] === keyValue) {
              selectedRows.splice(index, 1);
              return true;
          }
          return false;
      });

      selectedRowKeys.some((value, index) => {
          if (value === keyValue) {
              selectedRowKeys.splice(index, 1);
              return true;
          }
          return false;
      });

      return {
          selectedRows,
          selectedRowKeys,
      };
  },
};

/**
 * 下拉树形选择框禁止一些条件
 * @param { Array } list 传入的数组
 * @memberof Conditions
 */
export const onSelectDis = (list) => {
  function addParams(lists){
    lists.forEach(it => {
      if (it.type === 0) {
        it.disabled = true;
      }
      if (it.type === 1) {
        it.disabled = false;
      }
      if (it.children) {
        addParams(it.children);
      }
    });
  }
  addParams(list);
  return list;
};

/**
 * 排序的升序、降序
 * 默认升序
 * @param { String } attr 属性
 */
export const sortBy = (attr,rev) => {
  // 第二个参数没有传递 默认升序排列
  if(rev ===  undefined){
      rev = 1;
  }else{
      rev = (rev) ? 1 : -1;
  }
  // eslint-disable-next-line func-names
  return function(a,b){
      a = a[attr];
      b = b[attr];
      if(a < b){
          return rev * -1;
      }
      if(a > b){
          return rev * 1;
      }
      return 0;
  };
};


// jsapi鉴权地址
export const PROJECTURL = {
  url: '',
  getURL () {
    if (this.url) return this.url;
    const pathname = process.env.NODE_ENV === 'production' ? '/msn' : '';
    const { origin } = window.location;
    // eslint-disable-next-line no-return-assign
    return this.url = origin + pathname;
  }
};

// sort排序
export const compare = (property) => {
  return function(a,b){
      const value1 = a[property];
      const value2 = b[property];
      return value1 - value2;
  };
};

export const arrayGroup = (array, subGroupLength) => {
  let index = 0;
  const newArray = [];
  while(index < array.length) {
      newArray.push(array.slice(index, index += subGroupLength));
  }
  return newArray;
};


export const GetRequest = (url) => {
  const theRequest = {};
  if(url.indexOf('?') !== -1){
    const str = url.substr(url.indexOf('?')+1);
    const strs=str.split('&');
    for(let i=0;i<strs.length;i++){
      console.log(strs[i]);
      const arr = strs[i].split('=');
      theRequest[arr[0]]=unescape(arr[1]);
    }
  }
  return theRequest;
};

export const isJsonString = (str) => {
  try {
    if (typeof JSON.parse(str) === 'object') {
        return true;
    }
  } catch(e) {
    console.log(e);
    return false;
  };
  return false;
};

export const setTime = ({ time }) => {
  console.log('setTime -> time', time);
  const times = moment(time).format('YYYY-MM-DD');
  return moment(times).format('x');
};

export const setMoney = (_obj = {}) => {
  const { unit, num, sum } = _obj;
  console.log('setMoney -> sum', sum);
  let res = 0;
  if (sum || (sum === 0)) {
    res = unit ? sum/unit : sum/num;
  } else {
    res = num * unit;
  }
  console.log('res', res);
  return ((res*100).toFixed(0))/100;
};

export const conditionOption = (list) => {
  const newArr = [];
  list.forEach(it => {
    newArr.push({
      key: it.field ? `${it.code}~${it.field}` : it.code,
      value: it.name,
      sel: it.type === 1 ? condExclude : condThan,
      options: it.options,
      ...conditionType[it.code],
    });
  });
  console.log('newArr', newArr);
  return newArr;
};

export const fn = ({ current, product }) => {
  const { index } = current;
  const itemExplain = [];
  let tempIndex = Number(index + 1);
  product.forEach(it => {
    if (it.indexLen === tempIndex) {
      tempIndex+=1;
      itemExplain.push({...it});
    }
  });
  if (current.index || current.index === 0) delete current.index;
  return {
    ...current,
    itemExplain,
  };
};

export const handleProduction = (list) => {
  const oldArr = list.map((it, index) => { return {...it, indexLen: index}; });
  const product = oldArr.filter(it => it.fieldType === 9);
  const newArr = [];
  list.forEach((it, index) => {
    let obj = {...it};
    if (it.fieldType !== 9) {
      obj = fn({ current: {...it, index}, product });
    }
    newArr.push(obj);
  });
  return newArr;
};

export  const handleNum = (result) => {
  if (result === '一十'){
    result = '十';
  }
  if (result.match(/^一/) && result.length === 3){
    result = result.replace('一', '');
  }
  return result;
};

export const intToChinese = ( str ) => {
  str +='';
  const len = str.length-1;
  const idxs = ['','十','百','千','万','十','百','千','亿','十','百','千','万','十','百','千','亿'];
  const num = ['零','一','二','三','四','五','六','七','八','九'];
  return str.replace(/([1-9]|0+)/g,function( $, $1, idx) {
   let pos = 0;
   if( $1[0] !== '0' ){
    pos = len-idx;
    if( idx === 0 && $1[0] === 1 && idxs[len-idx] === '十'){
     return handleNum(idxs[len-idx]);
    }
    return handleNum(num[$1[0]] + idxs[len-idx]);
   }
    const left = len - idx;
    const right = len - idx + $1.length;
    if( Math.floor(right/4) - Math.floor(left/4) > 0 ){
     pos = left - left%4;
    }
    if( pos ){
     return handleNum(idxs[pos] + num[$1[0]]);
    } if( idx + $1.length >= len ){
     return '';
    }
    return handleNum(num[$1[0]]);

  });
 };

 export const handleTime = (val) => {
   let startTime = null;
   let endTime = null;
    if (Array.isArray(val)) {
      const start = `${moment(val[0], 'YYYY-MM-DD')} 00:00:00`;
      const end = `${moment(val[1], 'YYYY-MM-DD')} 23:59:59`;
      startTime = moment(start).format('X');
      endTime = moment(end).format('X');
    }
    return {
      startTime,
      endTime,
    };
 };

 export const getTimeId = () => {
  let qutient = 10000;
  const chars = '0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz';
  const charArr = chars.split( '' );
  const radix = chars.length;
  const res = [];
  const time = timeStampToHex();
  do {
    const mod = qutient % radix;
    qutient = ( qutient - mod ) / radix;
    res.push( charArr[mod] );
  } while ( qutient );
  return `${res.join('')}_${time+1}`;

  // const time = timeStampToHex();
  // return `${nodeType}_${time+1}`;

};
