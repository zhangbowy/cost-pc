/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Table } from 'antd';
import Search from 'antd/lib/input/Search';
import { connect } from 'dva';
import cs from 'classnames';
import { rowSelect } from '@/utils/common';
import style from './index.scss';

// const labelInfo = {
//   costName: '费用类别',
//   costSum: '金额(元)',
//   costNote: '费用备注',
//   imgUrl: '图片',
//   happenTime: '发生日期'
// };
@connect(({ workbench }) => ({
  waitList: workbench.waitList,
}))
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
      selectedRowKeys:[],
      selectedRows: [],
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
    this.props.dispatch({
      type: 'workbench/waitList',
      payload: {}
    }).then(() => {
      console.log(this.props.waitList);
    });
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

  onSelectAll = (selected, selectedRows, changeRows) => {
    const result = rowSelect.onSelectAll(this.state, selected, changeRows);
    const _selectedRows = result.selectedRows;
    const { selectedRowKeys } = result;
    this.setState({
      selectedRows: _selectedRows,
      selectedRowKeys,
    });
  };

  onSelect = (record, selected) => {
    console.log(record);
    const {
      selectedRows,
      selectedRowKeys,
    } = rowSelect.onSelect(this.state, record, selected);
    this.setState({
      selectedRows,
      selectedRowKeys,
    });
  };

  onDelete = (id) => {
      const {
        selectedRows,
        selectedRowKeys,
      } = rowSelect.onDelete(this.state, id);
      this.setState({
        selectedRows,
        selectedRowKeys,
      });
  };

  render() {
    const {
      children,
    } = this.props;
    const {
      visible,
      selectedRowKeys,
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
      type: 'checkbox',
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
    };

    const dataSource = [{
      shiyou:'111',
      jkdh:'36472384',
      dhx:'342324',
      tjsj:'2019-05-06',
      id: 123,
    },{
      shiyou:'2222',
      jkdh:'3647212384',
      dhx:'34223324',
      tjsj:'2019-05-07',
      id: 234
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
          <div className="m-b-16">
            {/* <Input style={{width:'292px',marginRight:'20px'}} placeholder="请输入单号、事由" /> */}
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
                rowKey="id"
              />
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}

export default AddBorrow;
