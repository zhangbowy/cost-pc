import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Button, Table, PageHeader } from 'antd';
import Sort from '@/components/TreeSort';
import AddComp from './component/AddComp';


class CompanySet extends Component {
  static propTypes = {

  }

  render() {
    const {
      loading,
      lists,
      list,
    } = this.props;
    const { newArrs } = this.state;
    return (
      <div className="mainContainer">
        <PageHeader title="支出类别设置" />
        <div className="content-dt ">
          <div className="cnt-header">
            <div className="head_lf">
              <AddComp onOk={this.onOk} title="add" list={list}>
                <Button style={{marginRight: '8px'}}>新增分组</Button>
              </AddComp>
            </div>
            <div>
              <Sort list={newArrs} callback={this.getSort}>
                <Button type="default">排序</Button>
              </Sort>
            </div>
          </div>
          <Table
            rowKey="id"
            loading={loading}
            columns={lists}
            dataSource={lists}
            pagination={false}
            defaultExpandAllRows
          />
        </div>
      </div>
    );
  }
}

export default CompanySet;
