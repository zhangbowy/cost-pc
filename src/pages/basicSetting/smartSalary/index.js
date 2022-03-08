/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
/* eslint-disable eqeqeq */
import React, { PureComponent } from 'react';
import { Steps, Button, Table, Tooltip, Divider, Popconfirm, message, Popover, Input, Modal, Form } from 'antd';
import cs from 'classnames';
import { connect } from 'dva';
import moment from 'moment';
import { Prompt } from 'react-router-dom';
import PageHead from '@/components/pageHead';
import treeConvert from '@/utils/treeConvert';
import img from '@/assets/img/znxcsm.png';
import style from './index.scss';
import AddAssets from './components/AddAssets';
import { ddOpenLink } from '../../../utils/ddApi';
import FooterBar from '../../../components/FooterBar';
// import { EditPrompt } from '../../../components/EditPrompt';

const authObj = {
  0: '已开通',
  1: '已过期',
  2: '未开通'
};
const { Step } = Steps;
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
    flag: true
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'smartSalary/authorize',
      payload: {},
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
    const { list } = this.state;
    if (type === 'add') {
      const newList = [...editList, ...list];
      this.setState({
        list: newList,
        flag: false,
      });
    } else {
      const listEdit = [...list];
      const index = list.findIndex(it => it.id === editList.id);
      listEdit.splice(index, 1, editList);
      this.setState({
        list: listEdit,
        flag: false,
      });
    }
  }

  onCancel = () => {
    this.onQuery({});
  }

  onDelete = (id) => {
    const { list } = this.state;
    this.setState({
      list: list.filter(it => it.id !== id),
      flag: false,
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
      this.setState({
        flag: true,
      });
    });
  }

  onLink = () => {
    ddOpenLink('https://h5.dingtalk.com/appcenter/index-pc.html?ddtab=true&funnelsource=xinfengwei&#/detail/FW_GOODS-1001006134');
  }

      /**
             * 判断此对象是否是Object类型
             * @param {Object} obj
             */
       isObject = (obj) => {
        return Object.prototype.toString.call(obj) === '[object Object]';
      }

      /**
       * 判断此类型是否是Array类型
       * @param {Array} arr
       */
      isArray = (arr) => {
        return Object.prototype.toString.call(arr) === '[object Array]';
      }

      /**
       *  深度比较两个对象是否相同
       * @param {Object} oldData
       * @param {Object} newData
       */
      equalsObj = (oldData, newData) => {
        // 类型为基本类型时,如果相同,则返回true
        if (oldData === newData) return true;
        if (this.isObject(oldData) && this.isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length) {
          // 类型为对象并且元素个数相同

          // 遍历所有对象中所有属性,判断元素是否相同
          for (const key in oldData) {
            if (oldData.hasOwnProperty(key)) {
              if (!this.equalsObj(oldData[key], newData[key]))
                // 对象中具有不相同属性 返回false
                return false;
            }
          }
        } else if (this.isArray(oldData) && this.isArray(oldData) && oldData.length === newData.length) {
          // 类型为数组并且数组长度相同

          for (let i = 0, {length} = oldData; i < length; i++) {
            if (!this.equalsObj(oldData[i], newData[i]))
              // 如果数组元素中具有不相同元素,返回false
              return false;
          }
        } else {
          // 其它类型,均返回false
          return false;
        }

        // 走到这里,说明数组或者对象中所有元素都相同,返回true
        return true;
      }

  render () {
    const { current, costList, list, len, flag } = this.state;
    const { authorize, saveTime } = this.props;
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
                <p className="c-black-65">删除后{record.assetsTypeName}的折旧费用将不会同步至鑫支出，点击右下角”保存”生效</p>
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
        <PageHead title="鑫资产数据集成" />
        <div className={cs(style.travel, 'content-dt')}>
          <Steps current={authorize === 0 ? current : 0} onChange={this.onChange} direction="vertical">
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
                  <Form layout="inline" className={style.submit}>
                    <Form.Item label="AppID">
                      <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item label="AppSecret">
                      <Input placeholder="请输入" />
                    </Form.Item>
                    <Button type="primary">提交凭证</Button>
                  </Form>
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
                    authorize === 0 &&
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
            authorize === 0 &&
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
        <Prompt
          when={!flag}
          message={(location) => {
            if (flag) return true;
            Modal.confirm({
              title: '确定离开当前页面吗？',
              content: '当前编辑的信息尚未保存，离开当前页面将会丢失已填写的内容。',
              okText: '保存',
              cancelText: '离开本页',
              onOk: () => {
                this.onSave();
              },
              onCancel: () => {
                this.setState({
                  flag: true
                });
                setTimeout(() => {
                  this.props.history.push(location.pathname);
                });
              }
            });
            return false;
          }}
        />
      </div>
    );
  }
}

export default AllTravelData;
