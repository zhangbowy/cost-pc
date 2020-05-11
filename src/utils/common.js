
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
