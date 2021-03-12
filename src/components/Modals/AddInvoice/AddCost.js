/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Divider, InputNumber, Select, DatePicker, message, TreeSelect, Tree, Button } from 'antd';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import cs from 'classnames';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import style from './index.scss';
import UploadImg from '../../UploadImg';
import AddCostTable from './AddCostTable';
import { compare, setTime } from '../../../utils/common';
// import TreeCatogory from './TreeCatogory';

const { Option } = Select;
const { TreeNode } = Tree;
const { RangePicker } = DatePicker;
const labelInfo = {
  costName: '支出类别',
  costSum: '金额(元)',
  costNote: '备注',
  imgUrl: '图片',
  happenTime: '发生日期',
};
@Form.create()
@connect(({ global, costGlobal, session }) => ({
  expenseList: global.expenseList,
  deptInfo: global.deptInfo,
  userId: global.userId,
  usableProject: global.usableProject,
  lbDetail: global.lbDetail,
  currencyList: global.currencyList,
  currencyShow: global.currencyShow,
  costCategoryList: global.costCategoryList,
  detailFolder: costGlobal.detailFolder,
  userInfo: session.userInfo,
  userDeps: costGlobal.userDeps,
}))
class AddCost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      costDetailShareVOS: [],
      initDep: [],// 初始化承担部门
      costDate: 0, // 没有指定日期
      showField: {}, // 是否展示
      newShowField: [],
      imgUrl: [],
      details: props.detail || {}, // 详细信息
      costSum: 0,
      shareAmount: 0,
      project: {},
      expandField: [],
      currencyId: '-1',
      currencyName: '',
      exchangeRate: '1',
      currencySymbol: '¥',
    };
  }

  onShow = async() => {
    const _this = this;
    const { costType, id, isDelete4Category } = this.props;
    if (isDelete4Category) {
      message.error('该支出类别已被管理员删除');
      return;
    }
    await this.props.dispatch({
      type: 'global/users',
      payload: {
        type: 1
      }
    });
    const dep = await _this.props.deptInfo;
    this.setState({
      initDep: dep,
    });
    this.props.dispatch({
      type: 'global/getCurrency',
      payload: {},
    });
    await this.props.dispatch({
      type: 'global/usableSupplier',
      payload: {},
    });
    await this.props.dispatch({
      type: 'global/usableProject',
      payload: {
        type: 1,
      },
    });
    if (costType) {
      await this.props.dispatch({
        type: 'global/costList',
        payload: {},
      }).then(() => {
        if (id) {
          this.props.dispatch({
            type: 'costGlobal/detailFolder',
            payload: {
              id,
            }
          }).then(async() => {
            const { detailFolder, currencyList } = this.props;
            console.log('AddCost -> onShow -> detailFolder', detailFolder);
            const userIds = detailFolder.costDetailShareVOS.map(it => it.userId).filter(item => item);
            const arr = [];
            let currency = {};
            if (detailFolder.currencyId && detailFolder.currencyId !== '-1') {
              // eslint-disable-next-line prefer-destructuring
              currency = currencyList.filter(it => it.id === detailFolder.currencyId)[0];
            }
            if (userIds && userIds.length) {
              this.props.dispatch({
                type: 'costGlobal/userDep',
                payload: {
                  userIds: [...new Set(userIds)],
                }
              }).then(async() => {
                detailFolder.costDetailShareVOS.forEach((it) => {
                  const { userDeps } = this.props;
                  console.log('AddCost -> onShow -> userDeps', userDeps);
                  const obj = {
                    ...it,
                    key: it.id,
                    shareScale: it.shareScale/100,
                    shareAmount: currency.id ? it.currencySum/100 : it.shareAmount/100,
                  };
                  if (!it.userId) {
                    Object.assign(obj, {
                      depList: dep,
                    });
                  } else {
                    Object.assign(obj, {
                      users: it.userJson ? it.userJson.map(its => { return { ...its, userName: its.name }; }) : [],
                      depList: userDeps[`${it.userId}`],
                    });
                  }
                  arr.push(obj);
                });
                this.setState({
                  details: {
                    ...detailFolder,
                    costSum: currency.id ? detailFolder.currencySum/100 : Number(detailFolder.costSum)/100,
                  },
                  shareAmount: currency.id ? detailFolder.currencySum/100 : Number(detailFolder.costSum)/100,
                  costSum: currency.id ? detailFolder.currencySum/100 : Number(detailFolder.costSum)/100,
                  costDetailShareVOS: arr,
                  currencyId: currency.id || '-1',
                  currencyName: currency.name || '',
                  exchangeRate: currency.exchangeRate || 1,
                  currencySymbol: currency.currencySymbol || '¥',
                  imgUrl: detailFolder.imgUrl,
                });
                const expands = detailFolder.selfCostDetailFieldVos ?
                  [...detailFolder.expandCostDetailFieldVos, ...detailFolder.selfCostDetailFieldVos]
                  :
                  [...detailFolder.expandCostDetailFieldVos];
                console.log('AddCost -> onShow -> expands', expands);
                this.onChange(detailFolder.categoryId, 'folder', expands);
                await this.setState({
                  visible: true,
                });
              });
            } else {
              detailFolder.costDetailShareVOS.forEach((it) => {
                const obj = {
                  ...it,
                  key: it.id,
                  shareScale: it.shareScale/100,
                  shareAmount: currency.id ? it.currencySum/100 : it.shareAmount/100,
                  depList: dep,
                };
                arr.push(obj);
              });
              let amounts = 0;
              if (currency.id && arr.length) {
                amounts = detailFolder.currencySum/100;
              } else if (!currency.id && arr.length ) {
                amounts = detailFolder.costSum/100;
              }
              this.setState({
                details: {
                  ...detailFolder,
                  costSum: currency.id ? detailFolder.currencySum/100 : Number(detailFolder.costSum)/100,
                },
                shareAmount: amounts,
                costSum: currency.id ? detailFolder.currencySum/100 : Number(detailFolder.costSum)/100,
                costDetailShareVOS: arr,
                currencyId: currency.id || '-1',
                currencyName: currency.name || '',
                exchangeRate: currency.exchangeRate || 1,
                currencySymbol: currency.currencySymbol || '¥',
                imgUrl: detailFolder.imgUrl,
              });
              const expands = detailFolder.selfCostDetailFieldVos ?
              [...detailFolder.expandCostDetailFieldVos, ...detailFolder.selfCostDetailFieldVos]
              :
              [...detailFolder.expandCostDetailFieldVos];
              console.log('AddCost -> onShow -> expands', expands);
              this.onChange(detailFolder.categoryId, 'folder', expands);
              await this.setState({
                visible: true,
              });
            }
          });
        } else {
          this.setState({
            visible: true,
          });
        }
      });
    } else {
      await this.props.dispatch({
        type: 'global/expenseList',
        payload: {
          id: this.props.invoiceId
        }
      }).then(() => {
        const { index, detail, expandField } = this.props;
        if (index === 0 || index) {
          this.setState({
            details: detail,
            costDetailShareVOS: detail.costDetailShareVOS,
            expandField,
            imgUrl: detail.imgUrl || [],
            costSum: detail.costSum,
            shareAmount: detail.shareTotal,
          }, () => {
            const newExpands = expandField;
            this.onChange(this.props.detail.categoryId, 'folder', newExpands);
          });
        }
        this.setState({
          visible: true,
        });
      });
    }
  }

  onCancel = (flag) => {
    this.props.form.resetFields();
    if (!flag) {
      this.setState({
        visible: false,
        initDep: [],// 初始化承担部门
      });
    }
    this.setState({
      imgUrl: [],
      costDetailShareVOS: [],
      costDate: 0, // 没有指定日期
      showField: {}, // 是否展示
      newShowField: [],
      expandField: [],
      shareAmount: 0,
      costSum: 0,
      currencyId: '-1',
      currencyName: '',
      exchangeRate: '1',
      currencySymbol: '¥',
    });
  }

  onSelectTree = () => {
    const { expenseList, costCategoryList, costType } = this.props;
    const newList = costType ? costCategoryList : expenseList;
    const list = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tId: 'value',
      tName: 'title',
      otherKeys: ['type','showField', 'icon']
    }, newList);
    function addParams(lists){
      lists.forEach(it => {
        if (it.type === 0) {
          it.disabled = true;
        }
        if (it.type === 1) {
          it.disabled = false;
        }
        if (it.children) {
          addParams(it.children);
        }
      });
    }
    addParams(list);
    return list;
  }

  //  提交
  handleOk = (flag) => {
    const {
      index,
      costType,
      costTitle,
      id,
      lbDetail,
      modify
    } = this.props;
    const {
      costDate,
      costDetailShareVOS,
      details,
      imgUrl,
      shareAmount,
      expandField,
      currencyId,
      currencyName,
      exchangeRate,
      currencySymbol
    } = this.state;
    const _this = this;

    this.props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        // eslint-disable-next-line eqeqeq
        if (costDetailShareVOS.length !== 0 && shareAmount != val.costSum) {
          message.error('分摊明细金额合计不等于支出金额，请修改');
          return;
        }
        let detail = {
          costDate,
          note: val.note || '',
          costSum: val.costSum,
          categoryId: val.categoryId,
          imgUrl,
          shareTotal: shareAmount,
          categoryName: details.categoryName,
          icon: lbDetail.icon,
          detailFolderId: costTitle === 'edit' ? id : '',
          attribute: lbDetail.attribute,
        };
        const expandCostDetailFieldVos = [];
        const selfCostDetailFieldVos = []; // 私有字段
        if (expandField && expandField.length > 0) {
          expandField.forEach(it => {
            const obj = {
              ...it,
              msg: Number(it.fieldType) === 5 && val[it.field] ? JSON.stringify(val[it.field]) : val[it.field],
            };
            if (Number(it.fieldType) === 5 && val[it.field]) {
              Object.assign(obj, {
                startTime: Number(it.dateType) === 2 ?
                moment(val[it.field][0]).format('x') : moment(val[it.field]).format('x'),
                endTime: Number(it.dateType) === 2 ?
                setTime({ time: val[it.field][1], type: 'x' }) : '',
              });
            }
            if (it.status && it.field.indexOf('expand_') > -1) {
              expandCostDetailFieldVos.push(obj);
            } else if (it.status) {
              selfCostDetailFieldVos.push(obj);
            }
          });
        }
        if (costDate === 1) {
          detail = {
            ...detail,
            startTime: val.time ? moment(val.time).format('x') : ''
          };
        }
        if (costDate === 2) {
          if (val.time && val.time.length > 0) {
            detail = {
              ...detail,
              startTime: moment(val.time[0]).format('x'),
              endTime: moment(val.time[1]).format('x')
            };
          }
        }
        const arr = _this.onGetForm('submit', val.categoryId);
        if (!arr) {
          return;
        }
        detail = {
          ...detail,
          expandCostDetailFieldVos,
          selfCostDetailFieldVos,
          costDetailShareVOS: arr,
          currencyId,
          currencyName,
          exchangeRate,
          currencySymbol
        };
        if (costType) {
          const newArr = [];
          arr.forEach(it => {
            newArr.push({
              costDetailId: val.categoryId,
              totalAmount: (((val.costSum) * 1000)/10).toFixed(0),
              'shareAmount': (it.shareAmount * 1000)/10,
              'shareScale': (it.shareScale * 1000)/10,
              'deptId': it.deptId instanceof Array ? it.deptId[0] : it.deptId,
              'userId': it.userId,
              'userJson':it.users,
              deptName: it.deptName,
              userName: it.userName,
              projectId: it.projectId,
            });
          });
          const url = costTitle === 'edit' ? 'costGlobal/editFolder' : 'costGlobal/addFolder';
          this.props.dispatch({
            type: url,
            payload: {
              ...detail,
              costDetailShareVOS: newArr,
              costSum: (((val.costSum) * 1000)/10).toFixed(0),
              id: costTitle === 'edit' ? id : '',
            }
          }).then(() => {
            this.onCancel(flag);
            if (this.props.onCallback) {
              this.props.onCallback();
            }
            if (this.props.invoiceId) {
              this.props.onAddCost(detail, index);
            }
          });
        } else {
          if (modify) {
            Object.assign(detail, { id: details.id });
          }
          this.props.onAddCost(detail, index);
          this.onCancel();
        }
      }
    });
  }

  toFixed = (num, s) => {
    // eslint-disable-next-line no-restricted-properties
    const times = Math.pow(10, s);
    let des = num * times + 0.5;
    des = parseInt(des, 10) / times;
    return `${des  }`;
  }

  // 循环渲染树结构
  loop = data => data.map(item => {
    if (item.children && item.children.length) {
      return (
        <TreeNode
          key={item.value}
          label={item.title}
          value={item.value}
          disabled={item.disabled}
          title={(
            <div>
              {
                item.type ?
                  <i className={cs(`icon${item.icon}`, 'iconfont')} />
                  :
                  null
              }
              <span>{item.title}</span>
            </div>
          )}
        >
          {this.loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode
      key={item.value}
      label={item.title}
      value={item.value}
      disabled={item.disabled}
      title={(
        <div className="icons">
          {
            item.type ?
              <i className={cs(`icon${item.icon}`, 'iconfont', 'fs-24')} style={{verticalAlign: 'middle'}} />
              :
              null
          }
          <span className="m-l-8" style={{verticalAlign: 'middle'}}>{item.title}</span>
        </div>
      )}
    />;
  });

  // 选择支出类别
  onChange = (val, types, expand) => {
    console.log('AddCost -> onChange -> expand', expand);
    let detail = this.state.details;
    const showFields = {};
    let costDate = 0;
    let project = {};
    this.props.dispatch({
      type: 'global/lbDetail',
      payload: {
        id: val,
      }
    }).then(() => {
      const { lbDetail } = this.props;
      detail = {
        ...detail,
        categoryName: lbDetail.costName,
        icon: lbDetail.icon,
      };
      this.props.form.setFieldsValue({
        time: null
      });
      console.log('AddCost -> onChange -> detail', detail);
      if (lbDetail.showField) {
        const str = lbDetail.showField;
        str.forEach(it => {
          showFields[it.field] = {...it};
          if (it.field === 'happenTime') {
            costDate = it.dateType ? Number(it.dateType) : 1;
          }
        });
      }
      if (lbDetail.shareField) {
        const strs = lbDetail.shareField;
        strs.forEach(it => {
          if (it.field === 'project') {
            project = {...it};
          }
        });
      }
      if (types === 'folder') {
        const expands = [];
        if (lbDetail.expandField) {
          lbDetail.expandField.forEach(it => {
            const index = expand.findIndex(its => its.field === it.field);
            console.log('AddCost -> onChange -> index', lbDetail.expandField);
            if (index > -1 && it.status) {
              expands.push({
                ...it,
                msg: expand[index].msg,
                startTime: expand[index].startTime || '',
                endTime: expand[index].endTime || '',
              });
            } else if (it.status && index === -1) {
              expands.push({ ...it });
            }
          });
        }
        console.log('AddCost -> onChange -> expands', expands);
        this.setState({
          expandField: expands,
        });
      }
      if (types !== 'edit' && types !== 'folder') {
        const newArr = lbDetail.expandField || [];
        this.setState({
          expandField: newArr,
        });
      }
      this.setState({
        showField: showFields,
        newShowField: lbDetail.showField,
        costDate,
        details: detail,
        project,
      });
    });

  }


  onChangeImg = (val) => {
    this.setState({
      imgUrl: val,
    });
  }

  onChangeAmm = (val) => {
    this.setState({
      costSum: val,
    }, () => {
      const details = [...this.state.costDetailShareVOS];
      if (details && details.length) {
        this.onGetForm('setScale', details, val);
      }
    });
  }

  checkMoney = (rule, value, callback) => {
    if (value) {
      if(!/((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/.test(value)) {
        callback('请输入正确的金额');
      }
      if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(value)) {
        callback('金额小数不能超过2位');
      }
      if (value > 100000000 || value === 100000000) {
        callback('金额需小于1个亿');
      }
      if (value < 0) {
        callback('金额不能小于零');
      }
      callback();
    } else {
      callback();
    }
  }

  onChangeCurr = (option) => {
    if (option !== '-1') {
      const lists = this.props.currencyList.filter(it => it.id === option);
      this.setState({
        currencyId: option,
        currencyName: lists[0].name,
        exchangeRate: lists[0].exchangeRate,
        currencySymbol: lists[0].currencySymbol
      });
    } else {
      this.setState({
        currencyId: '-1',
        currencyName: '人民币',
        exchangeRate: '1',
        currencySymbol: '¥'
      });
    }
  }

  onChangeState = (type, val) => {
    this.setState({
      [type]: val,
    });
  }

  render() {
    const {
      children,
      form: { getFieldDecorator },
      // expenseList,
      userInfo,
      currencyList,
      currencyShow,
      againCost,
      modify
    } = this.props;

    const list = this.onSelectTree();
    const {
      visible,
      costDetailShareVOS,
      imgUrl,
      showField,
      newShowField,
      costDate,
      details,
      costSum,
      shareAmount,
      project,
      expandField,
      exchangeRate,
      currencySymbol,
      currencyId,
    } = this.state;
    const newRenderField = [...newShowField, ...expandField].sort(compare('sort'));
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    };
    const formItemLayouts = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };
    console.log(details.startTime);
    return (
      <span className={cs('formItem', style.addCost)}>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="添加支出"
          visible={visible}
          width="880px"
          bodyStyle={{height: '470px', overflowY: 'scroll'}}
          onCancel={() => this.onCancel()}
          maskClosable={false}
          footer={(
            <>
              {
                againCost ?
                  <Button onClick={() => this.handleOk(true)}>再记一笔</Button>
                  :
                  <Button onClick={() => this.onCancel()}>取消</Button>
              }
              <Button type="primary" onClick={() => this.handleOk()}>保存</Button>
            </>
          )}
        >
          <div className={style.addCosts}>
            <Form>
              <Row>
                <Col span={12}>
                  <Form.Item label={labelInfo.costName} {...formItemLayout}>
                    {
                      getFieldDecorator('categoryId', {
                        initialValue: details.categoryId || undefined,
                        rules: [{ required: true, message: '请选择支出类别' }]
                      })(
                        <TreeSelect
                          placeholder="请选择"
                          onChange={this.onChange}
                          style={{width: '100%'}}
                          treeDefaultExpandAll
                          dropdownStyle={{height: '300px'}}
                          disabled={modify && details.categoryId}
                        >
                          {this.loop(list)}
                        </TreeSelect>
                      )
                    }
                  </Form.Item>
                </Col>
                {
                  currencyShow ?
                    <Col span={12}>
                      <Form.Item label="币种" {...formItemLayouts}>
                        {
                          getFieldDecorator('currencyId', {
                            initialValue: details.currencyId || '-1',
                            rules: [{ required: true, message: '请选择币种' }]
                          })(
                            <Select
                              placeholder="请选择"
                              onChange={this.onChangeCurr}
                            >
                              <Option key="-1">CNY 人民币</Option>
                              {
                                currencyList && currencyList.map(it => (
                                  <Option key={it.id}>{it.currencyCode} {it.name}</Option>
                                ))
                              }
                            </Select>
                          )
                        }
                      </Form.Item>
                      {
                        exchangeRate && exchangeRate !== '1' ?
                          <span style={{float: 'left', margin: '-55px 24px 0 271px'}} className="c-black-36">汇率{exchangeRate}</span>
                          :
                          null
                      }
                    </Col>
                    :
                    null
                }
                <Col span={12}>
                  <Form.Item label={labelInfo.costSum} {...formItemLayout}>
                    {
                      getFieldDecorator('costSum', {
                        initialValue: details.costSum || '',
                        rules: [
                          { required: true, message: '请输入金额' },
                          { validator: this.checkMoney }
                        ]
                      })(
                        <InputNumber
                          placeholder={showField.amount && showField.amount.note ?
                          showField.amount.note : '请输入'}
                          onChange={(val) => this.onChangeAmm(val)}
                          style={{width: '100%'}}
                          disabled={modify && showField.amount && !showField.amount.isModify}
                        />
                      )
                    }
                  </Form.Item>
                </Col>
                {
                  newRenderField && (newRenderField.length > 0) &&
                  newRenderField.map(it => {
                    if (it.field && (it.field.indexOf('expand_') > -1 || it.field.indexOf('self_') > -1)) {
                      let renderForm = null;
                      let rule = [];
                      let initMsg = it.msg || undefined;
                      if (Number(it.fieldType) === 0) {
                        renderForm = (<Input
                          placeholder={it.note ? it.note : '请输入'}
                          disabled={modify && !it.isModify}
                        />);
                        rule = [{ max: 20, message: '限制20个字' }];
                      } else if (Number(it.fieldType) === 1) {
                        renderForm = (<TextArea
                          placeholder={it.note ? it.note : '请输入'}
                          disabled={modify && !it.isModify}
                        />);
                        rule = [{ max: 128, message: '限制128个字' }];
                      } else if(Number(it.fieldType) === 2) {
                        renderForm = (
                          <Select
                            placeholder={it.note ? it.note : '请选择'}
                            disabled={modify && !it.isModify}
                          >
                            {
                              it.options && it.options.map(iteems => (
                                <Select.Option key={iteems}>{iteems}</Select.Option>
                              ))
                            }
                          </Select>
                        );
                      } else if (it.fieldType === 5) {
                        if (it.dateType === 1) {
                          initMsg = it.startTime && !it.endTime ?
                          moment(moment(Number(it.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD') : '';
                          renderForm = (
                            <DatePicker
                              style={{width: '100%'}}
                              placeholder={it.note ? it.note : '请选择'}
                              disabled={modify && !it.isModify}
                            />
                          );
                        } else {
                          initMsg = it.startTime && it.endTime ?
                              [moment(moment(Number(it.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD'), moment(moment(Number(it.endTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD')] : [];
                          renderForm = (
                            <RangePicker
                              style={{width: '280px' }}
                              placeholder={it.note ? it.note : '请选择时间'}
                              format="YYYY-MM-DD"
                              disabled={modify && !it.isModify}
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
                              it.status ?
                                <Col span={12}>
                                  <Form.Item label={it.name} {...formItemLayout}>
                                    {
                                      getFieldDecorator(it.field, {
                                        initialValue: initMsg || undefined,
                                        rules: [
                                          { required: !!(it.isWrite), message: `请${Number(it.fieldType === 2) ? '选择' : '输入'}${it.name}` },
                                          ...rule,
                                        ]
                                      })(
                                        renderForm
                                      )
                                    }
                                  </Form.Item>
                                </Col>
                                :
                                null
                            }
                          </>
                        );
                    }
                    return (
                      <>
                        {
                          it.field === 'costNote' && showField.costNote.status ?
                            <Col span={12}>
                              <Form.Item label={labelInfo.costNote} {...formItemLayout}>
                                {
                                  getFieldDecorator('note', {
                                    initialValue: details.note || '',
                                    rules: [{ required: !!(showField.costNote.isWrite), message: '请输入备注' }]
                                  })(
                                    <Input
                                      placeholder={showField.costNote.note ? showField.costNote.note : '请输入'}
                                      disabled={modify && !showField.costNote.isModify}
                                    />
                                  )
                                }
                              </Form.Item>
                            </Col>
                          :
                          null
                        }
                        {
                          it.field === 'happenTime' && showField.happenTime.status &&
                          <Col span={12}>
                            <Form.Item label={labelInfo.happenTime} {...formItemLayout}>
                              {
                                costDate === 1 &&
                                getFieldDecorator('time', {
                                  initialValue: details.startTime && !details.endTime ?
                                  moment(moment(Number(details.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD') : moment().startOf('day'),
                                  rules: [{ required: !!(showField.happenTime.isWrite), message: '请选择时间' }]
                                })(
                                  <DatePicker
                                    style={{width: '100%'}}
                                    disabled={modify && !showField.happenTime.isModify}
                                    placeholder={showField.happenTime.note ? showField.happenTime.note : '请选择时间'}
                                  />
                                )
                              }
                              {
                                costDate === 2 &&
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
                                    placeholder={showField.happenTime.note ?
                                    showField.happenTime.note : '请选择时间'}
                                    format="YYYY-MM-DD"
                                    disabled={modify && !showField.happenTime.isModify}
                                    showTime={{
                                      hideDisabledOptions: true,
                                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                    }}
                                  />
                                )
                              }
                            </Form.Item>
                          </Col>
                        }
                        {
                          it.field === 'imgUrl' && showField.imgUrl.status &&
                          <Col span={12}>
                            <Form.Item
                              label={labelInfo.imgUrl}
                              {...formItemLayout}
                            >
                              {
                                getFieldDecorator('img', {
                                  rules: [{
                                    required: !!(showField.imgUrl.isWrite), message: '请选择图片'
                                  }]
                                })(
                                  <UploadImg
                                    onChange={(val) => this.onChangeImg(val)}
                                    imgUrl={imgUrl}
                                    userInfo={userInfo}
                                    disabled={modify && !showField.imgUrl.isModify}
                                  />
                                )
                              }
                            </Form.Item>
                          </Col>
                        }
                      </>
                    );
                  })
                }
              </Row>
              <Divider type="horizontal" />
              <AddCostTable
                costDetailShareVOS={costDetailShareVOS}
                costSum={costSum}
                shareAmount={shareAmount}
                project={project}
                currencySymbol={currencySymbol}
                currencyId={currencyId}
                exchangeRate={exchangeRate}
                initDep={this.state.initDep}
                onChange={(type, val) => this.onChangeState(type, val)}
                invoiceId={this.props.invoiceId}
                costType={this.props.costType}
                onGetForm={fn=> { this.onGetForm = fn; }}
                modify={modify}
              />
            </Form>
          </div>
        </Modal>
      </span>
    );
  }
}

export default AddCost;
