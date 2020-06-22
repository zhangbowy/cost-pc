/**
 * 权限相关操作
 *
 */

// 权限查找
function authFind(datas = [], value) {
  let result = null;
  const find = (data) => {
    return data.find((item) => {
      if (item.id === value) {
        result = item;
        return true;
      }
      if (item.children && item.children.length > 0) {
        return find(item.children);
      }
      return false;
    });
  };
  find(datas);
  return result;
}

// 菜单路径提取
function pathFilter(data) {
  for (let i = 0, iLen = data.length; i < iLen; i+=1 ) {
    if (data[i].children && data[i].children.length > 0) {
      return pathFilter(data[i].children);
    }
    return data[i].path;
  }
  return '/404';
}

// 根据菜单取得重定向地址-导航默认选中第一个菜单
export function getRedirect() {
  const state = window.g_app._store.getState();
  return pathFilter(state.session.menus);
}

// 权限校验
export function authCheck(path, men) {
  // debug
  let menus = [];
  console.log(men);
  if (window.g_app._store.getState().session.menus && window.g_app._store.getState().session.menus.length > 0) {
    menus = window.g_app._store.getState().session.menus;
  } else {
    menus = men || [];
  }
  // const menus = window.g_app._store.getState().session.menus || menu;
  let withAuth = false;
  let router = '';
  switch (path) {
  case '/forbidden':
      withAuth = true;
      break;
  default:
      router = path;
  }
  if (router !== '') {
      withAuth = menus.some((el) => {
          if (el.url === router) return true;
          return false;
      });
  }

  return withAuth;
}

// 菜单过滤-剔除没有权限的菜单
export function menuFilter(data, localData) {
  return data.filter((item) => {
    if (!authCheck(item.url)) {
      const result = authFind(localData, item.url);
      if (!result) {
        return false;
      }
      Object.assign(item, {
        path: result.path,
        icon: result.icon,
        myIcon: result.myIcon,
      });
      if (item.children && item.children.length > 0) {
        Object.assign(item, {
          children: menuFilter(item.children, localData),
        });
      }
      return true;
    }
    if (item.children && item.children.length > 0) {
      Object.assign(item, {
        children: menuFilter(item.children, localData),
      });
    }
    return true;
    // return false;
  });
}
