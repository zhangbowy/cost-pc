import React, { PureComponent } from 'react';
import { Steps, Button, Table, Tooltip, Divider, Popconfirm, message, Popover } from 'antd';
import cs from 'classnames';
import { connect } from 'dva';
import moment from 'moment';
import PageHead from '@/components/pageHead';
import treeConvert from '@/utils/treeConvert';
import img from '@/assets/img/xzc.png';
import style from './index.scss';
import AddAssets from './components/AddAssets';
import { ddOpenLink } from '../../../utils/ddApi';
import FooterBar from '../../../components/FooterBar';
import { EditPrompt } from '../../../components/EditPrompt';

const { Step } = Steps;
@connect(({ assets, global }) => ({
  authorize: assets.authorize,
  list: assets.list,
  assetsList: assets.assetsList,
  costCategoryList: global.costCategoryList,
  saveTime: assets.saveTime,
}))
class AllTravelData extends PureComponent {
  state = {
    current: 2,
    costList: [],
    list: [],
    len: 0,
  }

  componentDidMount() {
    this.onQuery({});
    this.props.dispatch({
      type: 'assets/list',
      payload: {},
    }).then(() => {
      const { list } = this.props;
      this.setState({
        list,
      });
    });
    this.props.dispatch({
      type: 'assets/assetsList',
      payload: {
        type: 0
      },
    }).then(() => {
      const { assetsList } = this.props;
      this.setState({
        len: assetsList.length,
      });
    });
    this.props.dispatch({
      type: 'assets/authorize',
      payload: {},
    }).then(() => {
      console.log(this.props.authorize);
      const { authorize } = this.props;
      localStorage.setItem('aliTripAuthorize', authorize.isAuthorize ? '0' : '1');
    });
  }

  getAssets = () => {
    return new Promise(resolve => {
      this.props.dispatch({
        type: 'assets/assetsList',
        payload: {
          type: 0
        },
      }).then(() => {
        const { assetsList } = this.props;
        const lists = treeConvert({
          rootId: '0',
          pId: 'parentId',
          name: 'name',
          id: 'id',
          tName: 'label',
          tId: 'value',
          others: ['path', 'parentId']
        }, assetsList);
        resolve({
          tree: lists,
          lists: assetsList
        });
      });
    });
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
        costList: arr,
      });
    });
  }

  onOK = ({ type, editList }) => {
  console.log('🚀 ~ file: index.js ~ line 107 ~ AllTravelData ~ editList', editList);
    const { list } = this.state;
    if (type === 'add') {
      const newList = [...editList, ...list];
      this.setState({
        list: newList,
      });
    } else {
      const listEdit = [...list];
      const index = list.findIndex(it => it.id === editList.id);
      listEdit.splice(index, 1, editList);
      console.log('🚀 ~ file: index.js ~ line 116 ~ AllTravelData ~ list', listEdit);
      this.setState({
        list: listEdit,
      });
    }
  }

  onCancel = () => {
    this.onQuery({});
  }

  onDelete = (id) => {
    const { list } = this.state;
    this.setState({
      list: list.filter(it => it.id !== id)
    });
  }

  onSave = () => {
    const { list } = this.state;
    this.props.dispatch({
      type: 'assets/onSave',
      payload: {
        list: list.map(it => {
          return {
            ...it,
            id: it.id && `${it.id}`.indexOf('add_') > -1 ? '' : it.id
          };
        })
      }
    }).then(() => {
      message.success('保存成功');
      this.props.dispatch({
        type: 'assets/list',
        payload: {}
      }).then(() => {
        const newList = this.props.list;
        this.setState({
          list: newList,
        });
      });
    });
  }

  onLink = () => {
    ddOpenLink('https://h5.dingtalk.com/appcenter/index-pc.html?ddtab=true&funnelsource=xinfengwei&#/detail/FW_GOODS-1001006134');
  }

  render () {
    const { current, costList, list, len } = this.state;
    const { authorize, saveTime } = this.props;
    const newList = this.props.list;
    const columns = [{
      title: (
        <span>
          鑫支出类别
          <Tooltip title="折旧费用按月计入">
            <i className="iconfont iconshuomingwenzi fs-14 c-black-45 m-l-8" />
          </Tooltip>
        </span>
      ),
      dataIndex: 'categoryName',
      render: (_, record) =>  {
        return (
          <span>
            <span className="m-r-8">{record.categoryName}</span>
          </span>
        );
      },
      width: 150,
    }, {
      title:  (
        <span>
          鑫资产类别
          <Tooltip title="默认为鑫资产的第一级资产分类，可添加/删">
            <i className="iconfont iconshuomingwenzi fs-14 c-black-45 m-l-8" />
          </Tooltip>
        </span>
      ),
      dataIndex: 'assetsTypeName',
      width: 150,
    }, {
      title: '说明',
      dataIndex: 'note',
      width: 100,
      render: (text) => (
        <span>
          <Tooltip placement="topLeft" title={text || ''}>
            <span className="eslips-2">{text}</span>
          </Tooltip>
        </span>
      ),
    }, {
      title: '操作',
      dataIndex: 'operate',
      render: (_, record) => (
        <span>
          <Popconfirm
            onConfirm={() => this.onDelete(record.id)}
            title="请确认删除？"
          >
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <AddAssets
            details={record}
            costList={costList}
            getAssets={this.getAssets}
            list={list}
            type="edit"
            onOk={this.onOK}
          >
            <a>编辑</a>
          </AddAssets>
        </span>
      ),
      width: 80,
    }];
    return (
      <div>
        <PageHead title="鑫资产数据集成" />
        <div className={cs(style.travel, 'content-dt')}>
          <Steps current={authorize ? current : 0} onChange={this.onChange} direction="vertical">
            <Step
              title={(
                <p className="fs-14" style={{ fontWeight: '400' }}>
                  开通鑫资产
                </p>
              )}
              description={(
                <div>
                  <p className="c-black-45 fs-12">
                    公司开通「鑫资产」后，才可实现双方数据集成，请先开通鑫资产，
                    <Popover
                      overlayClassName={style.popImg}
                      content={(
                        <div className={style.popStyle}>
                          <img src={img} alt="数据" style={{width: '384px'}} />
                        </div>
                      )}
                      placement="rightTop"
                    >
                      <a>查看鑫资产介绍</a>
                    </Popover>
                  </p>
                  {
                    !authorize &&
                    <Button type="primary" className="m-t-16" style={{ marginBottom: '60px' }} onClick={() => this.onLink()}>去开通</Button>
                  }
                </div>
              )}
            />
            <Step
              title={(<p className="fs-14 fw-400">类目映射（设置导入的鑫资产费用类别）</p>)}
              description={(
                <div>
                  <p className="fs-14 c-black-45 m-b-24">
                    鑫资产产生折旧费用后，支出数据会自动导入鑫支出，费用类型默认按照设置好的类目匹配规则自动导入鑫支出。
                  </p>
                  {
                    authorize &&
                    <div>
                      {
                        len === list.length ?
                          <Tooltip title="已经没有可新增的资产费用类别">
                            <Button type="primary" className="m-b-16" disabled>新增类目映射</Button>
                          </Tooltip>
                          :
                          <AddAssets
                            details={{}}
                            costList={costList}
                            getAssets={this.getAssets}
                            list={list}
                            type="add"
                            onOk={this.onOK}
                          >
                            <Button type="primary" className="m-b-16">新增类目映射</Button>
                          </AddAssets>
                      }
                      <Table
                        columns={columns}
                        pagination={false}
                        dataSource={list}
                      />
                    </div>
                  }
                </div>
              )}
            />
          </Steps>
          {
            authorize &&
            <FooterBar
              right={(
                <div>
                  {
                    saveTime &&
                    <span className="fs-14 c-black-45 m-r-16">上次保存时间：{moment(saveTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                  }
                  <Button type="primary" onClick={this.onSave}>保存</Button>
                </div>
              )}
            />
          }
        </div>
        <EditPrompt history={this.props.history} isModal={JSON.stringify(newList) !== JSON.stringify(list)} />
      </div>
    );
  }
}

export default AllTravelData;
