import React, { PureComponent } from 'react';
import { Steps, Button, Table, Icon, Tree, Tooltip, Popover } from 'antd';
import cs from 'classnames';
import { connect } from 'dva';
import Search from 'antd/lib/input/Search';
import PageHead from '@/components/pageHead';
import treeConvert from '@/utils/treeConvert';
import qrCode from '@/assets/img/aliCode.png';
import style from './index.scss';

const aliTravel = {
  0: '机票',
  1: '火车票',
  2: '酒店',
  3: '用车',
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
    type: '',
    searchContent: '',
    lists: [],
    visible: false,
  }

  componentDidMount() {
    this.onQuery({});
    this.props.dispatch({
      type: 'aliTravelData/authorize',
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
      type: 'aliTravelData/editRef',
      payload: {
        type,
        costCategoryId: costCategoryId[0],
      }
    }).then(() => {
      this.props.dispatch({
        type: 'aliTravelData/authorize',
        payload: {},
      });
      this.setState({
        visible: false,
        searchContent: '',
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
          disabled={item.disabled}
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
      disabled={item.disabled}
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

  onSearch = (e) => {
    this.setState({
      searchContent: e.target.value,
    });
  }

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
      this.setState({
        lists: arr,
      });
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
    this.setState({
      searchContent: ''
    });
    this.onQuery({});
  }

  render () {
    const { current, searchContent, lists, visible } = this.state;
    const { list, authorize } = this.props;
    const columns = [{
      title: '支出类别',
      dataIndex: 'costCategoryName',
      render: (_, record) =>  {
        return (
          <span>
            <span className="m-r-8">{record.costCategoryName}</span>
            {
              authorize.isAuthorize &&
              <Popover
                trigger="click"
                overlayClassName={style.popStyle}
                icon={false}
                visible={visible === record.type}
                title={(
                  <div style={{height: '360px', width: '100%', position: 'relative'}}>
                    <div style={{padding: '10px 10px 0 10px'}}>
                      <Search style={{ marginBottom: 8 }} placeholder="请输入" onChange={this.onSearch} onSearch={e =>this.onNewSearch(e)} value={searchContent} />
                    </div>
                    <Tree
                      style={{width: '100%', height: '277px', overflow: 'scroll'}}
                      onSelect={(selectedKeys, info) =>this.onSelect(selectedKeys, info, record.type)}
                    >
                      {this.loop(lists)}
                    </Tree>
                    <div className={style.footers}>
                      <div className={style.footCont}>
                        <span>修改后，{aliTravel[record.type]}订单将默认按新类别导入</span>
                        <div
                          onClick={() => this.setState({visible: false})}
                          style={{background: '#fff', color: 'rgba(0, 0, 0, 0.65)', border: '1px solid #D9D9D9', marginRight: '8px'}}
                        >
                          取消
                        </div>
                        <div onClick={this.confirm}>确定</div>
                      </div>
                    </div>
                  </div>
                )}
                onConfirm={this.confirm}
                okText="确定"
                cancelText="取消"
                onCancel={() => this.onCancel()}
              >
                <Icon type="edit" style={{ color: 'rgba(0, 199, 149, 1)' }} onClick={() => this.setState({ visible: record.type })} />
              </Popover>
            }
          </span>
        );
      },
    }, {
      title: '阿里商旅',
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
        <PageHead title="阿里商旅" isShowBtn disabled={!authorize.isAuthorize} />
        <div className={cs(style.travel, 'content-dt')}>
          <Steps current={authorize.isAuthorize ? current : 0} onChange={this.onChange} direction="vertical">
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
                  <Tooltip placement="top" title={(<img alt="二维码" src={qrCode} className={style.qrCode} />)} overlayClassName={style.tooltips}>
                    <Button type="primary" className="m-t-16" style={{ marginBottom: '60px' }}>联系咨询</Button>
                  </Tooltip>
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
