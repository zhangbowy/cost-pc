/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Form, Input, Divider, Button,
  Icon, Select, TreeSelect, InputNumber, DatePicker, message } from 'antd';
import moment from 'moment';
import cs from 'classnames';
import TextArea from 'antd/lib/input/TextArea';
import fileIcon from '@/utils/fileIcon.js';
import treeConvert from '@/utils/treeConvert';
import SelectPeople from '@/components/Modals/SelectPeople';
import ReceiptModal from '@/components/Modals/ReceiptModal';
import { placeholderType } from '@/utils/constants';
import { compare, setTime, handleProduction } from '@/utils/common';
import defaultFunc from './utils';
import style from './index.scss';
import UploadImg from '../../../../components/UploadImg';
import UploadFile from '../../../../components/UploadFile';
import Capitalization from '@/components/Modals/Capitalization';

const {Option} = Select;
const { RangePicker, MonthPicker } = DatePicker;
const typeObj = {
  0: '银行卡',
  1: '支付宝',
  2: '现金',
};
const labelInfo = {
  reason: '事由',
  userId: '报销人',
  deptId: '报销部门',
  note: '单据备注',
  receiptId: '收款账户',
  createDeptId: '所在部门',
  officeId: '所在公司',
  imgUrl: '图片',
  fileUrl: '附件',
  project: '项目',
  supplier: '供应商'
};
const { TreeNode } = TreeSelect;

@Form.create()
class ChangeForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // showIds: {},
    };
  };

  checkMoney = (rule, value, callback) => {
    if (value) {
      if(!/((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/.test(value)) {
        callback('请输入正确的金额');
      }
      if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(value)) {
        callback('金额小数不能超过2位');
      }
      if (value > 100000000000000 || value === 100000000000000) {
        callback('金额需小于1万个亿');
      }
      if (value < 0) {
        callback('金额不能小于零');
      }
      callback();
    } else {
      callback();
    }
  }

  selectPle = async(val) => {
    let detail = this.props.details;
    const { onChangeData } = this.props;
    if (val.users && val.users.length > 0) {
      const flags = await this.props.checkOffice({ dingUserId: val.users[0].userId });
      if (!flags) return;
      const { deptInfo, userId } = await this.props.selectPle(JSON.stringify(val.users));
      onChangeData({
        users: val.users,
        depList: deptInfo,
      });
      if (deptInfo.length === 1) {
        this.props.form.setFieldsValue({
          deptId: `${deptInfo[0].deptId}`,
        });
        detail = {
          ...detail,
          userId,
          deptId: deptInfo[0].deptId,
        };
      } else {
        this.props.form.setFieldsValue({
          deptId: '',
        });
        detail = {
          ...detail,
          userId,
        };
      }
      onChangeData({
        users: val.users,
        details: {
          ...detail,
          userName: val.users[0].userName,
          loanUserId: val.users[0].userId,
        },
        loanUserId: val.users[0].userId,
      }, true);
    }
  }

  onChangeDept = (val) => {
    const { details, onChangeData } = this.props;
    onChangeData({
      details: {
        ...details,
        deptId: val,
      },
    }, true);
  }

  onChangePro = (val, name) => {
    const { onChangeData, details } = this.props;
    let data = {...details};
    if (name === 'project') {
      data = {
        ...data,
        projectId: val,
      };
    } else {
      data = {
        ...data,
        supplierId: val.split('_')[1],
      };
    }
    onChangeData({
      details: data,
    }, true);
  }

  treeNodeRender = (treeNode) => {
    if(!treeNode || !treeNode.length){
      return;
    }
    return treeNode.map((v) => {
      return (
        <TreeNode
          value={v.value}
          title={(
            <span className="c-black-85" style={{color: 'rgba(0,0,0,0.85)!important'}}>{v.title}</span>
          )}
          key={v.value}
          searchs={v.title}
          disabled
        >
          {
            (v.children || v.supplierAccounts) && v.type === 1 ?
            this.treeNodeChildRender(v.supplierAccounts, v.title)
            :
            this.treeNodeRender(v.children)
          }
        </TreeNode>
      );
    });
  }

  treeNodeChildRender = (list, titles) => {
    return list.map(it => (
      <TreeNode
        key={`${it.id}_${it.supplierId}`}
        value={`${it.id}_${it.supplierId}`}
        name={it.name}
        newName={`${titles}(${it.name} ${typeObj[it.type]} ${it.account})`}
        searchs={titles}
        title={(
          <div>
            <div className={style.treeOption}>
              {
                it.type === 0 &&
                <i className="iconfont iconyinhangka" />
              }
              {
                it.type === 1 &&
                <i className="iconfont iconzhifubao" />
              }
              {
                it.type === 2 &&
                <i className="iconfont iconxianjin" />
              }
              {it.name}
            </div>
            <p className="c-black-36 m-l-20 fs-12" style={{marginBottom: 0}}>
              {typeObj[it.type]}
              {it.account}
            </p>
          </div>
        )}
      />
    ));
  }

  inputMoney = (value) => {
    const { djDetail, onChangeData } = this.props;
    const { costDetailsVo } = this.props;
    // eslint-disable-next-line react/no-unused-state
    this.setState({ money: value });
    if (!djDetail.categoryStatus || (costDetailsVo.length === 0)) {
      let flag = true;
      if(!/((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/.test(value)) {
        flag = false;
      }
      if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(value)) {
        flag = false;
      }
      if (value > 100000000 || value === 100000000) {
        flag = false;
      }
      if (value < 0) {
        flag = false;
      }
      onChangeData({
        total: value
      }, flag);
    }
  }

  onChangeImg = (val, key) => {
    const { onChangeData } = this.props;
    onChangeData({
      [key]: val,
    });
  }

  onDelFile = (index, e, flag) => {
    const { onChangeData } = this.props;
    e.stopPropagation();
    if (flag) {
      message.error('不允许删除');
      return;
    }
    const files = this.props.fileUrl;
    files.splice(index, 1);
    onChangeData({
      fileUrl: files,
    });
  }

  //  预览附件
  previewFiless = () => {
    message.error('钉钉暂时不支持未提交单据附件的预览，请提交后预览/下载');
    // this.props.dispatch({
    //   type: 'global/grantDownload',
    //   payload: {
    //     fileIds: options.fileId
    //   }
    // }).then(() => {
    //   previewFile(options);
    // });
  }

  onChangeAcc = (val) => {
    let detail = this.props.details;
    const { accountList, onChangeData } = this.props;
    accountList.forEach(item => {
      if (item.id === val) {
        const arr = [item];
        detail = {
          ...detail,
          receiptId: val,
          receiptName: item.name,
          receiptNameJson: JSON.stringify(arr),
        };
      }
    });
    this.props.form.setFieldsValue({
      receiptId: val,
    });
    onChangeData({
      details: detail,
    });
  }

  onChangeCreate = (val) => {
    const detail = this.props.details;
    const { onChangeData } = this.props;
    onChangeData({
      details: {
        ...detail,
        createDeptId: val,
      },
    }, true);
  }

  onSaveForm = () => {
    const { form } = this.props;
    const {
      depList,
      createDepList,
      imgUrl,
      fileUrl,
      expandField,
      templateType,
      details,
      users,
      showField,
      newshowField,
      ossFileUrl,
    } = this.props;
    let params = {};
    form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        const dep = depList.filter(it => `${it.deptId}` === `${val.deptId}`);
        const dept = createDepList.filter(it => `${it.deptId}` === `${val.createDeptId}`);
        const expandSubmitFieldVos = [];
        const selfSubmitFieldVos = [];
        if (expandField && expandField.length > 0) {
          expandField.forEach(it => {
            let obj = {
              ...it,
            };
            if (Number(it.fieldType) !== 9) {
              obj = {
                ...obj,
                msg: Number(it.fieldType) === 5 && val[it.field] ?
                JSON.stringify(val[it.field]) : val[it.field] ? val[it.field].toString() : val[it.field],
              };
            }
            if (Number(it.fieldType) === 5 && val[it.field]) {
              Object.assign(obj, {
                startTime: Number(it.dateType) === 2 ?
                moment(`${moment(val[it.field][0]).format('YYYY-MM-DD')} 00:00:00`).format('x')
                : moment(`${moment(val[it.field]).format('YYYY-MM-DD')} 00:00:00`).format('x'),
                endTime: Number(it.dateType) === 2 ?
                moment(`${moment(val[it.field][1]).format('YYYY-MM-DD')} 23:59:59`).format('x') : '',
              });
            }
            if (Number(it.fieldType) === 9) {
              obj = {
                ...obj,
                msg: it.note,
              };
            }
            if (it.status && it.field.indexOf('expand_') > -1) {
              expandSubmitFieldVos.push(obj);
            } else if (it.status && it.field.indexOf('self_') > -1){
              selfSubmitFieldVos.push(obj);
            }
          });
        }

        params = {
          ...details,
          reason: val.reason,
          note: val.note || '',
          userId: details.userId || '',
          deptId: val.deptId,
          deptName: dep && dep.length > 0 ? dep[0].name : '',
          userJson: users,
          createDeptId: val.createDeptId,
          createDeptName: dept && dept.length > 0 ? dept[0].name : '',
          projectId: val.projectId || '',
          supplierAccountId: val.supplier ? val.supplier.split('_')[0] : '',
          supplierId: val.supplier ? val.supplier.split('_')[1] : '',
          officeId: val.officeId || '',
          imgUrl,
          fileUrl,
          expandSubmitFieldVos,
          selfSubmitFieldVos,
          ossFileUrl,
          showField: JSON.stringify(newshowField),
        };
        if (val.month) {
          Object.assign(params, {
            month: moment(`${moment(val.month).format('YYYY-MM')}-01 00:00:00`).format('x'),
          });
        }
        if(Number(templateType) === 1) {
          Object.assign(params, {
            loanSum: Number(((val.loanSum*1000)/10).toFixed(0)),
            repaymentTime: val.repaymentTime ? setTime({ time: val.repaymentTime }) : '',
          });
        } else if (Number(templateType) === 2) {
          Object.assign(params, {
            applicationSum: Number(((val.applicationSum*1000)/10).toFixed(0)),
            repaymentTime: val.repaymentTime ? setTime({ time: val.repaymentTime }) : '',
          });
          if (showField.happenTime &&
            (showField.happenTime.dateType === '2' ||
            showField.happenTime.dateType === 2)) {
            Object.assign(params, {
              startTime: val.time ? setTime({ time: val.time[0], type: 'x' }) : '',
              endTime: val.time ? setTime({ time: val.time[1], type: 'x' }) : ''
            });
          } else if (showField.happenTime &&
            (showField.happenTime.dateType === '1' ||
            showField.happenTime.dateType === 1)) {
            Object.assign(params, {
              startTime: val.time ? setTime({ time: val.time, type: 'x' }) : ''
            });
          }
        }
        if (showField.receiptId && !showField.receiptId.status) {
          Object.assign(params, {
            receiptId: '',
            receiptName: '',
            receiptNameJson: '',
          });
        }
      } else {
        params = null;
      }
    });
    return params;
  }

  onGetVal = () => {
    const val = this.props.form.getFieldsValue();
    return val;
  }

  onGetSingleVal = (key) => {
    const { form: { getFieldValue } } = this.props;
    return getFieldValue(key);
  }

  flat=(arr)=> {
    let arrResult = [];
    arr.forEach((item) => {
      if (Array.isArray(item)) {
        arrResult = arrResult.concat(this.flat(item)); // 递归
      } else {
        arrResult.push(item);
      }
    });
    return arrResult;
  }

  onChangeSelect = (val, obj) => {
    // this.props.form.setFieldsValue({ 'projectId': null })
  // 获取新的showIdsObj
    const { showIdsObj,changeShowIdsObj,expandField,changeExpandField,onChangeData} = this.props;
    const keyList = Object.keys(showIdsObj);
    const newArrObj = obj.optionsRelevance && obj.optionsRelevance.filter(it => it.name === val);
    let newAddObj = [];
    if (newArrObj && newArrObj.length && newArrObj[0].ids && newArrObj[0].ids.length) {
      newAddObj = newArrObj[0].ids;
    }
    function sortFun(newObj, keyField, keys) {
      for (let i=0; i<keys.length; i++) {
        const it = keys[i];
        const arr = newObj[it] ? newObj[it] : showIdsObj[it];
        const is = arr.filter(im => im !== keyField);

        if (is.length === 0 && showIdsObj[it] && arr.length > 0
            && ((newAddObj.length && !newAddObj.includes(keyField)) || !newAddObj.length)) {
          Object.assign(newObj, {
            [it]: [],
          });
          sortFun(newObj, it, keys);
        } else {
          Object.assign(newObj, {
            [it]: is
          });
        }
      }
      return newObj;
    }
  const newObjs = sortFun({}, obj.field, keyList);
    if (newAddObj && newAddObj.length) {
      newAddObj.forEach(it => {
        if (it) {
          Object.assign(newObjs, {
            [it]: newObjs[it] ? [...newObjs[it], obj.field] : [obj.field]
          });
        }

      });
    }


    // 如果之前的选项选择了东西，切换后就清除
    // console.log(Object.keys(newObjs),'666');
    const clearArr = [];
    const clearShowArr = [];
    Object.keys(newObjs).forEach(key => {
      if (!newObjs[key].length) {
        if (key==='imgUrl'||key==='fileUrl'||key==='ossFileUrl') {
          onChangeData({
            [key]:[],
          });
        } else if (key === 'supplier'||key === 'project') {
          this.onChangePro('',key);
        } else if (key === 'applicationSum') {
          this.inputMoney('');
        }
        clearArr.push(`['${key}']`);
        clearShowArr.push(key);
      }
    });
      // 回显编辑时让单选项msg置空
      expandField.forEach(items => {
        if (clearShowArr.length && clearShowArr.includes(items.field)) {
          // eslint-disable-next-line no-param-reassign
          items.msg = '';
        }
      });
        // 清除选项
    const clearObj = {};
    clearArr.forEach(its => {
      clearObj[its] = undefined;
    });
    this.props.form.setFieldsValue({
         ...clearObj
    }, () => {
      changeShowIdsObj(newObjs);
      changeExpandField(expandField);
    });
    const { expandVos} = this.props;
    const list = [...expandVos];
    const index = list.findIndex(it => it.field === obj.field);
    let flag = false;
    if (obj.field.indexOf('expand_') > -1 && obj.fieldType !== 8) {
      flag = true;
    }
    if (index > -1) {
      list.splice(index, 1,obj.optionsRelevance? {
        field: obj.field,
        msg: val?val.toString():'',
      }:{
        field: obj.field,
        msg: val?val.toString():'',
      });
    } else {
      list.push(obj.optionsRelevance?{
        field: obj.field,
        msg: val?val.toString():'',
      }:{
        field: obj.field,
        msg: val?val.toString():'',
      });
    }
    onChangeData({
      expandVos: list,
    }, flag);
  }

  onRest = () => {
    this.props.form.resetFields();
  }

renderTreeNodes = data =>
  data.map(item => {
    if (item.children) {
      // 这一句是关键代码，设置父级都为禁用模式，有条件的让后台返回
      return (
        <TreeNode
          key={item.key}
          title={item.label}
          value={item.value}
          disabled={!item.type}
        >
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} key={item.key} title={item.label} value={item.value} />;
  });

  // 选项隐藏时，把此选项的选中置空

  render () {
    const {
      showField,
      newshowField,
      expandField,
      form: { getFieldDecorator },
      usableProject,
      imgUrl,
      // depList,
      createDepList,
      accountList,
      details,
      fileUrl,
      userInfo,
      modify,
      templateType,
      supplierList,
      handelAcc,
      uploadFiles,
      users,
      depList,
      officeList,
      ossFileUrl,
      allDeptList,
      // associatedIds
      showIdsObj
    } = this.props;
    const projectList = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'name',
      id: 'id',
      tName: 'label',
      tId: 'value',
      otherKeys: ['type']
    }, usableProject.sort(compare('sort')));
    const oldForm = [...newshowField, ...expandField].sort(compare('sort'));
    const newForm = handleProduction(oldForm);
    const deptList = modify ? allDeptList : depList;
    const createDeptList = modify ? allDeptList : createDepList;
    return (
      <Form
        className={cs('formItem', style.formColumn)}
        refs={forms => {this.invoice = forms;}}
        layout="vertical"
      >
        {
          newForm && (newForm.length > 0) &&
          newForm.filter(it => it.fieldType !== 9).map(itw => {
            let isShow =true;
            if (showIdsObj[itw.field]) {
              if (showIdsObj[itw.field].length) {
                isShow = true;
              } else {
                isShow = false;
              }
            } else {
             isShow = true;
            }
            // console.log(isShow,'999');
            if (itw.field.indexOf('expand_') > -1 || itw.field.indexOf('self_') > -1) {
              let renderForm = null;
              let rule = [];
              let initMsg = itw.msg || '';
              if (Number(itw.fieldType) === 0) {
                renderForm = (
                  <Input
                    placeholder={itw.note ? itw.note : '请输入'}
                    disabled={modify && !itw.isModify}
                  />
                );
                rule = [{ max: 20, message: '限制20个字' }];
              } else if (Number(itw.fieldType) === 1) {
                renderForm = (
                  <TextArea
                    placeholder={itw.note ? itw.note : '请输入'}
                    disabled={modify && !itw.isModify}
                    autoSize={{maxRows: 5}}
                  />
                );
                rule = [{ max: 128, message: '限制128个字' }];
              } else if(Number(itw.fieldType) === 2 || Number(itw.fieldType) === 8) {
                if (Number(itw.fieldType) === 8) {
                  initMsg = itw.msg && !(itw.msg instanceof Array) ? itw.msg.split(',') : [];
                }
                renderForm = (
                  <Select
                    placeholder={itw.note ? itw.note : '请选择'}
                    disabled={modify && !itw.isModify}
                    mode={Number(itw.fieldType) === 8 ? 'multiple' : ''}
                    onChange={val => this.onChangeSelect(val, {
                      fieldType: itw.fieldType, field: itw.field,optionsRelevance:itw.optionsRelevance })}
                  >
                    {
                      itw.options && itw.options.map(iteems => (
                        <Select.Option key={iteems}>{iteems}</Select.Option>
                      ))
                    }
                  </Select>
                );
              } else if (itw.fieldType === 5) {
                if (itw.dateType === 1) {
                  initMsg = itw.startTime ? moment(moment(Number(itw.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD') : '';
                  renderForm = (
                    <DatePicker
                      style={{width: '100%'}}
                      placeholder={itw.note ? itw.note : '请选择'}
                      disabled={modify && !itw.isModify}
                    />
                  );
                } else {
                  initMsg = itw.startTime && itw.endTime ?
                      [moment(moment(Number(itw.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
                      moment(moment(Number(itw.endTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD')] : [];
                  renderForm = (
                    <RangePicker
                      style={{width: '280px' }}
                      placeholder={itw.note ? itw.note : '请选择时间'}
                      format="YYYY-MM-DD"
                      disabled={modify && itw.isModify}
                      showTime={{
                        hideDisabledOptions: true,
                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                      }}
                    />
                  );
                }
              }
              return (
                <>
                  {
                    isShow&&itw.status && (itw.fieldType !== 3) && itw.fieldType !== 9
                    && itw.fieldType !== 10 ?
                      <Form.Item label={itw.name} >
                        {
                          getFieldDecorator(itw.field, {
                            initialValue: initMsg || undefined,
                            rules: [
                              {
                                required: !!(itw.isWrite),
                                message: `请${Number(itw.fieldType === 2) ? '选择' : '输入'}${itw.name}`
                              },
                              ...rule,
                            ],
                          })(
                            renderForm
                          )
                        }
                        {
                          itw.itemExplain && !!(itw.itemExplain.length) &&
                          itw.itemExplain.map(item => (
                            <p className="fs-12 c-black-45 li-1 m-t-8" style={{marginBottom: 0}} key={item.note}>
                              {item.note}
                            </p>
                          ))
                        }
                      </Form.Item>
                      :
                      null
                  }
                </>
              );
            }
              return (
                <>
                  {
                    isShow&&itw.field === 'reason' && !!(itw.status) &&
                      <Form.Item label={showField.reason && showField.reason.name} style={{width: '936px', marginTop: '24px'}}>
                        {
                          getFieldDecorator('reason', {
                            initialValue: details.reason || '',
                            rules:[
                              { required: true, message: '请输入事由' },
                              { max: 500, message: '最多500字' },
                            ]
                          })(
                            <TextArea
                              disabled={modify && showField.reason && !showField.reason.isModify}
                              placeholder={showField.reason && showField.reason.note ? showField.reason.note : '请输入'}
                            />
                          )
                        }
                      </Form.Item>
                  }
                  {
                    isShow&&itw.field === 'userJson' && !!(itw.status) &&
                    <Form.Item label={showField.userJson && showField.userJson.name} >
                      <SelectPeople
                        users={users}
                        placeholder='请选择'
                        onSelectPeople={(val) => this.selectPle(val)}
                        invalid={false}
                        disabled={Number(templateType) || modify}
                        flag="users"
                        isInput
                        multiple={false}
                        close
                      />
                    </Form.Item>
                  }
                  {
                    isShow&&itw.field === 'deptId' && !!(itw.status) &&
                    <Form.Item label={showField.deptId && showField.deptId.name} >
                      {
                        getFieldDecorator('deptId', {
                          initialValue: details.deptId
                            && deptList.findIndex(it => `${it.deptId}` === `${details.deptId}`) > -1
                            ? `${details.deptId}` : '',
                          rules: [{ required: true, message: `请选择${showField.deptId && showField.deptId.name}` }]
                        })(
                          <Select
                            placeholder={showField.deptId && showField.deptId.note ? showField.deptId.note : '请选择'}
                            onChange={this.onChangeDept}
                            disabled={modify}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                          >
                            {
                              deptList && deptList.map(it => (
                                <Option key={it.deptId}>{it.name}</Option>
                              ))
                            }
                          </Select>
                        )
                      }
                      {
                        itw.itemExplain && !!(itw.itemExplain.length) &&
                        itw.itemExplain.map(item => (
                          <p className="fs-12 c-black-45 li-1 m-t-8" style={{marginBottom: 0}} key={item.note}>
                            {item.note}
                          </p>
                        ))
                      }
                    </Form.Item>
                  }
                  {
                    isShow&&itw.field === 'deptId' && !modify &&
                      <Form.Item label={labelInfo.createDeptId} >
                        {
                          getFieldDecorator('createDeptId', {
                            initialValue: details.createDeptId
                              && createDeptList.findIndex(it => `${it.deptId}` === `${details.createDeptId}`) > -1
                              ? `${details.createDeptId}` : '',
                            rules: [{ required: true, message: '请选择部门' }]
                          })(
                            <Select
                              placeholder={showField.createDeptId && showField.createDeptId.note
                              ? showField.createDeptId.note : '请选择'}
                              onChange={this.onChangeCreate}
                              getPopupContainer={triggerNode => triggerNode.parentNode}
                              disabled={modify}
                            >
                              {
                                createDeptList && createDeptList.map(it => (
                                  <Option key={`${it.deptId}`}>{it.name}</Option>
                                ))
                              }
                            </Select>
                          )
                        }
                      </Form.Item>
                  }
                  {
                    isShow && itw.field === 'office' && officeList.length > 0 && !modify &&
                      <Form.Item label={labelInfo.officeId} >
                        {
                          getFieldDecorator('officeId', {
                            initialValue: details.officeId &&
                            officeList.findIndex(it => it.id === details.officeId) > -1 ?
                            `${details.officeId}` : officeList.length === 1 ? officeList[0].id : undefined,
                            rules: [{ required: true, message: '请选择公司' }]
                          })(
                            <Select
                              placeholder='请选择'
                              getPopupContainer={triggerNode => triggerNode.parentNode}
                              disabled={modify}
                              onChange={e => this.props.onChangeOffice(e, () => {
                                this.props.form.setFieldsValue({ officeId: details.officeId });
                              })}
                            >
                              {
                                officeList && officeList.map(it => (
                                  <Option key={`${it.id}`}>{it.officeName}</Option>
                                ))
                              }
                            </Select>
                          )
                        }
                        {
                          itw.itemExplain && !!(itw.itemExplain.length) &&
                          itw.itemExplain.map(item => (
                            <p className="fs-12 c-black-45 li-1 m-t-6" style={{ marginBottom: 0}} key={item.note}>
                              {item.note}
                            </p>
                          ))
                        }
                      </Form.Item>
                  }
                  {
                    isShow&&itw.field === 'loanSum' && itw.status ?
                      <Form.Item label={showField.loanSum && showField.loanSum.name} >
                        {
                          getFieldDecorator('loanSum', {
                            initialValue: details.loanSum || '',
                            rules: [{
                              required: !!(showField.loanSum && showField.loanSum.isWrite),
                              message: `请输入${showField.loanSum && showField.loanSum.name}`
                            }, {
                              validator: this.checkMoney
                            }]
                          })(
                            <InputNumber
                              disabled={modify && !showField.loanSum.isModify}
                              onChange={val => this.inputMoney(val)}
                              placeholder={showField.loanSum && showField.loanSum.note ?
                              showField.loanSum.note : `请输入${showField.loanSum && showField.loanSum.name}`}
                              style={{width: '100%'}}
                            />
                          )
                        }
                        {
                          <Capitalization isMoney={this.state.money || details.loanSum||''}/>
                        }
                        {
                          itw.itemExplain && !!(itw.itemExplain.length) &&
                          itw.itemExplain.map(item => (
                            <p className="fs-12 c-black-45 li-1 m-t-6" style={{ marginBottom: 0}} key={item.note}>
                              {item.note}
                            </p>
                          ))
                        }
                      </Form.Item>
                      :
                      null
                  }
                  {
                    isShow&&itw.field === 'applicationSum' && itw.status ?
                      <Form.Item label={showField.applicationSum && showField.applicationSum.name} >
                        {
                          getFieldDecorator('applicationSum', {
                            initialValue: details.applicationSum || '',
                            rules: [{
                              required: !!(showField.applicationSum && showField.applicationSum.isWrite),
                              message: `请输入${showField.applicationSum && showField.applicationSum.name}`
                            }, {
                              validator: this.checkMoney
                            }]
                          })(
                            <InputNumber
                              disabled={modify && !showField.applicationSum.isModify}
                              onChange={val => this.inputMoney(val)}
                              placeholder={showField.applicationSum && showField.applicationSum.note ?
                                showField.applicationSum.note : `请输入${showField.applicationSum && showField.applicationSum.name}`}
                              style={{width: '100%'}}
                            />
                          )
                        }
                        {
                          <div style={{marginTop:'4px!important'}}><Capitalization isMoney={this.state.money || details.applicationSum||''}/></div>
                        }
                        {
                          itw.itemExplain && !!(itw.itemExplain.length) &&
                          itw.itemExplain.map(item => (
                            <p className="fs-12 c-black-45 li-1 m-t-6" style={{marginBottom: 0}} key={item.note}>
                              {item.note}
                            </p>
                          ))
                        }
                      </Form.Item>
                      :
                      null
                  }
                  {
                    isShow&&itw.field === 'repaymentTime' && itw.status ?
                      <Form.Item label={showField.repaymentTime && showField.repaymentTime.name} >
                        {
                          getFieldDecorator('repaymentTime', {
                            initialValue: details.repaymentTime ?
                            moment(moment(Number(details.repaymentTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD') : '',
                            rules: [{
                              required: !!(showField.repaymentTime && showField.repaymentTime.isWrite),
                              message: `请选择${showField.repaymentTime && showField.repaymentTime.name}`
                            }]
                          })(
                            <DatePicker
                              disabledDate={defaultFunc.disabledDate}
                              disabledTime={defaultFunc.disabledDateTime}
                              disabled={modify && !showField.repaymentTime.isModify}
                            />
                          )
                        }
                        {
                          itw.itemExplain && !!(itw.itemExplain.length) &&
                          itw.itemExplain.map(item => (
                            <p className="fs-12 c-black-45 li-1 m-t-8" style={{marginBottom: 0}} key={item.note}>
                              {item.note}
                            </p>
                          ))
                        }
                      </Form.Item>
                      :
                      null
                  }
                  {
                    isShow&&itw.field === 'month' && itw.status ?
                      <Form.Item label={showField.month && showField.month.name} >
                        {
                          getFieldDecorator('month', {
                            initialValue: details.month ?
                            moment(moment(Number(details.month)).format('YYYY-MM'), 'YYYY-MM') : undefined,
                            rules: [{
                              required: !!(showField.month && showField.month.isWrite),
                              message: `请选择${showField.month && showField.month.name}`
                            }]
                          })(
                            <MonthPicker placeholder={showField.month.note || '请选择'} />
                          )
                        }
                        {
                          itw.itemExplain && !!(itw.itemExplain.length) &&
                          itw.itemExplain.map(item => (
                            <p className="fs-12 c-black-45 li-1 m-t-8" style={{marginBottom: 0}} key={item.note}>
                              {item.note}
                            </p>
                          ))
                        }
                      </Form.Item>
                      :
                      null
                  }
                  {
                    isShow&&itw.field === 'happenTime' && itw.status ?
                      <Form.Item label={showField.happenTime && showField.happenTime.name} >
                        {
                          Number(showField.happenTime.dateType) === 1 &&
                          getFieldDecorator('time', {
                            initialValue: details.startTime ?
                            moment(moment(Number(details.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD') : '',
                            rules: [{ required: !!(showField.happenTime.isWrite), message: '请选择时间' }]
                          })(
                            <DatePicker
                              style={{width: '100%'}}
                              disabled={modify && !showField.happenTime.isModify}
                            />
                          )
                        }
                        {
                          Number(showField.happenTime.dateType) === 2 &&
                          getFieldDecorator('time', {
                            initialValue: details.startTime && details.endTime ?
                              [moment(moment(Number(details.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
                              moment(moment(Number(details.endTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD')]
                              :
                              [],
                            rules: [{ required: !!(showField.happenTime.isWrite), message: '请选择时间' }]
                          })(
                            <RangePicker
                              style={{width: '280px' }}
                              placeholder={showField.happenTime && showField.happenTime.note ?
                              showField.happenTime.note : '请选择时间'}
                              disabled={modify && !showField.happenTime.isModify}
                              format="YYYY-MM-DD"
                              showTime={{
                                hideDisabledOptions: true,
                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                              }}
                            />
                          )
                        }
                        {
                          itw.itemExplain && !!(itw.itemExplain.length) &&
                          itw.itemExplain.map(item => (
                            <p className="fs-12 c-black-45 li-1 m-t-8" style={{marginBottom: 0}} key={item.note}>
                              {item.note}
                            </p>
                          ))
                        }
                      </Form.Item>
                      :
                      null
                  }
                  {
                    isShow&&itw.field === 'imgUrl' && showField.imgUrl.status ?
                      <Form.Item
                        label={labelInfo.imgUrl}

                      >
                        {
                          getFieldDecorator('img', {
                            initialValue: imgUrl && imgUrl.length ? imgUrl : null,
                            rules: [{
                              required: !!(showField.imgUrl.isWrite),
                              message: '请选择图片'
                            }]
                          })(
                            <UploadImg
                              onChange={(val) => this.onChangeImg(val, 'imgUrl')}
                              imgUrl={imgUrl}
                              userInfo={userInfo}
                              disabled={modify && !showField.imgUrl.isModify}
                              maxLen={9}
                            />
                          )
                        }
                        {
                          itw.itemExplain && !!(itw.itemExplain.length) &&
                          itw.itemExplain.map(item => (
                            <p className="fs-12 c-black-45 li-1 m-t-8" style={{marginBottom: 0}} key={item.note}>
                              {item.note}
                            </p>
                          ))
                        }
                      </Form.Item>
                      :
                      null
                  }
                  {
                    isShow&&itw.field === 'ossFileUrl' && showField.ossFileUrl.status ?
                      <Form.Item
                        label={showField.ossFileUrl.name}
                      >
                        {
                          getFieldDecorator('ossFileUrl', {
                            initialValue: ossFileUrl.length ? ossFileUrl : null,
                            rules: [{
                              required: !!(showField.ossFileUrl.isWrite), message :
                              `请选择${showField.ossFileUrl.name}`
                            }]
                          })(
                            <UploadFile
                              onChange={(val) => this.onChangeImg(val, 'ossFileUrl')}
                              fileUrl={ossFileUrl}
                              userInfo={userInfo}
                              disabled={modify && !showField.ossFileUrl.isModify}
                            />
                          )
                        }
                        {
                          itw.itemExplain && !!(itw.itemExplain.length) &&
                          itw.itemExplain.map(item => (
                            <p className="fs-12 c-black-45 li-1 m-t-8" style={{marginBottom: 0}} key={item.note}>
                              {item.note}
                            </p>
                          ))
                        }
                      </Form.Item>
                      :
                      null
                  }
                  {
                    isShow&&itw.field === 'fileUrl' && showField.fileUrl.status ?
                      <Form.Item
                        label={labelInfo.fileUrl}

                      >
                        {
                          getFieldDecorator('fileUrl', {
                            initialValue: fileUrl && fileUrl.length ? fileUrl : null,
                            rules: [{
                              required: !!(showField.fileUrl.isWrite),
                              message: '请选择附件'
                            }]
                          })(
                            <Button
                              onClick={() => uploadFiles((val) => {
                                if (val && val.length) {
                                  this.props.form.setFieldsValue({ fileUrl: val });
                                }
                              })}
                              disabled={(modify && !showField.fileUrl.isModify)}
                            >
                              <Icon type="upload" /> 上传文件
                            </Button>
                          )
                        }
                        {
                          itw.itemExplain && !!(itw.itemExplain.length) &&
                          itw.itemExplain.map(item => (
                            <p className="fs-12 c-black-45 li-1 m-t-8" style={{marginBottom: 0}} key={item.note}>
                              {item.note}
                            </p>
                          ))
                        }
                        <p className="fs-14 c-black-45 li-1 m-t-8" style={{marginBottom: 0}}>
                          支持扩展名：.rar .zip .doc .docx .pdf .jpg...
                        </p>
                        {
                          fileUrl.map((it, index) => (
                            <div key={it.fileId} className={style.fileList} onClick={() => this.previewFiless(it)}>
                              <div className={style.fileIcon}>
                                <img
                                  className='attachment-icon'
                                  src={fileIcon[it.fileType]}
                                  alt='attachment-icon'
                                />
                                <span className="eslips-1">{it.fileName}</span>
                              </div>
                              <i
                                className="iconfont icondelete_fill"
                                onClick={(e) => this.onDelFile(index, e, modify && !showField.fileUrl.isModify)}
                              />
                            </div>
                          ))
                        }
                      </Form.Item>
                      :
                      null
                  }
                  {
                    isShow&&itw.field === 'project' && showField.project.status ?
                      <Form.Item label={labelInfo.project} >
                        {
                          getFieldDecorator('projectId', {
                            initialValue: details.projectId || undefined,
                            rules: [{ required: !!(showField.project.isWrite), message: '请选择项目' }]
                          })(
                            <TreeSelect
                              style={{width: '100%'}}
                              placeholder={showField.project && showField.project.note ?
                              showField.project.note : '请选择'}
                              dropdownStyle={{height: '300px'}}
                              showSearch
                              treeNodeFilterProp='title'
                              disabled={modify && !showField.project.isModify}
                              getPopupContainer={triggerNode => triggerNode.parentNode}
                              onChange={(val) => this.onChangePro(val, 'project')}
                            >
                              {this.renderTreeNodes(projectList)}
                            </TreeSelect>
                          )
                        }
                        {
                          itw.itemExplain && !!(itw.itemExplain.length) &&
                          itw.itemExplain.map(item => (
                            <p className="fs-12 c-black-45 li-1 m-t-8" style={{marginBottom: 0}} key={item.note}>
                              {item.note}
                            </p>
                          ))
                        }
                      </Form.Item>
                      :
                      null
                  }
                  {
                    isShow&&itw.field === 'supplier' && showField.supplier.status ?
                      <Form.Item label={labelInfo.supplier} >
                        {
                          getFieldDecorator('supplier', {
                            initialValue: details.supplier || undefined,
                            rules: [{ required: !!(showField.supplier.isWrite), message: '请选择供应商账号' }]
                          })(
                            <TreeSelect
                              showSearch
                              treeNodeFilterProp='searchs'
                              placeholder={showField.supplier && showField.supplier.note ?
                              showField.supplier.note : '请选择'}
                              style={{width: '100%'}}
                              treeDefaultExpandAll
                              dropdownStyle={{height: '300px'}}
                              onChange={(val) => this.onChangePro(val, 'supplier')}
                              treeNodeLabelProp="newName"
                              getPopupContainer={triggerNode => triggerNode.parentNode}
                              disabled={modify && !showField.supplier.isModify}
                            >
                              {this.treeNodeRender(supplierList)}
                            </TreeSelect>
                          )
                        }
                        {
                          itw.itemExplain && !!(itw.itemExplain.length) &&
                          itw.itemExplain.map(item => (
                            <p className="fs-12 c-black-45 li-1 m-t-8" style={{marginBottom: 0}} key={item.note}>
                              {item.note}
                            </p>
                          ))
                        }
                      </Form.Item>
                      :
                      null
                  }
                  {
                    isShow&&itw.field === 'note' && showField.note.status ?
                      <Form.Item label={labelInfo.note} >
                        {
                          getFieldDecorator('note',{
                            initialValue: details.note || '',
                            rules: [
                              { required: !!(showField.note.isWrite), message: '请输入备注' },
                              { max: 500, message: '备注最多500个字' },
                            ]
                          })(
                            <Input
                              placeholder={showField.note && showField.note.note ? showField.note.note : '请输入'}
                              disabled={modify && !showField.note.isModify}
                            />
                          )
                        }
                        {
                          itw.itemExplain && !!(itw.itemExplain.length) &&
                          itw.itemExplain.map(item => (
                            <p className="fs-12 c-black-45 li-1 m-t-8" style={{marginBottom: 0}} key={item.note}>
                              {item.note}
                            </p>
                          ))
                        }
                      </Form.Item>
                      :
                      null
                  }
                  {
                    isShow&&itw.field === 'receiptId' && showField.receiptId.status ?
                      <Form.Item label={labelInfo.receiptId}>
                        {
                          getFieldDecorator('receiptId', {
                            initialValue: details.receiptId ? [details.receiptId] : undefined,
                            rules: [{ required: !!(showField.receiptId && showField.receiptId.isWrite), message: '请输入收款账户' }],
                          })(
                            <Select
                              placeholder={showField.receiptId && showField.receiptId.note ?
                              showField.receiptId.note : placeholderType[showField.receiptId.fieldType]}
                              dropdownClassName={style.opt}
                              onChange={(val) => this.onChangeAcc(val)}
                              optionLabelProp="label"
                              getPopupContainer={triggerNode => triggerNode.parentNode}
                              disabled={modify && !showField.receiptId.isModify}
                              showSearch
                              optionFilterProp="label"
                              style={{width: '238px'}}
                            >
                              {
                                accountList.map(it => (
                                  <Option key={it.id} value={it.id} label={it.name}>
                                    <div className={style.selects}>
                                      <p className="c-black fs-14">{it.name} </p>
                                      <p className="c-black-36 fs-13">{typeObj[it.type]}{it.account}</p>
                                    </div>
                                    <Divider type="horizontal" />
                                  </Option>
                                ))
                              }
                            </Select>
                          )
                        }
                        {
                          !modify &&
                          <ReceiptModal title="add" onOk={handelAcc}>
                            <a className={style.addReceipt}>新增</a>
                          </ReceiptModal>
                        }
                        {
                          itw.itemExplain && !!(itw.itemExplain.length) &&
                          itw.itemExplain.map(item => (
                            <p className="fs-12 c-black-45 li-1 m-t-8" style={{marginBottom: 0}} key={item.note}>
                              {item.note}
                            </p>
                          ))
                        }
                      </Form.Item>
                    :
                    null
                  }
                </>
              );
          })
        }
      </Form>
    );
  }
}

export default ChangeForm;
