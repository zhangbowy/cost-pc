/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Table, Button } from 'antd';
import Search from 'antd/lib/input/Search';
import cs from 'classnames';
import style from './index.scss';
import listJson from './list';

@Form.create()
class TempTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  onShow = async() => {
    this.props.dispatch({
      type: 'costGlobal/loanList',
      payload: {
        pageNo: 1,
        pageSize: 1000,
      }
    }).then(() => {
      console.log(this.props.waitList);
      const { list } = this.props;
      console.log('list', list);
      this.setState({
        visible: true,
      });
    });

  }

  onCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  }

  onSearch = (e) => {
    console.log(e);
  }

  render() {
    const {
      children,
      loanList,
      waitLoanSumAll
    } = this.props;
    const {
      visible,
    } = this.state;
    const columns = listJson;

    return (
      <span className={cs('formItem', style.addCost)}>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="待还款单据"
          visible={visible}
          width="880px"
          bodyStyle={{height: '470px', overflowY: 'scroll'}}
          onCancel={this.onCancel}
          maskClosable={false}
          footer={(
            <>
              <Button type="default" key="cen" onClick={this.onCancel}>取消</Button>
            </>
          )}
        >
          <div className="m-b-16">
            {/* <Input style={{width:'292px',marginRight:'20px'}} placeholder="请输入单号、事由" /> */}
            <Search
              placeholder="请输入单号、事由、收款账户"
              style={{ width: '292px',marginRight:'20px' }}
              onSearch={(e) => this.onSearch(e)}
            />
            待核销共计¥{waitLoanSumAll.waitAssessSumAll ? waitLoanSumAll.waitAssessSumAll/100 : 0}，
            借款共计¥{waitLoanSumAll.loanSumAll ? waitLoanSumAll.loanSumAll/100 : 0}
          </div>
          <div className={style.addCosts}>
            <div className={style.addTable}>
              <Table
                columns={columns}
                dataSource={loanList}
                pagination={false}
                rowKey="id"
                scroll={{ x: '1100px' }}
              />
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}

export default TempTable;
