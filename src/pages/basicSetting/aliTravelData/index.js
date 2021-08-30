import React, { PureComponent } from 'react';
import { Steps, Button, Table, Icon, Popconfirm, Tree } from 'antd';
import cs from 'classnames';
import { connect } from 'dva';
import Search from 'antd/lib/input/Search';
import PageHead from '@/components/pageHead';
import treeConvert from '@/utils/treeConvert';
import style from './index.scss';

const aliTravel = {
  0: '飞机',
  1: '火车',
  2: '酒店',
  3: '打的',
};
const { Step } = Steps;
const { TreeNode } = Tree;
@connect(({ aliTravelData, global }) => ({
  authorize: aliTravelData.authorize,
  list: aliTravelData.list,
  costCategoryList: global.costCategoryList,
}))
class AllTravelData extends PureComponent {
  state = {
    current: 1,
    costCategoryId: '',
    type: ''
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'global/costList',
      payload: {},
    });
    this.props.dispatch({
      type: 'aliTravelData/authorize',
      payload: {},
    }).then(() => {
      console.log(this.props.authorize);
    });
  }

  confirm = () => {
    const { type, costCategoryId } = this.state;
    this.props.dispatch({
      type: 'aliTravelData/editRef',
      payload: {
        type,
        costCategoryId
      }
    }).then(() => {
      this.props.dispatch({
        type: 'aliTravelData/authorize',
        payload: {},
      });
    });
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
        <div className="icons" style={{ width: '100%' }}>
          {
            item.type ?
              <i className={cs(`icon${item.icon}`, 'iconfont', 'fs-24')} style={{verticalAlign: 'middle'}} />
              :
              null
          }
          <span className="m-l-8" style={{verticalAlign: 'middle'}}>{item.title}</span>
        </div>
      )}
    />;
  });

  onSelect = (selectedKeys, info, type) => {
    console.log('selected', selectedKeys, info);
    this.setState({
      costCategoryId: selectedKeys,
      type,
    });
  };

  render () {
    const { current } = this.state;
    const { list, costCategoryList, authorize } = this.props;
    const tree = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tId: 'value',
      tName: 'title',
      otherKeys: ['type','showField', 'icon']
    }, costCategoryList);
    const columns = [{
      title: '支出类别',
      dataIndex: 'costCategoryName',
      render: (_, record) =>  {
        return (
          <span>
            <span className="m-r-8">{record.costCategoryName}</span>
            <Popconfirm
              overlayClassName={style.popStyle}
              icon={false}
              title={(
                <div style={{height: '300px', width: '100%'}}>
                  <Search style={{ marginBottom: 8 }} placeholder="请输入" onChange={this.onChange} />
                  <Tree
                    dropdownStyle={{height: '300px'}}
                    style={{width: '100%'}}
                    onSelect={(selectedKeys, info) =>this.onSelect(selectedKeys, info, record.type)}
                  >
                    {this.loop(tree)}
                  </Tree>
                </div>
              )}
              onConfirm={this.confirm}
              okText="确定"
              cancelText="取消"
            >
              <Icon type="edit" style={{ color: 'rgba(0, 199, 149, 1)' }} />
            </Popconfirm>
          </span>
        );
      },
    }, {
      title: '阿里商旅订单类型',
      dataIndex: 'type',
      render: (_, record) => (
        <span>{aliTravel[record.type]}</span>
      )
    }, {
      title: '说明',
      dataIndex: 'note',
    }];
    return (
      <div>
        <PageHead title="阿里商旅" isShowBtn disabled={authorize.isAuthorize} />
        <div className={cs(style.travel, 'content-dt')}>
          <Steps current={current} onChange={this.onChange} direction="vertical">
            <Step
              title={(<p className={style.first}>请确认公司已经开通【阿里商旅】，才可实现双方数据集成。如未开通可先至应用市场进行开通</p>)}
              description=""
            />
            <Step
              title={(
                <p className="fs-16" style={{ fontWeight: '400' }}>
                  若已经成功开通阿里商旅，则需要进行应用授权，阿里商旅暂时无法支持线上授权，线下授权需盖有企业公章的授权说明书
                  <a href="https://xfw-cost.oss-cn-hangzhou.aliyuncs.com/cost/22/file/%E5%95%86%E6%97%85ISV%E6%95%B0%E6%8D%AE%E6%8F%90%E4%BE%9B%E5%92%8C%E8%8E%B7%E5%8F%96%E6%8E%88%E6%9D%83%E4%B9%A6V1.0.docx">阿里商旅授权说明书</a>
                </p>
              )}
              description={(
                <div>
                  <p className="c-black-45 fs-14">- 企业：财务对账简单，阿里商旅平台数据自动导入，保证数据真实性</p>
                  <p className="c-black-45 fs-14">- 员工：阿里商旅的行程订单自动导入账本，单据提报更便捷</p>
                  <Button type="primary" className="m-t-16" style={{ marginBottom: '60px' }}>联系咨询</Button>
                </div>
              )}
            />
            <Step
              title={(<p>阿里商旅的订单完成后，支出数据会自动导入鑫支出，费用类型默认按以下规则进行匹配导入</p>)}
              description={(
                <div className="m-t-16">
                  <Table
                    columns={columns}
                    pagination={false}
                    dataSource={list}
                  />
                </div>
              )}
            />
          </Steps>
        </div>
      </div>
    );
  }
}

export default AllTravelData;
