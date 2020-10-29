/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Divider, InputNumber, Select, DatePicker, message, TreeSelect, Tree } from 'antd';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import cs from 'classnames';
import moment from 'moment';
import { JsonParse } from '@/utils/common';
import TextArea from 'antd/lib/input/TextArea';
import style from './index.scss';
import UploadImg from '../../UploadImg';
import AddCostTable from './AddCostTable';
// import TreeCatogory from './TreeCatogory';

const { Option } = Select;
const { TreeNode } = Tree;
const { RangePicker } = DatePicker;
const labelInfo = {
  costName: '费用类别',
  costSum: '金额(元)',
  costNote: '费用备注',
  imgUrl: '图片',
  happenTime: '发生日期'
};
@Form.create()
@connect(({ global, costGlobal }) => ({
  expenseList: global.expenseList,
  deptInfo: global.deptInfo,
  userId: global.userId,
  usableProject: global.usableProject,
  lbDetail: global.lbDetail,
  currencyList: global.currencyList,
  currencyShow: global.currencyShow,
  costCategoryList: global.costCategoryList,
  detailFolder: costGlobal.detailFolder,
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

  componentDidUpdate(prevProps){
    if (prevProps.detail !== this.props.detail) {
      if(this.props.detail){
      // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          details: this.props.detail,
          costDetailShareVOS: this.props.detail.costDetailShareVOS || [],
          imgUrl: this.props.detail.imgUrl,
          currencyId: this.props.detail.currencyId || '-1',
          currencyName: this.props.detail.currencyName || '',
          exchangeRate: this.props.detail.exchangeRate || 1,
          currencySymbol: this.props.detail.currencySymbol || '¥',
        });
      }
    }
  }

  onShow = async() => {
    const _this = this;
    const { costType, id } = this.props;
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
          }).then(() => {
            const { detailFolder, currencyList } = this.props;
            console.log('AddCost -> onShow -> currencyList', currencyList);
            let currency = {};
            if (detailFolder.currencyId && detailFolder.currencyId !== '-1') {
              // eslint-disable-next-line prefer-destructuring
              currency = currencyList.filter(it => it.id === detailFolder.currencyId)[0];
            }
            const arr = [];
            detailFolder.costDetailShareVOS.forEach((it, i) => {
              const obj = {
                ...it,
                key: it.id,
                shareScale: it.shareScale/100,
                shareAmount: currency.id ? it.currencySum/100 : it.shareAmount/100,
              };
              if (!i.userId) {
                Object.assign(obj, {
                  depList: dep,
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
              visible: true,
            }, () => {
              this.onChange(detailFolder.categoryId, 'edit');
            });
          });
        }
        this.setState({
          visible: true,
        });
      });
    } else {
      await this.props.dispatch({
        type: 'global/expenseList',
        payload: {
          id: this.props.invoiceId
        }
      }).then(() => {
        const { index, detail, expandField } = this.props;
        console.log(index, detail);
        if (index === 0 || index) {
          this.setState({
            details: detail,
            costDetailShareVOS: detail.costDetailShareVOS,
            expandField,
            imgUrl: detail.imgUrl || [],
            costSum: detail.costSum,
            shareAmount: detail.shareTotal,
          }, () => {
            this.onChange(this.props.detail.categoryId, 'edit');
          });
        }
        this.setState({
          visible: true,
        });
      });
    }
  }

  onCancel = () => {
    this.props.form.resetFields();
    this.setState({
      imgUrl: [],
      costDetailShareVOS: [],
      initDep: [],// 初始化承担部门
      costDate: 0, // 没有指定日期
      visible: false,
      showField: {}, // 是否展示
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
  handleOk = () => {
    const {
      index,
      costType,
      costTitle,
      id
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
      console.log('AddCost -> handleOk -> val', val);
      if (!err) {
        // eslint-disable-next-line eqeqeq
        if (costDetailShareVOS.length !== 0 && shareAmount != val.costSum) {
          message.error('分摊明细金额合计不等于费用金额，请修改');
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
          icon: details.icon,
        };
        const expandCostDetailFieldVos = [];
        if (expandField && expandField.length > 0) {
          expandField.forEach(it => {
            if (it.status) {
              expandCostDetailFieldVos.push({
                ...it,
                msg: val[it.field],
              });
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
        detail = {
          ...detail,
          expandCostDetailFieldVos,
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
              'deptId': it.deptId,
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
            this.onCancel();
            if (this.props.onCallback) {
              this.props.onCallback();
            }
            if (this.props.invoiceId) {
              this.props.onAddCost(detail, index);
            }
          });
        } else {
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
              <i className={cs(`icon${item.icon}`, 'iconfont')} />
              :
              null
          }
          <span>{item.title}</span>
        </div>
      )}
    />;
  });

  // 选择费用类别
  onChange = (val, types) => {
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
      if (lbDetail.showField) {
        const str = JsonParse(lbDetail.showField);
        str.forEach(it => {
          showFields[it.field] = {...it};
          if (it.field === 'happenTime') {
            console.log(costDate);
            costDate = it.dateType ? Number(it.dateType) : 1;
          }
        });
      }
      if (lbDetail.shareField) {
        const strs = JsonParse(lbDetail.shareField);
        strs.forEach(it => {
          if (it.field === 'project') {
            project = {...it};
          }
        });
      }
      this.setState({
        showField: showFields,
        costDate,
        details: detail,
        project,
      });
      if (types !== 'edit') {
        this.setState({
          expandField: lbDetail.expandField,
        });
      }
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
      currencyShow
    } = this.props;
    const list = this.onSelectTree();
    const {
      visible,
      costDetailShareVOS,
      imgUrl,
      showField,
      costDate,
      details,
      costSum,
      shareAmount,
      project,
      expandField,
      exchangeRate,
      currencySymbol,
      currencyId
    } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const formItemLayouts = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 9 },
      },
    };
    return (
      <span className={cs('formItem', style.addCost)}>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="添加费用"
          visible={visible}
          width="880px"
          bodyStyle={{height: '470px', overflowY: 'scroll'}}
          onCancel={this.onCancel}
          maskClosable={false}
          onOk={() => this.handleOk()}
        >
          <div className={style.addCosts}>
            <Form>
              <Row>
                <Col span={12}>
                  <Form.Item label={labelInfo.costName} {...formItemLayout}>
                    {
                      getFieldDecorator('categoryId', {
                        initialValue: details.categoryId || '',
                        rules: [{ required: true, message: '请选择费用类别' }]
                      })(
                        <TreeSelect
                          placeholder="请选择"
                          onChange={this.onChange}
                          style={{width: '100%'}}
                          treeDefaultExpandAll
                          dropdownStyle={{height: '300px'}}
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
                            <Select placeholder="请选择" onChange={this.onChangeCurr}>
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
                        <InputNumber placeholder="请输入" onChange={(val) => this.onChangeAmm(val)} style={{width: '100%'}} />
                      )
                    }
                  </Form.Item>
                </Col>
                {
                  showField.costNote && showField.costNote.status ?
                    <Col span={12}>
                      <Form.Item label={labelInfo.costNote} {...formItemLayout}>
                        {
                          getFieldDecorator('note', {
                            initialValue: details.note || '',
                            rules: [{ required: !!(showField.costNote.isWrite), message: '请输入备注' }]
                          })(
                            <Input placeholder="请输入" />
                          )
                        }
                      </Form.Item>
                    </Col>
                  :
                  null
                }
                {
                  showField.happenTime && showField.happenTime.status &&
                  <Col span={12}>
                    <Form.Item label={labelInfo.happenTime} {...formItemLayout}>
                      {
                        costDate === 1 &&
                        getFieldDecorator('time', {
                          initialValue: details.startTime ? moment(moment(Number(details.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD') : '',
                          rules: [{ required: !!(showField.happenTime.isWrite), message: '请选择时间' }]
                        })(
                          <DatePicker style={{width: '100%'}} />
                        )
                      }
                      {
                        costDate === 2 &&
                        getFieldDecorator('time', {
                          initialValue: details.startTime && details.endTime ?
                            [moment(moment(Number(details.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD'), moment(moment(Number(details.endTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD')]
                            :
                            [],
                          rules: [{ required: !!(showField.happenTime.isWrite), message: '请选择时间' }]
                        })(
                          <RangePicker
                            style={{width: '280px' }}
                            placeholder="请选择时间"
                            format="YYYY-MM-DD"
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
                  showField.imgUrl && showField.imgUrl.status &&
                  <Col span={12}>
                    <Form.Item label={labelInfo.imgUrl} {...formItemLayout}>
                      <UploadImg onChange={(val) => this.onChangeImg(val)} imgUrl={imgUrl} userInfo={userInfo} />
                    </Form.Item>
                  </Col>
                }
                {
                  expandField && (expandField.length > 0) &&
                  expandField.map(it => {
                    let renderForm = null;
                    let rule = [];
                    if (Number(it.fieldType) === 0) {
                      renderForm = (<Input placeholder='请输入' />);
                      rule = [{ max: 20, message: '限制20个字' }];
                    } else if (Number(it.fieldType) === 1) {
                      renderForm = (<TextArea placeholder='请输入' />);
                      rule = [{ max: 128, message: '限制128个字' }];
                    } else {
                      renderForm = (
                        <Select placeholder='请选择'>
                          {
                            it.options && it.options.map(iteems => (
                              <Select.Option key={iteems}>{iteems}</Select.Option>
                            ))
                          }
                        </Select>
                      );
                    }
                      return (
                        <>
                          {
                            it.status ?
                              <Col span={12}>
                                <Form.Item label={it.name} {...formItemLayout}>
                                  {
                                    getFieldDecorator(it.field, {
                                      initialValue: it.msg,
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
              />
            </Form>
          </div>
        </Modal>
      </span>
    );
  }
}

export default AddCost;
