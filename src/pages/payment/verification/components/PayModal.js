import React from 'react';
import {
  Modal,
  Form,
  Select,
  DatePicker,
  Button,
  message,
  Tooltip,
  Table,
  InputNumber
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import cs from 'classnames';
import UploadImg from '../../../../components/UploadImg';
import styles from './index.scss';
import { rowSelect } from '../../../../utils/common';

const { Option } = Select;
@Form.create()
@connect(({ global, session, loading, costGlobal }) => ({
  payAccount: global.payAccount,
  userInfo: session.userInfo,
  getAliAccounts: global.getAliAccounts,
  batchDetails: global.batchDetails,
  alipayUrl: global.alipayUrl,
  paymentMethod: costGlobal.paymentMethod,
  loading:
    loading.effects['global/addBatch'] ||
    loading.effects['global/send'] ||
    false
}))
class PayModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      defAcc: '',
      count: 1,
      amount: 0,
      flag: false,
      status: '1',
      prod: '已选单据有非支付宝收款账户，不支持线上支付',
      imgUrl: [],
      selectedRowKeys: [],
      selectedRows: []
    };
  }

  onShow = () => {
    const { userInfo, selectKey } = this.props;
    this.setState({
      selectedRowKeys:selectKey.map(({id}) => id),
      selectedRows:selectKey
    }, () => {
    });
    const fileds = {};
    selectKey.forEach(it => {
      fileds[`${it.invoiceId}_amount`] =  (it.receiptSum - it.assessSum) / 100;
    });
    setTimeout(() => {
      this.props.form.setFieldsValue({
        ...fileds
      });
    }, 300);
    this.props
      .dispatch({
        type: 'costGlobal/paymentMethod',
        payload: {}
      })
      .then(() => {
        this.props
          .dispatch({
            type: 'global/payAccount',
            payload: {
              companyId: userInfo.companyId,
              pageNo: 1,
              pageSize: 100
            }
          })
          .then(() => {
            const { payAccount, paymentMethod } = this.props;
            const accountList = payAccount.filter(
              it => Number(it.status) === 1
            );
            const defaultAccount = accountList.filter(it => it.isDefault);
            let acc = '';
            let cout = 1;
            let flags = false;
            let amount = 0;
            let prod = '已选单据有非支付宝收款账户，不支持线上支付';
            if (defaultAccount && defaultAccount.length > 0) {
              acc = defaultAccount[0].id;
            }
            if (selectKey) {
              if (selectKey.length === 0) {
                message.error('请至少选择一个发起收款');
                return;
              }
              cout = selectKey.length;
              selectKey.forEach(item => {
                if (item.receiptSum) amount += (item.receiptSum - item.assessSum) / 100;
                if (item.accountType !== 1) {
                  flags = true;
                }
              });
              // eslint-disable-next-line eqeqeq
              if (Number(amount) < 100) {
                flags = true;
                prod = '已选单据付款金额小于1元，请线下支付并标记';
              }
            }
            console.log(flags, paymentMethod);
            this.setState(
              {
                visible: true,
                defAcc: acc,
                count: cout,
                amount,
                flag: flags,
                prod,
                status: !flags && paymentMethod ? '2' : '1'
              },
              () => {
                this.props.form.setFieldsValue({
                  account: acc,
                });
              }
            );
          });
      });
  };

  onCancel = () => {
    this.props.form.resetFields();
    this.props.form.setFieldsValue({
      account: ''
    });
    this.setState({
      visible: false,
      status: '1',
      prod: '已选单据有非支付宝收款账户，不支持线上支付'
    });
  };

  onSubmit = () => {
    const {
      dispatch,
      form,
      payAccount,
      onOk,
    } = this.props;
    const {imgUrl,selectedRows} = this.state;
    if (selectedRows.length === 0) {
      return message.warn('请至少选择一个发起核销');
    }
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const accountInfo = payAccount.find(it => it.id === values.account);
        const invoiceIdAndReceiveSumList = selectedRows.map(it => {
          const key = `${it.invoiceId}_amount`;
          return {
            receiveSum: values[key] * 100 || 0,
            invoiceId: it.invoiceId
          };
        });
        const param = {
          accountId: accountInfo.id,
          accountJson: JSON.stringify(accountInfo),
          accountName: accountInfo.name,
          receiveTime: moment(values.time).format('x'),
          accountType: accountInfo.type,
          invoiceIdAndReceiveSumList,
          voucherList: imgUrl.map(({imgUrl: url}) => url),
          templateType: 20
        };
        const url = 'verification/send';
        dispatch({
          type: url,
          payload: {
            ...param
          }
        }).then(() => {
            message.success('核销成功');
          this.onCancel();
          onOk(true);
          this.setState({
            visible: false
          });
        });
      }
    });
  };

  onChange = e => {
    const { payAccount, getAliAccounts } = this.props;
    this.props.form.setFieldsValue({
      account: ''
    });
    if (e.target.value === '1') {
      const accountList = payAccount.filter(it => Number(it.status) === 1);
      const defaultAccount = accountList.filter(it => it.isDefault);
      if (defaultAccount && defaultAccount.length) {
        this.props.form.setFieldsValue({
          account: defaultAccount[0].id
        });
      }
    } else {
      const defa = getAliAccounts.filter(it => it.isDefault);
      if (defa && defa.length) {
        this.props.form.setFieldsValue({
          account: defa[0].payId
        });
      }
    }
    this.setState({
      status: e.target.value
    });
  };

  check = (rule, value, callback) => {
    if (value) {
      callback();
    } else {
      callback('请输入核销金额');
    }
  };

  onChangeImg = val => {
    this.setState({
      imgUrl: val
    });
  };

  onSelectAll = (selected, selectedRows, changeRows) => {
    const result = rowSelect.onSelectAll(
      this.state,
      selected,
      changeRows,
    );
    const _selectedRows = result.selectedRows;
    const { selectedRowKeys } = result;
    this.setState({
      selectedRowKeys,
      selectedRows: _selectedRows
    });
    this.onInputAmount();
  };

  onSelect = (record, selected) => {
    const { selectedRows, selectedRowKeys } = rowSelect.onSelect(
      this.state,
      record,
      selected,
    );
    this.setState({
      selectedRowKeys,
      selectedRows
    });

    this.onInputAmount();
  };

  onInputAmount = () => {
    setTimeout(() => {
      const { selectedRows = []} = this.state;
      const values = this.props.form.getFieldsValue();
      let amount = 0;
      selectedRows.forEach(it => {
        const key = `${it.invoiceId}_amount`;
        amount += values[key] || 0;
      });
      this.setState({
        amount,
        count: selectedRows.length
      });
    }, 300);
  }

  render() {
    const {
      children,
      payAccount,
      form: { getFieldDecorator },
      loading,
      userInfo,
      selectKey
    } = this.props;
    const {
      visible,
      defAcc,
      count,
      amount,
      status,
      imgUrl,
      selectedRowKeys
    } = this.state;
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
      columnWidth: '24px'
    };

    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 60,
        render: (_, record, index) => <span style={{ display: 'flex' }} >{index+1}</span>
      },
      {
        title: '单号',
        dataIndex: 'invoiceNo',
        width: 130,
        render: (_, record) => (
          <span style={{ display: 'flex' }}>
            <Tooltip placement="topLeft" title={record.invoiceNo || ''}>
              <span className="eslips-1 m-r-8">{record.invoiceNo}</span>
            </Tooltip>
          </span>
        )
      },
      {
        title: '业务员',
        dataIndex: 'userName',
        render: (_, record) => (
          <span style={{ display: 'flex' }}>
            <Tooltip placement="top" title={record.userName || ''}>
              <span className="eslips-1 m-r-8">{record.userName}</span>
            </Tooltip>
          </span>
        ),
        width: 100
      },
      {
        title: '部门',
        dataIndex: 'deptName',
        render: (_, record) => (
          <span style={{ display: 'flex' }}>
            <Tooltip placement="top" title={record.deptName || ''}>
              <span className="eslips-1 m-r-8">{record.deptName}</span>
            </Tooltip>
          </span>
        ),
        width: 100
      },
      {
        title: '应收金额(元)',
        dataIndex: 'receiptSum',
        render: text => <span>{text / 100 || 0}</span>,
        width: 120
      },
      {
        title: '已收金额(元)',
        dataIndex: 'assessSum',
        render: text => <span>{text / 100 || 0}</span>,
        width: 120
      },
      {
        title: '本次核销(元)',
        dataIndex: '',
        render: (_, record) => {
          return (
            <Form>
              <Form.Item className={styles.verifyMoney}>
                {getFieldDecorator(`${record.invoiceId}_amount`, {
                  initialValue: 0,
                  rules: [{ validator: this.check }]
                })(
                  <InputNumber
                    className={styles.verifyMoneyInput}
                    placeholder="请输入核销金额"
                    min={0.00}
                    step={0.01}
                    onChange={() => this.onInputAmount()}
                  />
                )}
              </Form.Item>
            </Form>
          );
        },
        width: 120
      }
    ];

    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title=""
          maskClosable={false}
          visible={visible}
          onCancel={() => this.onCancel()}
          footer={
            <div style={{ marginLeft: '12.5%' }}>
              <span
                className={cs(styles.chooseRowCount, 'fs-14 m-b-47 m-l-16')}
              >
                已选<span className="c-black-85 m-r-3 m-l-4">{count}</span>
                张单据，核销总计{' '}
                <span className={cs(styles.totalAmount, 'm-r-7')}>
                  ¥{amount}
                </span>
              </span>
              <Button
                key="cancel"
                onClick={() => this.onCancel()}
                className="m-l-8"
              >
                取消
              </Button>
              <Button
                key="save"
                onClick={() => this.onSubmit()}
                loading={loading}
                disabled={loading}
                type="primary"
              >
                确认核销
              </Button>
            </div>
          }
          width="936px"
          bodyStyle={{
            height: '612px'
          }}
          className={styles.verifyPopWrap}
        >
          {/* <h1 className="fs-24 c-black-85 m-b-16 m-l-16">发起收款</h1> */}
          <p className="fs-20 fw-500 m-b-16 c-black-85">发起收款</p>
          <Form className="formItem"  >
            {status === '1' && (
              <Form.Item
                label="收款账户"
                style={{ width: 306, display: 'inline-block', marginRight: 84 }}
              >
                {getFieldDecorator('account', {
                  initialValue: defAcc || '',
                  rules: [{ required: true, message: '请选择收款账户' }]
                })(
                  <Select
                    placeholder="请选择"
                    showSearch
                    optionFilterProp="label"
                  >
                    {payAccount.map(item => (
                      <Option key={item.id} label={item.name}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            )}
            {status === '1' && (
              <Form.Item
                label="收款时间"
                style={{ width: 306, display: 'inline-block' }}
              >
                {getFieldDecorator('time', {
                  initialValue: moment(new Date(), 'YYYY-MM-DD'),
                  rules: [{ required: true, message: '请选择收款时间' }]
                })(<DatePicker />)}
              </Form.Item>
            )}
            {status === '1' && (
              <Form.Item label="收款凭证">
                <UploadImg
                  onChange={val => this.onChangeImg(val)}
                  imgUrl={imgUrl}
                  userInfo={userInfo}
                />
              </Form.Item>
            )}
          </Form>
          <Table
            columns={columns}
            dataSource={selectKey}
            pagination={false}
            rowSelection={rowSelection}
            rowKey="id"
          />
        </Modal>
      </span>
    );
  }
}

export default PayModal;
