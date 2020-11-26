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

