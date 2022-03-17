/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Table} from 'antd';
import Search from 'antd/lib/input/Search';
import style from './index.scss';

@Form.create()
class TableTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      searchContent: '',
    };
  }

  onShow = async() => {
    const { onQuery, page } = this.props;
    console.log('在这里吗', page);
    onQuery({
      pageNo: page.pageNo,
      pageSize: page.pageSize,
    }, () => {
      this.setState({
        visible: true,
      });
    });
  }

  onCancel = () => {
    this.searchInput.input.state.value = '';
    this.setState({
      visible: false,
      searchContent: '',
    });
  }

  onSearch = (e) => {
    const { onQuery } = this.props;
    onQuery({
      pageNo: 1,
      pageSize: 10,
      searchContent: e || '',
    }, () => {
      this.setState({
        searchContent: e || '',
      });
    });
  }

  render() {
    const {
      children,
      list,
      page,
      columns,
      title,
      onQuery,
      placeholder,
      sWidth,
    } = this.props;
    console.log('TableTemplate -> render -> list', list);

    const {
      visible,
      searchContent
    } = this.state;

    return (
      <>
        <span
          onClick={() => this.onShow()}
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1
          }}
        >
          {children}
        </span>
        <Modal
          title={title}
          visible={visible}
          width="980px"
          bodyStyle={{height: '592px', overflowY: 'scroll'}}
          onCancel={this.onCancel}
          maskClosable={false}
          footer={null}
          className={style.editData}
          closeIcon={(
            <div className="modalIcon">
              <i className="iconfont icona-guanbi3x1" />
            </div>
          )}
        >
          <div className="m-b-16">
            {/* <Input style={{width:'292px',marginRight:'20px'}} placeholder="请输入单号、事由" /> */}
            <Search
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={placeholder}
              style={{ width: '320px',marginRight:'20px' }}
              onSearch={(e) => this.onSearch(e)}
              allowClear="true"
            />
          </div>
          <div className={style.addCosts}>
            <div className={style.addTable}>
              <Table
                columns={columns}
                dataSource={list}
                rowKey="id"
                scroll={{ x: sWidth || '1300px' }}
                pagination={{
                  hideOnSinglePage: true,
                  current: page.pageNo,
                  pageSize: page.pageSize,
                  onChange: (pageNumber) => {
                    onQuery({
                      pageNo: pageNumber,
                      pageSize: page.pageSize,
                      searchContent,
                    });
                  },
                  total: page.total,
                  size: 'small',
                  showTotal: () => (`共${page.total}条数据`),
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onShowSizeChange: (cur, size) => {
                    onQuery({
                      pageNo: cur,
                      pageSize: size,
                      searchContent,
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

export default TableTemplate;
