/* eslint-disable no-unused-expressions */
// import {
//   getUserInfo,
//   getTestTokenByCode
// } from '@/services/api';
import 'dingtalk-jsapi/entry/mobile';
// import store from '@/store/index';
import {
  config,
  runtime
} from 'dingtalk-jsapi';
import choose from 'dingtalk-jsapi/api/biz/contact/choose';
import complexPicker from 'dingtalk-jsapi/api/biz/contact/complexPicker';
import departmentsPicker from 'dingtalk-jsapi/api/biz/contact/departmentsPicker';
import openLink from 'dingtalk-jsapi/api/biz/util/openLink';
import setTitle from 'dingtalk-jsapi/api/biz/navigation/setTitle';
import scan from 'dingtalk-jsapi/api/biz/util/scan';
import {
  isInDingTalk,
  isLoc,
  isPreview,
  // previewCorpId,
  getAllParams
} from '@/utils/util';
import {
  message
} from 'antd';
import openSlidePanel$ from 'dingtalk-jsapi/api/biz/util/openSlidePanel';
import previewImage$ from 'dingtalk-jsapi/api/biz/util/previewImage';
import preview$ from 'dingtalk-jsapi/api/biz/cspace/preview';
import uploadAttachment$ from 'dingtalk-jsapi/api/biz/util/uploadAttachment';
import downloadFile$ from 'dingtalk-jsapi/api/biz/util/downloadFile';

const defaultUser = {
  preview: [{
    avatar: 'https://static.dingtalk.com/media/lADPGoxXbntjrBfNA2bNA2c_871_870.jpg_60x60q90.jpg',
    emplId: '5807246240752072',
    name: '李四'
  }],
  normal: [{
      avatar: 'https://static.dingtalk.com/media/lADPDgQ9qf6MAl_NBDjNBDg_1080_1080.jpg_60x60q90.jpg',
      emplId: 'manager6070',
      name: '方珍'
    }
    // { avatar: '', emplId: '135022144133397447', name: '蔡万服' }
    // { 'avatar': 'http://static.dingtalk.com/media/lADPBbCc1TfYJFjNAu7NAug_744_750.jpg', 'emplId': '04122239854723', 'name': '桔梗test' }
  ]
};

const defaultDepartment = {
  preview: [{
    id: 153612324,
    name: '测试部门'
  }],
  normal: [{
    id: 153612324,
    name: '产品部'
  }]
};

export const requestAuth = async (id = null, callback) => {
  // if (isPreview) {
  //   // 预览时执行的免登
  //   const {
  //     data
  //   } = await getTestTokenByCode({
  //     corpId: previewCorpId
  //   });
  //   // store.commit('SET_USERINFO', data);
  //   typeof callback === 'function' && callback(data);
  //   return;
  // };
  const corpId = id || sessionStorage.getItem('corpId');
  if (corpId) {
    runtime.permission.requestAuthCode({
      corpId,
      onSuccess: async result => {
        console.log(result);
        console.log(window);
        typeof callback === 'function' && callback(result);
        // const {
        //   data
        // } = await getUserInfo({
        //   code: result.code
        // });
        // if (!data || !data.user) {
        //   await requestAuth();
        // } else {
        //   // store.commit('SET_USERINFO', data);
        //   typeof callback === 'function' && callback(data);
        // }
        // console.log('userInfo', data);
      }
    });
  }
};

export const ddConfig = (agentId, corpId, timeStamp, nonceStr, signature) => {
  config({
    agentId, // 必填，微应用ID
    corpId, // 必填，企业ID
    timeStamp, // 必填，生成签名的时间戳
    nonceStr, // 必填，生成签名的随机串
    signature, // 必填，签名
    type: 0, // 选填，0表示微应用的jsapi，1表示服务窗的jsapi，不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
    jsApiList: ['biz.contact.choose', 'biz.contact.complexPicker', 'biz.contact.departmentsPicker', 'biz.cspace.preview', 'biz.util.uploadAttachment', 'biz.util.downloadFile'] // 必填，需要使用的jsapi列表，注意：不要带dd。
  });
};

/**
 * 选人
 *
 * @param {array} users
 * @param {function} callback
 * @param {object} options
 */
export const choosePeople = (users = [], callback, options = {}) => {
  if (!isInDingTalk) {
    console.log(defaultUser);
    typeof callback === 'function' && callback(defaultUser);
    return;
  }
  const _users = users;
  const choosed = choose({
    multiple: options.multiple === false ? options.multiple : true, // 是否多选： true多选 false单选； 默认true
    users: _users, // 默认选中的用户列表，员工userid；成功回调中应包含该信息
    corpId: localStorage.getItem('corpId'), // 企业id
    max: options.max || 1500, // 人数限制，当multiple为true才生效，可选范围1-1500
    onSuccess: res => {
      console.log('user', res);
      typeof callback === 'function' && callback(res);
    },
    onFail: err => {
      console.log(err);
    }
  });
  choosed.catch(e => {
    console.log(e.errorMessage);
  });
};

/**
 * 选人
 *
 * @param {array} users
 * @param {function} callback
 * @param {object} options
 */
export const ddChoose = (users = [], callback, options = {}, params) => {
  console.log('isInDingTalk', isInDingTalk);
  if (!isInDingTalk) {
    const type = isPreview ? 'preview' : 'normal';
    callback(defaultUser[type], params);
    return;
  }
  const _users = users;
  choose({
    multiple: options.multiple === false ? options.multiple : true, // 是否多选： true多选 false单选； 默认true
    users: _users, // 默认选中的用户列表，员工userid；成功回调中应包含该信息
    corpId: sessionStorage.getItem('corpId') || localStorage.getItem('corpId'), // 企业id
    max: options.max || 1500, // 人数限制，当multiple为true才生效，可选范围1-1500
    onSuccess: res => {
      console.log(res);
      typeof callback === 'function' && callback(res, params);
    },
    onFail: err => {
      console.log(err);
    }
  });
};

/**
 * 选人和选部门
 *
 * @param {object} options
 * @param {function} callback
 */
export const ddComplexPicker = (options = {}, callback) => {
  if (!isInDingTalk) {
    const type = isPreview ? 'preview' : 'normal';
    callback({
      departments: defaultDepartment[type],
      users: []
    });
    return;
  }
  complexPicker({
    multiple: options.multiple === false ? options.multiple : true, // 是否多选： true多选 false单选； 默认true
    corpId: sessionStorage.getItem('corpId') || localStorage.getItem('corpId'), // 企业id
    pickedUsers: options.users || [], // 已选用户
    pickedDepartments: options.departments || [], // 已选部门
    disabledUsers: options.disabledUsers || [], // 不可选用户
    disabledDepartments: options.disabledDepart || [], // 不可选部门
    requiredUsers: options.requiredUsers || [], // 必选用户（不可取消选中状态）
    requiredDepartments: options.requiredDepart || [], // 必选部门（不可取消选中状态）
    responseUserOnly: options.responseUserOnly === true ? options.responseUserOnly : false, // 返回人，或者返回人和部门
    maxUsers: options.max || 1500, // 人数限制，当multiple为true才生效，可选范围1-1500
    startWithDepartmentId: options.startWithDepartmentId === undefined ? 0 : options.startWithDepartmentId, // 仅支持0和-1（0 表示从企业最上层开始，-1 表示从自己所在部门开始）
    onSuccess: users => {
      console.log('users', users);
      typeof callback === 'function' && callback(users);
    },
    onFail: err => {
      console.log(err);
    }
  });
};

/**
 * 选部门
 *
 * @param {object} options
 * @param {function} callback
 */
export const ddDepartmentsPicker = (options = {}, callback) => {
  if (!isInDingTalk) {
    const type = isPreview ? 'preview' : 'normal';
    callback({
      departmentsCount: 1,
      departments: defaultDepartment[type],
      userCount: 1
    });
    return;
  }
  departmentsPicker({
    title: options.title || '选部门', // 标题
    corpId: sessionStorage.getItem('corpId') || localStorage.getItem('corpId'), // 企业的corpId
    multiple: options.multiple === false ? options.multiple : true, // 是否多选
    limitTips: options.limitTips || '超出了', // 超过限定人数返回提示
    maxDepartments: options.max || 100, // 最大选择部门数量
    pickedDepartments: options.departments || [], // 已选部门
    disabledDepartments: options.disable || [], // 不可选部门
    requiredDepartments: options.required || [], // 必选部门（不可取消选中状态）
    // appId: 158, // 微应用的Id
    permissionType: 'GLOBAL', // 选人权限，目前只有GLOBAL这个参数
    onSuccess: result => {
      /**
        {
            userCount:1,                              //选择人数
            departmentsCount:1，//选择的部门数量
            departments:[{"id":,"name":"","number":}] //返回已选部门列表，列表中每个对象包含id（部门id）、name（部门名称）、number（部门人数）
        }
        */
      console.log('dept', result);
      typeof callback === 'function' && callback(result);
    },
    onFail: err => {
      console.log('departmentsPicker', err);
    }
  });
};

/**
 * 页面跳转
 *
 * @param {string} url
 * @param {function} sCallBack
 * @param {function} fCallBack
 */
export const ddOpenLink = (url, sCallBack, fCallBack) => {
  if (!isInDingTalk) {
    window.location.href = url;
    return;
  }
  openLink({
    url,
    onSuccess: result => {
      console.log(result);
      typeof sCallBack === 'function' && sCallBack();
    },
    onFail: () => {
      typeof fCallBack === 'function' && fCallBack();
    }
  });
};

export const ddOpenSlidePanel = (url, title, sCallback, fCallBack) => {
  // if (!isInDingTalk) {
  //   window.location.href = url;
  //   return;
  // }
  console.log(url);
  // window.location.href = url;
  openSlidePanel$({
    url, // 打开侧边栏的url
    title, // 侧边栏顶部标题
    onSuccess(result) {
      typeof sCallback === 'function' && sCallback(result);
    },
    onFail() {
      typeof fCallBack === 'function' && fCallBack();
    }
  });
};

// 预览图片
export const ddPreviewImage = (options) => {
  previewImage$({
    current:options.urlArray[options.index],
    urls: options.urlArray,
    onSuccess: (result) => {
      console.log(result);
    },
    onFail: (err) => {
      console.log(`err${JSON.stringify(err)}`);
    }
  });
};

// 预览附件
export const previewFile = (options) => {
  const { fileName, fileType, spaceId, fileId, fileSize,
    mode = 'normal', watermark = false } = options;
    console.log(options);
  preview$({
    corpId: localStorage.getItem('corpId'),
    fileName, // "视频文件.mp4",
    fileType, //  "mp4",
    spaceId: `${spaceId}`, //  "902628271",
    fileId: `${fileId}`, // "5163814759",
    fileSize, // 716146,
    mode,
    watermark,
    onSuccess: (result) => {
      console.log(result);
    },
    onFail: (err) => {
      console.log(err);
    }
  });
};

// 上传附件
export const fileUpload = (options, sCallBack, fCallBack) => {
  console.log(options.spaceId);
  uploadAttachment$({
    image: {multiple:true,compress:false,max: options.max || 9,spaceId: options.spaceId},
    space:{corpId: localStorage.getItem('corpId') || '',spaceId: options.spaceId, isCopy:1 , max: options.max || 9},
    file:{spaceId: options.spaceId,max: options.max || 9},
    types:['photo','camera','file','space'],
    onSuccess(_result) {
      typeof sCallBack === 'function' && sCallBack(_result.data);
    },
    onFail(err) {
      typeof fCallBack === 'function' && fCallBack(err);
    }
  });
};

export const DownloadFile = (url, name) => {
  downloadFile$({
    url, // 要下载的文件的url
    name, // 定义下载文件名字
    onProgress (msg) {
      // 文件下载进度回调
      console.log(msg);
    },
    onSuccess (result) {
      /*
        true
      */
     console.log(result);
    },
    onFail () { }
  });
};

export const ddScan = (type = 'all', sCallBack, fCallBack) => {
  if (isPreview) {
    message.error('体验版本不能扫码，请点击上方免费试用，试用更多功能');
    return;
  }
  scan({
    type, // type 为 all、qrCode、barCode，默认是all。
    onSuccess: data => {
      // onSuccess将在扫码成功之后回调
      /* data结构
        { 'text': String}
      */
      const {
        text
      } = data;
      const {
        host,
        hash
      } = new URL(text);
      const locationHost = window.location.host;
      // 判断是否是扫鑫资产的二维码 如果是才允许后续操作
      if (!isLoc && locationHost !== host) {
        message.error('请扫鑫资产的二维码');
        return;
      }
      const params = getAllParams(text);
      const types = hash.indexOf('?') ? hash.match(/#\/(\S*)\?/)[1] : hash.match(/#\/(\S*)/)[1];
      typeof sCallBack === 'function' && sCallBack(text, params, types);
    },
    onFail: err => {
      typeof fCallBack === 'function' && fCallBack(err);
    }
  });
};

export const ddSetTitle = (title = '', sCallBack, fCallBack) => {
  if (!isInDingTalk) {
    document.title = title;
    return;
  }
  setTitle({
    title,
    onSuccess: data => {
      typeof sCallBack === 'function' && sCallBack(data);
    },
    onFail: err => {
      typeof fCallBack === 'function' && fCallBack(err);
    }
  });
};
