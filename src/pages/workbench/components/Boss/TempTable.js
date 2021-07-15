/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Table, Button } from 'antd';
import Search from 'antd/lib/input/Search';
import style from './submitReport.scss';
import listJson from './list';

@Form.create()
class TempTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      searchContent: '',
    };
  }

  onShow = async() => {
    const { reportType } = this.props;
    this.props.reportChange({
      pageNo: 1,
      pageSize: 10,
      reportType,
    }, () => {
      this.setState({
        visible: true,
      });
    });
  }

  onCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
      searchContent: '',
    });
  }

  onSearch = (e) => {
    const { reportType } = this.props;
    this.props.reportChange({
      pageNo: 1,
      pageSize: 10,
      reportType,
      searchContent: e,
    }, () => {
      this.setState({
        searchContent: e,
      });
    });
  }

  render() {
    const {
      children,
      loanList,
      reportType,
      total,
      reportChange,
      page,
      loanSumVo,
    } = this.props;

    const {
      visible,
      searchContent
    } = this.state;
    const details = listJson[reportType];
    const {columns, title} = details;

    return (
      <>
        <span
          onClick={() => this.onShow()}
        >
          {children}
        </span>
        <Modal
          title={title}
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
            {
              Number(reportType) === 3 &&
              <span>
                待核销共计¥{loanSumVo.waitAssessSumAll ?
                loanSumVo.waitAssessSumAll/100 : 0}，借款共计¥{loanSumVo.loanSumAll ?
                loanSumVo.loanSumAll/100 : 0}
              </span>
            }
          </div>
          <div className={style.addCosts}>
            <div className={style.addTable}>
              <Table
                columns={columns}
                dataSource={loanList}
                rowKey="id"
                scroll={{ x: '1300px' }}
                pagination={{
                  hideOnSinglePage: true,
                  current: page.pageNo,
                  onChange: (pageNumber) => {
                    reportChange({
                      pageNo: pageNumber,
                      pageSize: page.pageSize,
                      searchContent,
                      reportType
                    });
                  },
                  total,
                  size: 'small',
                  showTotal: () => (`共${total}条数据`),
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onShowSizeChange: (cur, size) => {
                    reportChange({
                      pageNo: cur,
                      pageSize: size,
                      searchContent,
                      reportType
                    });
                  }
                }}
              />
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default TempTable;
