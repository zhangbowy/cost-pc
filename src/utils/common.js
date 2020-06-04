
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
