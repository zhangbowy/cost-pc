// 费用标准
import React, { PureComponent } from 'react';
import { Table, Divider } from 'antd';
import PageHead from '@/components/pageHead';
import DropBtnList from '../../../components/DropBtnList';
import fields from '../../../utils/fields';
import { objToArr } from '../../../utils/common';

const { chargeType } = fields;

const lists = objToArr(chargeType);

class chargeStandard extends PureComponent {

  onHandle = (key, id) => {
    if (!id) {
      this.props.history.push(`/basicSetting/costStandard/${key}`);
    } else {
      this.props.history.push(`/basicSetting/costStandard/${key}_${id}`);
    }
  }

  render() {
    const columns = [{
      title: '费用标准',
      dataIndex: 'name'
    }, {
      title: '标准类型',
      dataIndex: 'name1'
    }, {
      title: '适用支出类别（费用）',
      dataIndex: 'name2'
    }, {
      title: '标准内容',
      dataIndex: 'name3'
    }, {
      title: '修改时间',
      dataIndex: 'name4'
    }, {
      title: '状态',
      dataIndex: 'name5'
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: () => (
        <span>
          <a>删除</a>
          <Divider type="vertical" />
          <a>编辑</a>
        </span>
      )
    }];
    return (
      <div className="mainContainer">
        <PageHead title="费用标准" />
        <div className="content-dt">
          <DropBtnList
            btnProps={{
              type: 'primary'
            }}
            list={lists}
            handleClick={this.onHandle}
            params={{
              label: 'name',
              value: 'key'
            }}
            title="新增标准"
          />
          <Table
            pagination={false}
            columns={columns}
            className="m-t-16"
          />
        </div>
      </div>
    );
  };
}

export default chargeStandard;
