/* eslint-disable no-param-reassign */

// /system/user/id => ['/system','/system/user,'/system/user/id']
export function urlToList(url) {
  const urlList = url.split('/').filter(i => i);
  return urlList.map((_, index) => {
    return `/${urlList.slice(0, index + 1).join('/')}`;
  });
}

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
