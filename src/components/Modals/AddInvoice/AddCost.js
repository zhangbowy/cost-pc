/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Divider, Button, Table, TreeSelect, InputNumber, Select, DatePicker, message } from 'antd';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import cs from 'classnames';
import moment from 'moment';
import { JsonParse } from '@/utils/common';
import SelectPeople from '../SelectPeople';
import style from './index.scss';
import UploadImg from '../../UploadImg';

const { Option } = Select;
const { RangePicker } = DatePicker;
const labelInfo = {
  costName: '费用类别',
  costSum: '金额',
  costNote: '费用备注',
  imgUrl: '图片',
  happenTime: '发生日期'
};
@Form.create()
@connect(({ global }) => ({
  expenseList: global.expenseList,
  deptInfo: global.deptInfo,
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
      const { index, detail } = this.props;
      console.log(index, detail);
      if (index === 0 || index) {
        this.setState({
          details: detail,
          costDetailShareVOS: detail.costDetailShareVOS,
          imgUrl: detail.imgUrl || [],
          costSum: detail.costSum,
          shareAmount: detail.shareTotal,
        });
        this.onChange(this.props.detail.categoryId);
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
    });
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
  selectPle = (val, index) => {
    const detail = this.state.costDetailShareVOS;
    if (val.users) {
      this.props.dispatch({
        type: 'global/users',
        payload: {
          userJson: JSON.stringify(val.users),
        }
      }).then(() => {
        const { deptInfo } = this.props;
        detail.splice(index, 1, {
          ...detail[index],
          users: val.users,
          depList: deptInfo,
          userName: val.users[0].userName,
          userId: val.users[0].userId,
        });
        this.setState({
          costDetailShareVOS: detail,
        });
      });
    }
    console.log(val);
  }

  //  提交
  handleOk = () => {
    const {
      invoiceId,
    } = this.props;
    const {
      costDate,
      costDetailShareVOS,
      details,
      imgUrl,
      shareAmount,
    } = this.state;
    this.props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        if (shareAmount !== val.costSum) {
          message.error('请检查分摊的金额');
          return;
        }
        let detail = {
          costDate,
          note: val.note || '',
          costSum: val.costSum,
          categoryId: val.categoryId,
          imgUrl,
          shareTotal: shareAmount,
        };
        if (costDate === 1) {
          detail = {
            categoryName: details.categoryName,
            icon: details.icon,
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
          arr.push({
            shareAmount: val.shareAmount[item.key],
            shareScale: val.shareScale[item.key],
            deptId: val.deptId[item.key],
            userId: item.userId,
            deptName: deptList ? deptList[0].name : '',
            userName: item.userName,
            userJson: JSON.stringify(item.users),
            users: item.users,
            invoiceBaseId: invoiceId,
            depList: item.depList,
          });
        });
        detail = {
          ...detail,
          costDetailShareVOS: arr,
        };
        this.props.onAddCost(detail);
        this.onCancel();
      }
    });
  }

  onDelete = (index) => {
    const detail = this.state.costDetailShareVOS;
    detail.splice(index, 1);
    this.setState({
      costDetailShareVOS: detail,
    });
  }

  onInputAmount = (val, key) => {
    const costSum = this.props.form.getFieldValue('costSum');
    const amm = this.props.form.getFieldValue('shareAmount');
    let amount = 0;
    if (Object.keys(amm)) {
      Object.keys(amm).forEach(it => {
        if (it !== key) {
          amount+=amm[it];
        }
      });
    }
    amount+=val;
    this.setState({
      shareAmount: amount,
    });
    console.log();
    if (costSum && val) {
      const scale = ((val / costSum).toFixed(4) * 10)*10;
      this.props.form.setFieldsValue({
        [`shareScale[${key}]`]: scale,
      });
    }
    console.log(val);
  }

  // 选择费用类别
  onChange = (val) => {
    const { expenseList } = this.props;
    let detail = this.state.details;
    const showFields = {};
    let costDate = 0;
    expenseList.forEach(item => {
      if (item.id === val) {
        detail = {
          ...detail,
          categoryName: item.costName,
          icon: item.icon,
        };
        if (item.showField) {
          const str = JsonParse(item.showField);
          str.forEach(it => {
            showFields[it.field] = {...it};
            if (it.field === 'happenTime' && it.dateType) {
              costDate = Number(it.dateType);
            }
          });
        }
      }
    });
    this.setState({
      showField: showFields,
      costDate,
      details: detail,
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
    });
  }

  render() {
    const {
      children,
      form: { getFieldDecorator },
      expenseList,
      userInfo,
    } = this.props;
    const list = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tId: 'value',
      tName: 'title',
      otherKeys: ['type','showField']
    }, expenseList);
    const {
      visible,
      costDetailShareVOS,
      imgUrl,
      showField,
      costDate,
      details,
      costSum,
      shareAmount,
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
    const columns = [{
      title: '承担人员',
      dataIndex: 'userId',
      render: (_, record, index) => (
        <div>
          <SelectPeople
            users={record.users}
            placeholder='请选择'
            onSelectPeople={(val) => this.selectPle(val, index)}
            invalid={[]}
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
                initialValue: record.deptId
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
      title: '承担金额',
      dataIndex: 'shareAmount',
      render: (_, record) => (
        <Form>
          <Form.Item>
            {
              getFieldDecorator(`shareAmount[${record.key}]`, {
                initialValue: record.shareAmount
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
      title: '承担比例',
      dataIndex: 'shareScale',
      render: (_, record) => (
        <Form>
          <Form.Item>
            {
              getFieldDecorator(`shareScale[${record.key}]`, {
                initialValue: record.shareScale
              })(
                <InputNumber placeholder="请输入" onInput={this.onInputScale} />
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
    return (
      <span className={cs('formItem', style.addCost)}>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="添加费用"
          visible={visible}
          width="880px"
          bodyStyle={{height: '550px', overflowY: 'scroll'}}
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
                          treeData={list}
                          placeholder="请选择"
                          onChange={this.onChange}
                        />
                      )
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={labelInfo.costSum} {...formItemLayout}>
                    {
                      getFieldDecorator('costSum', {
                        initialValue: details.costSum || '',
                        rules: [{ required: true, message: '请输入金额' }]
                      })(
                        <InputNumber placeholder="请输入" onChange={(val) => this.onChangeAmm(val)} style={{width: '100%'}} />
                      )
                    }
                  </Form.Item>
                </Col>
              </Row>
              {/* <Row> */}
              {
                showField.costNote && showField.costNote.status &&
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
                        <DatePicker />
                      )
                    }
                    {
                      costDate === 2 &&
                      getFieldDecorator('time', {
                        rules: [{ required: !!(showField.happenTime.isWrite), message: '请选择时间' }]
                      })(
                        <RangePicker
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
              {/* </Row> */}
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
                  <p style={{marginBottom: 0}} className="m-b-8 li-24 c-black-85 fw-500"> ¥{costSum}  已分摊：¥{shareAmount}</p>
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
