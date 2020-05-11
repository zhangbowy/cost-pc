/**
 * 权限相关操作
 *
 */

// 权限查找
// function authFind(datas = [], value) {
//   let result = null;
//   const find = (data) => {
//     return data.find((item) => {
//       if (item.id === value) {
//         result = item;
//         return true;
//       }
//       if (item.children && item.children.length > 0) {
//         return find(item.children);
//       }
//       return false;
//     });
//   };
//   find(datas);
//   return result;
// }

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
  console.log(window.g_app);
  const state = window.g_app._store.getState();
  return pathFilter(state.session.menus);
}

// 权限校验
export function authCheck(app) {
  // debug
  const { menu } = app._store.getState().session;
  let withAuth = false;
  const router = '';

  // switch (filterPath(path)) {
  // case '/forbidden':
  //     withAuth = true;
  //     break;
  // default:
  //     router = path;
  // }

  if (router !== '') {
      withAuth = menu.some((el) => {
          if (el.router === router) return true;
          return false;
      });
  }

  return withAuth;
}

// 菜单过滤-剔除没有权限的菜单
export function menuFilter(data, localData) {
  return data.filter((item) => {
    // if (!authCheck(item.id)) {
    //   const result = authFind(localData, item.id);
    //   if (!result) {
    //     return false;
    //   }
    //   Object.assign(item, {
    //     path: result.path,
    //     icon: result.icon,
    //     myIcon: result.myIcon,
    //   });
    //   if (item.children && item.children.length > 0) {
    //     Object.assign(item, {
    //       children: menuFilter(item.children, localData),
    //     });
    //   }
    //   return true;
    // }
    if (item.children && item.children.length > 0) {
      Object.assign(item, {
        children: menuFilter(item.children, localData),
      });
    }
    return true;
    // return false;
  });
}
