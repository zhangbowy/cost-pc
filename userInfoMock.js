/* eslint-disable class-methods-use-this */
const data = {
  token: '1234567890-=',
  userResponse: {
    userId: '000111222',
    userName: 'tanwei',
    realName: '谈薇',
    phone: '13456808417',
  }
};

class Sso {
  init() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    });
  }

  httpCheck() {
    return true;
  }

  checkAuth() {
    return true;
  }

  authorize() {
    return true;
  }

  getAppList() {
    return [{
      sysId: 'sso_rbac',
      name: '统一账号与权限管理',
      url: 'http://sso-web.test2.jimistore.com',
    }];
  }
}

export default new Sso();
