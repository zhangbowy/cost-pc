/* eslint-disable no-return-assign */
/*
 * @Author: HLM
 * @LastEditors: Please set LastEditors
 * @Description: jsapi鉴权-命令模式
 * @Company: forwe
 * @Date: 2019-03-25 17:36:11
 * @LastEditTime: 2019-07-26 14:12:25
 */

import { biz, config, error, ready } from 'dingtalk-jsapi';
import {
  _authentication, _userAuthenticationReset, _spaceGrantAuthorization,
  _spaceGrantCorpSpaceView
} from './api';
// const projectConfig = require('../project.config');

const authInfo = {
  corpId: localStorage.getItem('CORP_ID'),
  appId: 10469,
};

// jsapi鉴权地址
export const PROJECTURL = {
  url: '',
  getURL () {
    if (this.url) return this.url;
    const pathname = process.env.NODE_ENV === 'production' ? '/msn' : '';
    const { origin } = window.location;
    return this.url = origin + pathname;
  }
};

// 是否过期 后端默认7000s 前台默认6900s
function isExpire (timer, target = 6900 * 1000) {
  const now = new Date().getTime();
  return now - timer <= target;
}

// 从loaclStorage获取corpid
function gainCorpid () {
  return localStorage.getItem('CORP_ID');
}

// api权限验证
function getDDAPIAuthed (corpId = gainCorpid()) {
  return new Promise((resolve, reject) => {
    const urls = decodeURI(window.location.href).replace(/&v=2.0/, '');
    const index = window.location.href.indexOf('#/');
    const params = {
      url: index > -1 ? urls.substring(0,index) : urls,
      corpId
    };
    _authentication(params).then(res => {
      const data = res.result;
      config({
        agentId: data.agentId, // 必填，微应用ID
        corpId: data.corpId,// 必填，企业ID
        timeStamp: data.timeStamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: [
          'biz.contact.choose', 'biz.contact.complexPicker',
          'biz.cspace.preview', 'biz.cspace.delete',
          'biz.util.uploadAttachment', 'biz.chat.pickConversation'
        ] // 必填，需要使用的jsapi列表
      });
      /** 当config权限校验成功时触发 */
      ready(() => {
        resolve(res);
      });
      /** 当config权限校验失败时触发 */
      error((_err) => {
        console.log(_err);
        // 鉴权失败调用接口清除缓存
        _userAuthenticationReset(params);
        // .then(res => {
        //   getDDAPIAuthed(url);
        // });
      });
    }).catch(err => reject(err));
  });
}
/* eslint-disable */
// 通讯录选人
const choosePerson = {
  execute (obj = {}) {
    const { max = 1500 } = obj
    return new Promise((resolve, reject) => {
      const params = {
        multiple: obj.multiple === false ? false : true, //是否多选： true多选 false单选； 默认true
        users: obj.users || [], //默认选中的用户列表，员工userid；成功回调中应包含该信息
        corpId: gainCorpid(), //企业id
        max: max, //人数限制，当multiple为true才生效，可选范围1-1500
        onSuccess: function (data) {
          resolve(data);
          /* data结构
            [{
              "name": "张三", //姓名
              "avatar": "http://g.alicdn.com/avatar/zhangsan.png" //头像图片url，可能为空
              "emplId": '0573', //员工userid
             },
             ...
            ]
          */
        },
        onFail: function (_err) {
          // reject(err);
        }
      }
      biz.contact.choose(Object.assign({}, params, obj))
        .catch(e => {
          reject(e)
        });
    })
  }
}

const setTitle = {
  execute (title) {
    return new Promise((_resolve, _reject) => {
      document.title = title
    })
  }
}

// 选部门
const departmentsPicker = {
  execute (obj) {
    return new Promise((resolve, reject) => {
      const defaultParams = {
        title: '选择部门',
        onSuccess (data) { resolve(data); },
        onFail (err) { reject(err) }
      };
      biz.contact
        .complexPicker({ ...defaultParams, ...obj, ...authInfo })
        .catch(e => reject(e));
    });
  }
}

//选人与部门
const chooseComplexPicker = {
  execute (obj = {}) {
    const {
      max = 1000, users = [], depts = [], title = '选人与部门',
      disabledUsers = [], responseUserOnly = false
    } = obj
    return new Promise((resolve, reject) => {
      const params = {
        title: title,            //标题
        corpId: gainCorpid(),              //企业的corpId
        multiple: true,            //是否多选
        limitTips: "超出了",          //超过限定人数返回提示
        maxUsers: max,            //最大可选人数
        pickedUsers: users,            //已选用户
        pickedDepartments: depts,          //已选部门
        disabledUsers,            //不可选用户
        disabledDepartments: [],        //不可选部门
        requiredUsers: [],            //必选用户（不可取消选中状态）
        requiredDepartments: [],        //必选部门（不可取消选中状态）
        appId: 10469,             //微应用的Id
        permissionType: "GLOBAL",          //可添加权限校验，选人权限，目前只有GLOBAL这个参数
        responseUserOnly,        //返回人，或者返回人和部门
        startWithDepartmentId: 0,   //仅支持0和-1
        onSuccess: function (d) {
          resolve(d);
          /**
          {
              selectedCount:1,                              //选择人数
              users:[{"name":"","avatar":"","emplId":""}]，//返回选人的列表，列表中的对象包含name（用户名），avatar（用户头像），emplId（用户工号）三个字段
              departments:[{"id":,"name":"","number":}]//返回已选部门列表，列表中每个对象包含id（部门id）、name（部门名称）、number（部门人数）
          }
          */
        },
        onFail: function (e) { reject(e) }
      }
      biz.contact.complexPicker(params);
    })
  }
}

// 钉盘文件预览
const cspacePreview = {
  execute ({
    fileName, fileType, spaceId, fileId, fileSize,
    mode = 'normal', watermark = false
  }) {
    return new Promise((resolve, reject) => {
      _spaceGrantCorpSpaceView({ fileId }).then(_res => {
        biz.cspace.preview({
          corpId: gainCorpid(),
          fileName, // "视频文件.mp4",
          fileType, //  "mp4",
          spaceId, //  "902628271",
          fileId, //"5163814759",
          fileSize, // 716146,
          mode,
          watermark,
          onSuccess: function () {
            resolve('success');
            //无，直接在native显示文件详细信息
          },
          onFail: function (err) {
            reject(err);
            // 无，直接在native页面显示具体的错误
          }
        });
      })
    });
  }
}

const removeDing = (files, resolve) => {
  let errList = []
  let finList = []
  let len = files.length
  files.forEach(({ fileId, spaceId }) => {
    biz.cspace.delete({
      corpId: gainCorpid(),
      spaceId,
      dentryId: fileId,
      onSuccess: function () {
        finList.push(fileId)
        if (finList.length + errList.length === len) {
          resolve({
            text: errList.length > 0 ? '部分文件未删除，请刷新后检查' : '删除成功',
            finList,
            errList
          })
        }
      },
      onFail: function (_e) {
        errList.push(fileId)
        if (finList.length + errList.length === len) {
          resolve({
            text: errList.length > 0 ? '部分文件未删除，请刷新后检查' : '删除成功',
            finList,
            errList
          })
        }
      }
    })
  })
}

// 删除钉盘文件
/**
 * files  array  [{ fileId, spaceId }]
 * needAuth bool
 */
const cspaceDelete = {
  execute({ files, needAuth }) {
    return new Promise((resolve, reject) => {
      if (needAuth) {
        _spaceGrantCorpSpaceView({
          fileIds: files.map(v => v.fileId).join(','),
          authType: 'delete'
        })
        .then(d => {
          if (d.success) {
            removeDing(files, resolve)
          } else {
            throw d
          }
        })
        .catch(e => reject(e))
      } else {
        removeDing(files, resolve)
      }
    })
  }
}

const pickConversation = {
  execute(obj = {}) {
    return new Promise((res, rej) => {
      biz.chat.pickConversation({
          corpId: gainCorpid(),
          ...obj,
          onSuccess: d => res(d),
          onFail: e => rej(e)
      })
    })
  }
}

const uploadVideo = {
  execute (params = {}) {
    return new Promise((resolve, reject) => {
      _spaceGrantAuthorization(params)
      .then(d => {
        if (d.success && d.result && d.result.spaceId) {
          const { spaceId } = d.result
          biz.util.uploadAttachment({
            space: { corpId: gainCorpid(), spaceId, max: 1 },
            file: { max: 1, spaceId },
            types: ['file', 'space'], // PC端支持["photo","file","space"]
            onSuccess: function (result) {
              resolve(result)
            },
            onFail: function (err) { reject(err) }
          })
        } else {
          throw d
        }
      })
      .catch(_e => {
        reject(res)
      })
    })
  }
}

// 上传文件到钉盘
const uploadAttachment = {
  execute () {
    return new Promise((resolve, reject) => {
      _spaceGrantAuthorization().then(res => {
        if (res.result) {
          const { spaceId } = res.result;
          biz.util.uploadAttachment({
            // image: { multiple: true, compress: false, max: 5, spaceId: spaceId },
            space: { corpId: gainCorpid(), spaceId, isCopy: 1, max: 5 },
            file: { spaceId, max: 5 },
            types: ["file", "space"], // PC端支持["photo","file","space"]
            onSuccess: function (result) {
              //onSuccess将在文件上传成功之后调用
              resolve(result);
              /*
             {
                type:'', // 用户选择了哪种文件类型 ，image（图片）、file（手机文件）、space（钉盘文件）
                data: [{
                     spaceId: "232323",
                     fileId: "DzzzzzzNqZY",
                     fileName: "审批流程.docx",
                     fileSize: 1024,
                     fileType: "docx"
                  }]

             }
              */
            },
            onFail: function (err) { reject(err) }
          })
        } else { reject(res) }
      });
    })
  }
}

// 命令列表
const commandList = {
  'choosePerson': choosePerson,
  'chooseComplexPicker': chooseComplexPicker,
  'cspacePreview': cspacePreview,
  cspaceDelete,
  'uploadAttachment': uploadAttachment,
  departmentsPicker,
  pickConversation,
  uploadVideo,
  setTitle
}

/**
 * 设置命令
 * @param {String} command 执行命令字段
 * @param {Object} obj  鉴权默认参数
 */
export const setCommand = ((_command, _obj = {}) => {
  let commandObj = null;
  return async (command, obj) => {
    if (commandObj) {
      if (isExpire(commandObj.timer)) {
        return commandList[command].execute(obj);
      }
    }
    const result = await getDDAPIAuthed();
    // 鉴权成功缓存数据
    commandObj = {
      execute: commandList[command].execute,
      timer: new Date().getTime()
    };
    return commandList[command].execute(obj);
  }
})();
