/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
/* eslint-disable eqeqeq */
import React, { PureComponent } from 'react';
import { Steps, Button, Table, Tooltip, Divider, Popconfirm, message, Popover, Input, Modal, Form } from 'antd';
import cs from 'classnames';
import { connect } from 'dva';
import moment from 'moment';
import PageHead from '@/components/pageHead';
import treeConvert from '@/utils/treeConvert';
import img from '@/assets/img/znxcsm.png';
import style from './index.scss';
import AddAssets from './components/AddAssets';
import { ddOpenLink } from '../../../utils/ddApi';
// import { EditPrompt } from '../../../components/EditPrompt';

const authObj = {
  0: '已开通',
  1: '已过期',
  2: '未开通'
};
const { Step } = Steps;
const formLabel = [{
  name: 'AppID',
  key: 'appId',
}, {
  name: 'AppSecret',
  key: 'appSecret',
}];

@Form.create()
@connect(({ smartSalary, global }) => ({
  authorize: smartSalary.authorize,
  list: smartSalary.list,
  assetsList: smartSalary.assetsList,
  costCategoryList: global.costCategoryList,
  saveTime: smartSalary.saveTime,
}))
class AllTravelData extends PureComponent {
  state = {
    current: 2,
    costList: [],
    list: [],
    len: 0,
    authorize: {},
  }

  componentDidMount() {
    this.onQuery({});
    this.props.dispatch({
      type: 'smartSalary/assetsList',
      payload: {
        type: 0
      },
    }).then(() => {
      this.setState({
        len: this.props.assetsList.length,
      });
    });
    this.props.dispatch({
      type: 'smartSalary/authorize',
      payload: {},
    }).then(() => {
      const { authorize } = this.props;
      this.setState({
        authorize,
        list: authorize.refs || [],
      });
    });
  }

  onSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        this.props.dispatch({
          type: 'smartSalary/authorize',
          payload: {
            ...value
          }
        }).then(() => {
          const { authorize } = this.props;
          if (authorize.isAuthorize) {
            message.success('授权成功');
          } else {
            message.error('授权失败');
          }
          this.setState({
            authorize,
            list: authorize.refs || [],
          });
        });
      }
    });
  }

  getAssets = () => {
    return new Promise(resolve => {
      this.props.dispatch({
        type: 'smartSalary/assetsList',
        payload: {
          type: 0
        },
      }).then(() => {
        const { assetsList } = this.props;
        resolve({
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

  onOK = (obj) => {
    const url = obj.id ? 'smartSalary/edit' : 'smartSalary/add';
    this.props.dispatch({
      type: url,
      payload: obj,
    }).then(() => {
      message.success(`${obj.id ? '编辑' : '新增'}成功`);
      this.query();
    });
  }

  query = () => {
    this.props.dispatch({
      type: 'smartSalary/authorize',
      payload: {},
    }).then(() => {
      const { authorize } = this.props;
      this.setState({
        authorize,
        list: authorize.refs || [],
      });
    });
  }

  onDelete = (id) => {
    this.props.dispatch({
      type: 'smartSalary/del',
      payload: {
        id
      }
    }).then(() => {
      message.success('删除成功');
      this.query();
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
    });
  }

  render () {
    const { current, costList, list, len, authorize } = this.state;
    const { saveTime, form: { getFieldDecorator } } = this.props;
    const columns = [{
      title: '鑫支出类别',
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
      title: '智能薪酬',
      dataIndex: 'humanCapitalName',
      width: 100,
    }, {
      title: '说明',
      dataIndex: 'note',
      width: 150,
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
            title={(
              <div style={{width: '260px'}}>
                <p className="c-black-85 fw-500">请确认删除吗?</p>
                <p className="c-black-65">删除后{record.humanCapitalName}智能薪酬类别将不会同步至鑫支出</p>
              </div>
            )}
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
        <PageHead title="智能薪酬数据集成" isShowBtn disabled={!authorize.isAuthorize} />
        <div className={cs(style.travel, 'content-dt')}>
          <Steps current={authorize.isAuthorize ? current : 0} onChange={this.onChange} direction="vertical">
            <Step
              title={(
                <p className="fs-14" style={{ fontWeight: '400' }}>
                  输入薪酬数据的API密钥进行数据授权，获取密钥路径：【智能薪酬】→【企业账户】→【接口授权】
                </p>
              )}
              description={(
                <div>
                  <p>1. 公司成功开通“智能薪酬专业版客户“及API接口后，才可实现双方数据集成（因薪资为保密数据，升级后联系智能薪酬客服开通API接口）；如未开通可先至应用市场进行开通。</p>
                  <p className="c-black-45 fs-12">
                    2. 该密钥仅智能薪酬的主管理员可见
                    <Popover
                      overlayClassName={style.popImg}
                      content={(
                        <div className={style.popStyle}>
                          <img src={img} alt="数据" style={{width: '384px'}} />
                        </div>
                      )}
                      placement="rightTop"
                    >
                      <a>查看页面示例</a>
                    </Popover>
                  </p>
                  <div className={style.submit}>
                    <Form layout="inline">
                      {
                        formLabel.map(it => (
                          <Form.Item label={it.name}>
                            {
                              getFieldDecorator(it.key, {
                                initialValue: authorize[it.key],
                              })(
                                <Input placeholder="请输入" />
                              )
                            }
                          </Form.Item>
                        ))
                      }
                      <Button type="primary" onClick={this.onSubmit}>提交凭证</Button>
                    </Form>
                    {
                      authorize.time &&
                      <p className="fs-12 c-black-45">上次提交时间：{moment(authorize.time).format('YYYY-MM-DD HH:mm:ss')}</p>
                    }
                  </div>
                </div>
              )}
            />
            <Step
              title={(<p className="fs-14 fw-400">智能薪酬的人力成本费用会按月自动导入鑫支出，费用类型默认按以下表格规则进行匹配导入</p>)}
              description={(
                <div>
                  <p className="fs-12 c-black-45 m-b-24">
                    默认取开通集成时智能薪酬的人力成本统计字段，后期智能薪酬修改后需同步在鑫支出调整匹配规则
                  </p>
                  {
                    list.length > 0 &&
                    <div>
                      {
                        len === list.length ?
                          <Tooltip title="已经没有可新增的智能薪酬类别">
                            <Button type="primary" className="m-b-16" disabled>新增智能薪酬字段</Button>
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
                            <Button type="primary" className="m-b-16">新增智能薪酬字段</Button>
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
        </div>
      </div>
    );
  }
}

export default AllTravelData;
