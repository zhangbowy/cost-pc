/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Divider, Button, Table, InputNumber, Select, DatePicker, message, TreeSelect, Tree } from 'antd';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import cs from 'classnames';
import moment from 'moment';
import { JsonParse } from '@/utils/common';
import TextArea from 'antd/lib/input/TextArea';
import SelectPeople from '../SelectPeople';
import style from './index.scss';
import UploadImg from '../../UploadImg';
import { numAdd, numMulti } from '../../../utils/float';
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
@connect(({ global }) => ({
  expenseList: global.expenseList,
  deptInfo: global.deptInfo,
  userId: global.userId,
  usableProject: global.usableProject,
  lbDetail: global.lbDetail,
  currencyList: global.currencyList,
  currencyShow: global.currencyShow,
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
          currencyId: this.props.detail.currencyId,
          currencyName: this.props.detail.currencyName,
          exchangeRate: this.props.detail.exchangeRate,
          currencySymbol: this.props.detail.currencySymbol,
        });
      }
    }
  }

  onShow = async() => {
    const _this = this;
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
    const { expenseList } = this.props;
    const list = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tId: 'value',
      tName: 'title',
      otherKeys: ['type','showField', 'icon']
    }, expenseList);
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

  onAdd = () => {
    const { costDetailShareVOS, initDep } = this.state;
    const details = costDetailShareVOS;
    details.push({
      key: `a${costDetailShareVOS.length}`,
      shareAmount: 0,
      shareScale: 0,
      deptName: '',
      deptId: '',
      depList: initDep,
      invoiceBaseId: details.invoiceBaseId,
      users: [],
    });
    this.setState({
      costDetailShareVOS: details,
    });
  }

  //  选择承担人
  selectPle = (val, index, key) => {
    const detail = this.state.costDetailShareVOS;
    if (val.users) {
      this.props.dispatch({
        type: 'global/users',
        payload: {
          userJson: JSON.stringify(val.users),
        }
      }).then(() => {
        const { deptInfo, userId } = this.props;
        detail.splice(index, 1, {
          ...detail[index],
          users: val.users,
          depList: deptInfo,
          userName: val.users[0].userName,
          userId,
          loanUserId: val.users[0].userId,
          deptId: ''
        });
        if (deptInfo && deptInfo.length === 1) {
          this.props.form.setFieldsValue({
            [`deptId[${key}]`]: `${deptInfo[0].deptId}`,
          });
        } else {
          this.props.form.setFieldsValue({
            [`deptId[${key}]`]: '',
          });
        }

        this.setState({
          costDetailShareVOS: detail,
        });
      });
    }
  }

  //  提交
  handleOk = () => {
    const {
      invoiceId,
      index,
      usableProject,
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
    this.props.form.validateFieldsAndScroll((err, val) => {
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
        const arr = [];
        costDetailShareVOS.forEach(item => {
          // eslint-disable-next-line eqeqeq
          const deptList = item.depList.filter(it => it.deptId == val.deptId[item.key]);
          const projectName = val.projectId && val.projectId[item.key] ?
              usableProject.filter(it => it.id === val.projectId[item.key])[0].name : '';
          arr.push({
            key: item.key,
            shareAmount: val.shareAmount[item.key],
            shareScale: val.shareScale[item.key],
            deptId: val.deptId[item.key],
            projectId: val.projectId && val.projectId[item.key] ? val.projectId[item.key] : '',
            projectName,
            userId: item.userId,
            deptName: deptList ? deptList[0].name : '',
            userName: item.userName,
            userJson: item.users,
            users: item.users,
            invoiceBaseId: invoiceId,
            depList: item.depList,
            loanUserId: item.loanUserId,
          });
        });
        detail = {
          ...detail,
          expandCostDetailFieldVos,
          costDetailShareVOS: arr,
          currencyId,
          currencyName,
          exchangeRate,
          currencySymbol
        };
        this.props.onAddCost(detail, index);
        this.onCancel();
      }
    });
  }

  onDelete = (index) => {
    const detail = this.state.costDetailShareVOS;
    detail.splice(index, 1);
    this.setState({
      costDetailShareVOS: detail,
    }, () => {
      const { costDetailShareVOS } = this.state;
      let shareMount = 0;
      if (costDetailShareVOS && costDetailShareVOS.length) {
        costDetailShareVOS.forEach(it => {
          shareMount = numAdd(it.shareAmount, shareMount);
        });
      }
      this.setState({
        shareAmount: shareMount.toFixed(2),
      });
    });
  }

  onInputAmount = (val, key) => {
    const costSum = this.props.form.getFieldValue('costSum');
    const amm = this.props.form.getFieldValue('shareAmount');
    let amount = 0;
    if (Object.keys(amm)) {
      Object.keys(amm).forEach(it => {
        if (it !== key) {
          amount=numAdd(amm[it], amount);
        }
      });
    }
    amount = numAdd(val, amount);
    this.setState({
      shareAmount: amount.toFixed(2),
    });
    if (costSum && (val || val === 0)) {
      const scale = ((val / costSum) * 100).toFixed(2);
      this.props.form.setFieldsValue({
        [`shareScale[${key}]`]: scale,
      });
    }
  }

  toFixed = (num, s) => {
    // eslint-disable-next-line no-restricted-properties
    const times = Math.pow(10, s);
    let des = num * times + 0.5;
    des = parseInt(des, 10) / times;
    return `${des  }`;
  }

  onInputScale = (val, key) => {
    const costSum = this.props.form.getFieldValue('costSum');
    if(!/((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/.test(val)) {
      return;
    }
    if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(val)) {
      return;
    }
    if (val > 100000000 || val === 100000000) {
      return;
    }
    if (val < 0) {
      return;
    }
    if (costSum && (val || val === 0)) {
      // const amounts = ((val * costSum * 10000).toFixed(0) / 100);
      const amounts = (numMulti(val, costSum)/100).toFixed(2);
      this.props.form.setFieldsValue({
        [`shareAmount[${key}]`]: amounts,
      });
      const amm = this.props.form.getFieldValue('shareAmount');
      let amount = 0;
      if (Object.keys(amm)) {
        Object.keys(amm).forEach(it => {
          if (it !== key) {
            amount= numAdd(amm[it], amount);
          }
        });
      }
      amount=numAdd(amounts, amount);
      this.setState({
        shareAmount: amount.toFixed(2),
      });
    }
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
    console.log(val, types);
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
        const amm = this.props.form.getFieldValue('shareAmount');
        details.forEach(it => {
          if (amm[it.key]) {
            this.props.form.setFieldsValue({
              [`shareScale[${it.key}]`]: ((amm[it.key]/val) * 100).toFixed(2),
            });
          }
        });
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

  check = (rule, value, callback) => {
    if (value) {
      if(!/((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/.test(value)) {
        callback('请输入正确的金额');
      }
      callback();
    } else {
      callback();
    }
  }

  checkSale = (rule, value, callback) => {
    if (value) {
      if(!/((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/.test(value)) {
        callback('请输入正确的比例');
      }
      if(value > 100) {
        callback('承担比例不超过100');
      }
      callback();
    } else {
      callback();
    }
  }

  onChangeCurr = (option) => {
    console.log(option);
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

  render() {
    const {
      children,
      form: { getFieldDecorator },
      // expenseList,
      userInfo,
      usableProject,
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
    console.log('费用类别自定义', expandField);
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
    const columns = [{
      title: '承担人员',
      dataIndex: 'userId',
      render: (_, record, index) => (
        <div>
          <SelectPeople
            users={record.users}
            placeholder='请选择'
            onSelectPeople={(val) => this.selectPle(val, index, record.key)}
            invalid={false}
            disabled={false}
            flag="users"
            multiple={false}
          />
        </div>
      )
    }, {
      title: '承担部门',
      dataIndex: 'deptId',
      render: (_, record) => (
        <Form>
          <Form.Item>
            {
              getFieldDecorator(`deptId[${record.key}]`, {
                initialValue: record.deptId,
                rules:[{ required: true, message: '请选择承担部门' }]
              })(
                <Select>
                  {
                    record.depList && record.depList.map(it => (
                      <Option key={it.deptId}>{it.name}</Option>
                    ))
                  }
                </Select>
              )
            }
          </Form.Item>
        </Form>
      ),
      width: '230px'
    }, {
      title: '承担金额(元)',
      dataIndex: 'shareAmount',
      render: (_, record) => (
        <Form>
          <Form.Item>
            {
              getFieldDecorator(`shareAmount[${record.key}]`, {
                initialValue: record.shareAmount,
                rules:[{ validator: this.check }]
              })(
                <InputNumber
                  placeholder="请输入"
                  onChange={(val) => this.onInputAmount(val, record.key)}
                />
              )
            }
          </Form.Item>
        </Form>
      )
    }, {
      title: '承担比例(%)',
      dataIndex: 'shareScale',
      render: (_, record) => (
        <Form>
          <Form.Item>
            {
              getFieldDecorator(`shareScale[${record.key}]`, {
                initialValue: record.shareScale,
                rules: [{ validator: this.checkSale }]
              })(
                <InputNumber
                  placeholder="请输入"
                  onChange={(val) => this.onInputScale(val, record.key)}
                />
              )
            }
          </Form.Item>
        </Form>
      )
    }, {
      title: '操作',
      dataIndex: 'ope',
      render: (_, record, index) => (
        <span className="deleteColor" onClick={() => this.onDelete(index)} id={record.id}>删除</span>
      ),
      width: '70px'
    }];
    if (project.status) {
      columns.splice(2, 0, {
        title: '项目',
        dataIndex: 'projectId',
        render: (_, record) => (
          <Form>
            <Form.Item>
              {
                getFieldDecorator(`projectId[${record.key}]`, {
                  initialValue: record.projectId,
                  rules: [{ required: !!(project.isWrite), message: '请选择项目' }]
                })(
                  <Select>
                    {
                      usableProject.map(it => (
                        <Option key={it.id}>{it.name}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
          </Form>
        ),
        width: '180px'
      });
    } else if (columns.length > 5) {
      columns.splice(2,1);
    }

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
                              <Option key="-1">RMB 人民币</Option>
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
              <div style={{paddingTop: '24px'}}>
                <div className={style.header}>
                  <div className={style.line} />
                  <span>分摊</span>
                </div>
                <div style={{textAlign: 'center'}} className={style.addbtn}>
                  <Button icon="plus" style={{ width: '231px' }} onClick={() => this.onAdd()}>添加分摊</Button>
                </div>
                {
                  costDetailShareVOS && costDetailShareVOS.length > 0 &&
                  <p style={{marginBottom: 0}} className="m-b-8 li-24 c-black-85 fw-500"> ¥{ currencyShow && currencyId !== '-1' ? `${Number(numMulti(costSum, exchangeRate)).toFixed(2)}(${currencySymbol}${costSum})` : costSum}  已分摊：¥{ currencyShow && currencyId !== '-1' ? `${Number(numMulti(shareAmount, exchangeRate)).toFixed(2)}(${currencySymbol}${shareAmount})` : shareAmount}</p>
                }
                {
                  costDetailShareVOS && costDetailShareVOS.length > 0 &&
                  <div className={style.addTable}>
                    <Table
                      columns={columns}
                      dataSource={costDetailShareVOS}
                      pagination={false}
                      rowKey="key"
                    />
                  </div>
                }
              </div>
            </Form>
          </div>
        </Modal>
      </span>
    );
  }
}

export default AddCost;
