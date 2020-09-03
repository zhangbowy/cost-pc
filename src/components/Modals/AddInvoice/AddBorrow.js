/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Input, Table } from 'antd';
import Search from 'antd/lib/input/Search';
import { connect } from 'dva';
import cs from 'classnames';
import style from './index.scss';

// const labelInfo = {
//   costName: '费用类别',
//   costSum: '金额(元)',
//   costNote: '费用备注',
//   imgUrl: '图片',
//   happenTime: '发生日期'
// };
@Form.create()
@connect(({ global }) => ({
  expenseList: global.expenseList,
  deptInfo: global.deptInfo,
  userId: global.userId,
  usableProject: global.usableProject,
  lbDetail: global.lbDetail,
}))
class AddBorrow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      details: props.detail || [], // 详细信息
      money:0,
      selectedRowKeys:[]
    };
  }

  componentDidUpdate(prevProps){
    if (prevProps.detail !== this.props.detail) {
      if(this.props.detail){
      // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          details: this.props.detail,
        });
      }
    }
  }

  onShow = async() => {
    this.setState({
      visible: true,
    });
  }

  onCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  }

  //  提交
  handleOk = () => {
    const { details, selectedRowKeys } = this.state;
    this.props.onAddBorrow(details,selectedRowKeys);
    this.onCancel();
  }

  onInputAmount = (val, key) => {
    const costSum = this.props.form.getFieldValue('costSum');
    // const amm = this.props.form.getFieldValue('shareAmount');
    // let amount = 0;
    // if (Object.keys(amm)) {
    //   Object.keys(amm).forEach(it => {
    //     if (it !== key) {
    //       amount+=amm[it];
    //     }
    //   });
    // }
    // amount+=val;
    if (costSum && (val || val === 0)) {
      const scale = ((val / costSum).toFixed(4) * 100).toFixed(2);
      this.props.form.setFieldsValue({
        [`shareScale[${key}]`]: scale,
      });
    }
  }

  // 选择费用类别

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

  render() {
    const {
      children,
    } = this.props;
    const {
      visible,
    } = this.state;
    const columns = [
      {
        title: '事由',
        dataIndex: 'shiyou',
      },
      {
        title: '借款单号',
        dataIndex: 'jkdh',
      },
      {
        title: '待核销',
        dataIndex: 'dhx',
      },{
        title: '提交时间',
        dataIndex: 'tjsj',
      },
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        let money = 0;
        const details = [];
        selectedRows.map(item => {
          money += Number(item.dhx);
          details.push(item);
          return item;
        });
        this.setState({money,details,selectedRowKeys});
      },
      selectedRowKeys:this.state.selectedRowKeys,
      getCheckboxProps: record => (
        console.log('getCheckboxProps',record)
      ),
    };

    const dataSource = [{
      shiyou:'111',
      jkdh:'36472384',
      dhx:'342324',
      tjsj:'2019-05-06'
    },{
      shiyou:'2222',
      jkdh:'3647212384',
      dhx:'34223324',
      tjsj:'2019-05-07'
    }];

    return (
      <span className={cs('formItem', style.addCost)}>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="选择借款核销"
          visible={visible}
          width="880px"
          bodyStyle={{height: '550px', overflowY: 'scroll'}}
          onCancel={this.onCancel}
          maskClosable={false}
          onOk={() => this.handleOk()}
        >
          <div>
            <Input style={{width:'292px',marginRight:'20px'}} placeholder="请输入单号、事由" />
            <Search
              placeholder="请输入单号、事由"
              style={{ width: '292px',marginRight:'20px' }}
              onSearch={(e) => this.onSearch(e)}
            />
            待核销金额总计：¥{this.state.money}
          </div>
          <div className={style.addCosts}>
            <div className={style.addTable}>
              <Table
                columns={columns}
                rowSelection={rowSelection}
                dataSource={dataSource}
                pagination={false}
                rowKey="key"
              />
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}

export default AddBorrow;
