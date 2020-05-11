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
