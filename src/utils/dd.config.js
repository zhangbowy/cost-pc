import { device, biz, runtime } from 'dingtalk-jsapi';

/* eslint-disable */
class DD {
  constructor() { }
  /**
   * 确认框
   * @param {*标题} title
   * @param {*内容} content
   * @param {*确认按钮文字} confirmButtonText
   * @param {*取消按钮文字} cancelButtonText
   */
  confirm (title = '温馨提示', message = '', buttonLabels = ['确认', '取消']) {
    return new Promise((resolve, reject) => {
      device.notification.confirm({
        title, message, buttonLabels,
        onSuccess: (result) => { resolve(result) },
        onFail: (result) => {
        }
      }).catch(e => {});
    });
  }
  /**
   * 弹出框
   * @param {*提示内容} message
   * @param {*提示标题} title
   * @param {*按钮名称} buttonName
   */
  alert (message = '欢迎光临', title = '温馨提示', buttonName = '确定') {
    return new Promise((resolve, reject) => {
      device.notification.alert({
        message,
        title,
        buttonName,
        onSuccess () { resolve(); },
        onFail (err) {
          // reject()
        }
      }).catch(e => {});
    });
  }
  /**
   * 提示框
   * @param {*类型} type toast的类型 alert, success, error, warning, information, confirm
   * @param {*提示信息} text
   * @param {*显示持续时间} duration 显示持续时间，单位秒，最短2秒，最长5秒
   * @param {*延迟事件} delay 延迟显示，单位秒，默认0, 最大限制为10
   */
  toast (type = 'success', text = "消息提示", duration = 3, delay = 0) {
    device.notification.toast({
      type,
      text,
      duration,
      delay,
      onSuccess: function (result) {
        /*{}*/
      },
      onFail: function (err) { }
    })
  }
  /**
   *
   * @param {*Array} urls
   * @param {*String} current
   */
  previewImage (urls = [], current = "") {
    biz.util.previewImage({
      urls,//图片地址列表
      current,//当前显示的图片链接
      onSuccess: function (result) {
        /**/
      },
      onFail: function () { }
    })
  }
  /**
   * 钉钉免登授权
   * @param {*企业ID} corpId
   */
  auth (corpId) {
    return new Promise((resolve, reject) => {
      runtime.permission.requestAuthCode({
        corpId,
        onSuccess (result) {
          resolve(result)
        },
        onFail (err) { reject(err) }
      })
    });
  }
  /**
   * 获取用户信息
   */
  getInfo () {
    const that = this;
    biz.user.get({
      onSuccess (info) {
        that.alert(JSON.stringify(info));
      },
      onFail (err) {
        that.alert(JSON.stringify(err));
      }
    });
  }
  // 打开右侧抽屉
  openSlidePanel (url = 'about:blank', title = 'title') {
    new Promise((resolve, reject) => {
      biz.util.openSlidePanel({
        url, //打开侧边栏的url
        title, //侧边栏顶部标题
        onSuccess: function (result) {
          resolve(result);
          /*
               调用biz.navigation.quit接口进入onSuccess, result为调用biz.navigation.quit传入的数值
           */
        },
        onFail: function (result) {
          reject(result);
          /*
              tips:点击右上角上角关闭按钮会进入onFail
           */
        }
      })
    })
  }
  // 下载文件
  DownloadFile (url, name) {
    biz.util.downloadFile({
      url, //要下载的文件的url
      name, //定义下载文件名字
      onProgress: function (msg) {
        // 文件下载进度回调
      },
      onSuccess: function (result) {
        /*
          true
        */
      },
      onFail: function () { }
    })
  }
  // 用 openLink API，然后 然后 query string 加一个ddtab=true
  openLink (url) {
    biz.util.openLink({
      url,//要打开链接的地址
      onSuccess: function (result) {
        /**/
      },
      onFail: function (err) { }
    }
    )
  }
  // 删除
  deleteSpace (spaceId, dentryId) {
    biz.cspace.delete({
      spaceId, dentryId, onSuccess (result) {
      }
    })
  }
  // 操作 storage
  storage = {
    get (name) {
      return new Promise(resolve => {
        const v = localStorage.getItem(name)
        resolve(v)
      })
      // return new Promise((resolve, reject) => {
      //   util.domainStorage.getItem({
      //     name,
      //     onSuccess: function (d = {}) {
      //       if (d.body) {
      //         resolve(d.body.value || '')
      //       } else {
      //         resolve(d.body)
      //       }
      //     },
      //     onFail: function (e) { reject(e) }
      //   })
      // })
    },
    set (name, value) {
      return new Promise(resolve => {
        localStorage.setItem(name, value)
        resolve()
      })
      // return new Promise((resolve, reject) => {
      //   util.domainStorage.setItem({
      //     name,
      //     value,
      //     onSuccess: function (d = {}) { resolve(d.body || d) },
      //     onFail: function (e) { reject(e) }
      //   })
      // })
    },
    remove (name) {
      return new Promise(resolve => {
        localStorage.removeItem(name)
        resolve()
      })
      // return new Promise((resolve, reject) => {
      //   util.domainStorage.removeItem({
      //     name,
      //     onSuccess: function (d = {}) { resolve(d.body || d) },
      //     onFail: function (e) { reject(e) }
      //   })
      // })
    },
    old: ''
  }
};
export default new DD();
