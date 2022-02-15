import React, { PureComponent } from 'react';
import { Steps, Button, Table, Tree, Tooltip, Divider } from 'antd';
import cs from 'classnames';
import { connect } from 'dva';
import PageHead from '@/components/pageHead';
import treeConvert from '@/utils/treeConvert';
import qrCode from '@/assets/img/aliCode.png';
import style from './index.scss';
import AddAssets from './components/AddAssets';

const aliTravel = {
  0: '机票',
  1: '火车票',
  2: '酒店',
  3: '用车',
};
const { Step } = Steps;
const { TreeNode } = Tree;
@connect(({ assets, global }) => ({
  authorize: assets.authorize,
  list: assets.list,
  costCategoryList: global.costCategoryList,
}))
class AllTravelData extends PureComponent {
  state = {
    current: 2,
    costCategoryId: '',
    type: '',
  }

  componentDidMount() {
    this.onQuery({});
    this.props.dispatch({
      type: 'assets/authorize',
      payload: {},
    }).then(() => {
      console.log(this.props.authorize);
      const { authorize } = this.props;
      localStorage.setItem('aliTripAuthorize', authorize.isAuthorize ? '0' : '1');
    });
  }

  confirm = () => {
    const { type, costCategoryId } = this.state;
    this.props.dispatch({
      type: 'assets/editRef',
      payload: {
        type,
        costCategoryId: costCategoryId[0],
      }
    }).then(() => {
      this.props.dispatch({
        type: 'assets/authorize',
        payload: {},
      });
      this.setState({
      }, () => {
        this.onQuery({});
      });

    });
  }

  // 循环渲染树结构
  loop = data => data.map(item => {
    const { selectedKeys } = this.state;
    if (item.children && item.children.length) {
      return (
        <TreeNode
          key={item.value}
          label={item.title}
          value={item.value}
          disabled={!item.type}
          title={(
            <div className={selectedKeys === item.value ? cs(style.costs, 'icons') : 'icons'}>
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
      disabled={!item.type}
      title={(
        <div style={{ width: '100%' }} className={selectedKeys === item.value ? cs(style.costs, 'icons') : 'icons'}>
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

  onNewSearch = (e) => {
    console.log(e);
    this.onQuery({ costName: e });
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'global/costList',
      payload,
    }).then(() => {
      let arr = [];
      const { costCategoryList } = this.props;
      if (payload.costName) {
        arr = costCategoryList.map(it => {
          return {
            title: it.costName,
            value: it.id,
            icon: it.icon,
            type: it.type
          };
        });
      } else {
        arr = treeConvert({
          rootId: 0,
          pId: 'parentId',
          name: 'costName',
          tId: 'value',
          tName: 'title',
          otherKeys: ['type','showField', 'icon']
        }, costCategoryList);
      }
      console.log(arr);
    });
  }

  onSelect = (selectedKeys, info, type) => {
    console.log('selected', selectedKeys, info);
    this.setState({
      costCategoryId: selectedKeys,
      type,
    });
  };

  onCancel = () => {
    this.onQuery({});
  }

  render () {
    const { current } = this.state;
    const { list, authorize } = this.props;
    const columns = [{
      title: (
        <span>
          鑫支出类别
          <Tooltip title="折旧费用按月计入">
            <i className="iconfont iconshuomingwenzi fs-14 c-black-45 m-l-8" />
          </Tooltip>
        </span>
      ),
      dataIndex: 'costCategoryName',
      render: (_, record) =>  {
        return (
          <span>
            <span className="m-r-8">{record.costCategoryName}</span>
          </span>
        );
      },
    }, {
      title:  (
        <span>
          鑫资产类别
          <Tooltip title="默认为鑫资产的第一级资产分类，可添加/删">
            <i className="iconfont iconshuomingwenzi fs-14 c-black-45 m-l-8" />
          </Tooltip>
        </span>
      ),
      dataIndex: 'type',
      render: (_, record) => (
        <span>{aliTravel[record.type]}</span>
      )
    }, {
      title: '说明',
      dataIndex: 'note',
    }, {
      title: '操作',
      dataIndex: 'operate',
      render: () => (
        <span>
          <a>删除</a>
          <Divider type="vertical" />
          <a>编辑</a>
        </span>
      )
    }];
    return (
      <div>
        <PageHead title="鑫资产数据集成" isShowBtn disabled={!authorize.isAuthorize} />
        <div className={cs(style.travel, 'content-dt')}>
          <Steps current={authorize.isAuthorize ? current : 0} onChange={this.onChange} direction="vertical">
            <Step
              title={(
                <p className="fs-14" style={{ fontWeight: '400' }}>
                  开通鑫资产
                </p>
              )}
              description={(
                <div>
                  <p className="c-black-45 fs-12">公司开通「鑫资产」后，才可实现双方数据集成，请先开通鑫资产，</p>
                  <Tooltip placement="top" title={(<img alt="二维码" src={qrCode} className={style.qrCode} />)} overlayClassName={style.tooltips}>
                    <Button type="primary" className="m-t-16" style={{ marginBottom: '60px' }}>去开通</Button>
                  </Tooltip>
                </div>
              )}
            />
            <Step
              title={(<p className="fs-14 fw-400">类目映射（设置导入的鑫资产费用类别）</p>)}
              description={(
                <div>
                  <p className="fs-14 c-black-45 m-b-24">鑫资产产生折旧费用后，支出数据会自动导入鑫支出，费用类型默认按照设置好的类目匹配规则自动导入鑫支出。</p>
                  <div>
                    <AddAssets>
                      <Button type="primary" className="m-b-16">新增类目映射</Button>
                    </AddAssets>
                    <Table
                      columns={columns}
                      pagination={false}
                      dataSource={list}
                    />
                  </div>
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
