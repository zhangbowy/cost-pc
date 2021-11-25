import React, { Component } from 'react';
import cs from 'classnames';
import { Switch, Modal, Checkbox, Button, Radio, Tooltip, Divider, message } from 'antd';
import { connect } from 'dva';
import PageHead from '@/components/pageHead';
import style from './index.scss';
import Lines from '../../../components/StyleCom/Lines';
// import DataPush from './component/DataPush';

const viewSum = [{
  title: '以提交时间为准',
  name: '提交时间',
  value: 0,
  pro: '5月数据包含：5月提交，且已审核通过'
}, {
  title: '以审核通过时间为准',
  name: '审核通过时间',
  value: 1,
  pro: '5月数据包含：5月审核通过的单据。（示例：4月提交 5月审批通过 6月发放拒绝，这笔支出统计进5月，6月冲掉本笔支出）'
}, {
  title: '以发生日期为准',
  name: '发生时间',
  value: 2,
  pro: '5月数据包含：支出明细发生日期在本月范围内，且已审核通过'
}];
const moneySum = [{
  title: '标记已付',
  name: '标记已付',
  value: 0,
  pro: '线下其他渠道支付后，在鑫支出仅做标记使用',
  icon: 'icona-zhifu3x'
}, {
  title: '线上支付',
  name: '线上支付',
  value: 1,
  pro: '线上打开支付宝，验密后直接付款',
  icon: 'icona-zhifubaozhifu3x'
}];
@connect(({ systemControl, loading, costGlobal }) => ({
  isModifyInvoice: systemControl.isModifyInvoice,
  isModifyReload: systemControl.isModifyReload,
  isOpenProject: systemControl.isOpenProject,
  statisticsDimension: systemControl.statisticsDimension,
  roleUserList: costGlobal.roleUserList,
  details: systemControl.details,
  loading: loading.effects['systemControl/query'] || false,
}))
class SystemControl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      switchCheck: false,
      changeReload: false,
      statisticsDimension: 0,
      isOpenProject: false,
    };
    this.check = [{
      key: 'switchCheck',
      production: (
        <p className={style.production}>
          <span>开启后，在单据发放环节，发放人可对单据的部分信息进行修改后发放，无需重新打回。比如事由、金额等。<br />如需支持更多信息的修改，请至</span>
          <span className="sub-color">
            <a onClick={() => this.onLink(0)}>单据模版设置</a>/<a onClick={() => this.onLink(1)}>支出类别设置</a>
          </span>
          <span>，编辑页面操作</span>
        </p>
      ),
      name: '允许发放环节改单',
      onCall: e => this.onChange(e)
    }, {
      key: 'isOpenProject',
      production: (
        <p className={style.production}>
          <p>与设置-角色管理-操作权限设置配合使用。</p>
          <p>
            1.操作权限设置开启后，默认可见项目管理页面所有项目2.项目责任制开启后，项目负责人增加一层限制，仅可见作为项目负责人的项目列表
          </p>
        </p>
      ),
      name: '项目责任制',
      onCall: e => this.onChanges(e, 'isOpenProject')
    }, {
      key: 'isOpenAgentPush',
      production: (
        <p className={style.production}>
          单据审批通过后，给发放人发送钉钉待办消息提醒
        </p>
      ),
      name: '发放待办推送',
      onCall: e => this.handleTables({isOpenAgentPush: e})
    }, {
      key: 'isOpenLoan',
      production: (
        <p className={style.production}>
          逾期未还的借款，系统每周一发送催还提醒
        </p>
      ),
      name: '借款到期提醒',
      onCall: e => this.handleTables({isOpenLoan: e})
    }];
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'costGlobal/roleUserList',
      payload: {
        pageNo: 1,
        pageSize: 100
      },
    });
    this.props.dispatch({
      type: 'systemControl/query',
      payload: {},
    }).then(() => {
      this.onInit();
    });
  }

  onChangeHis = e => {
    this.setState({
      changeReload: e.target.checked,
    });
  }

  onInit = () => {
    const { isModifyInvoice, isModifyReload, statisticsDimension, isOpenProject } = this.props;
    this.setState({
      changeReload: isModifyReload,
      switchCheck: isModifyInvoice,
      statisticsDimension,
      isOpenProject,
    });
  }

  onSave = () => {
    const { changeReload } = this.state;
    this.setState({
      visible: false,
    });
    this.onQuery({
      isModifyInvoice: true,
      isModifyReload: changeReload,
    });
  };

  onQuery = (options) => {
    this.props.dispatch({
      type: 'systemControl/change',
      payload: {
        ...options,
      }
    });
  }

  onChange = e => {
    this.onQuery({
      isModifyInvoice: e,
      isModifyReload: false,
    });
    this.setState({
      switchCheck: e,
    });
    if (e) {
      this.setState({
        visible: true,
        changeReload: false,
      });
    } else {
      this.setState({
        changeReload: e,
      });
    }
  }

  onChanges = (e, key) => {
    const { switchCheck, changeReload, isOpenProject, statisticsDimension } = this.state;
    const { details } = this.props;
    const params = {
      isModifyReload: changeReload,
      isModifyInvoice: switchCheck,
      isOpenProject,
      statisticsDimension,
      [key]: key === 'isOpenProject' ? e : e.target.value,
    };
    if (key === 'statisticsDimension') {
      Modal.confirm({
        title: `确定将统计维度切换到${viewSum[e.target.value].name}吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.props.dispatch({
              type: 'systemControl/change',
              payload: {
                ...details,
                ...params,
              }
            }).then(() => {
              this.setState({
                [key]: key === 'isOpenProject' ? e : e.target.value,
              });
              console.log('走到这里了吗', e.target.value);
              console.log('走到这里了吗', key);
              if(key === 'statisticsDimension') {
                localStorage.removeItem('statisticalDimension');
                localStorage.setItem('statisticalDimension', e.target.value);
              }
            });
          },
          onCancel: () => {
            console.log('Cancel');
          },
      });
    } else {
      this.props.dispatch({
        type: 'systemControl/change',
        payload: {
          ...details,
          ...params,
        }
      }).then(() => {
        this.setState({
          [key]: key === 'isOpenProject' ? e : e.target.value,
        });
        if(key === 'statisticalDimension') {
          localStorage.removeItem('statisticalDimension');
          localStorage.setItem('statisticalDimension', e.target.value);
        }
      });
    }
  }

  handleTables = (params) => {
    console.log('SystemControl -> handleTables -> params', params);
    const { details, dispatch } = this.props;
    dispatch({
      type: 'systemControl/change',
      payload: {
        ...details,
        ...params,
      }
    }).then(() => {
      message.success('修改成功');
      this.props.dispatch({
        type: 'systemControl/query',
        payload: {},
      });
    });
  }

  onLink = (type) => {
    if (!type) {
      this.props.history.push('/basicSetting/invoice');
    } else {
      this.props.history.push('/basicSetting/costCategory');
    }
  }

  render () {
    const {
      visible,
      changeReload,
      statisticsDimension,
      switchCheck,
      isOpenProject,
    } = this.state;

    const { details } = this.props;
    const checkObj = {
      switchCheck,
      isOpenProject,
      isOpenAgentPush: details.isOpenAgentPush,
      isOpenLoan: details.isOpenLoan
    };
    return (
      <div>
        <PageHead title="全局配置" />
        <div className="content-dt" style={{height: 'calc(100vh - 208px)'}}>
          <Lines name="全局配置" />
          <div className="m-t-24">
            {
              this.check.map(it => (
                <div className={style.content} key={it.key}>
                  <p>
                    <span>{it.name}</span>
                    <Tooltip title={it.production}>
                      <i className="iconfont iconshuomingwenzi" />
                    </Tooltip>
                    <span>：</span>
                  </p>
                  <Switch className={style.switch} onChange={it.onCall} checked={checkObj[it.key]} />
                </div>
              ))
            }
          </div>
          <Divider type="horizontal" style={{ margin: '32px 0 24px 0' }} />
          <Lines name="个性化设置" />
          <div className="m-t-24">
            <div className={style.content}>
              <p>
                <span>统计维度设置：</span>
              </p>
              <Radio.Group value={statisticsDimension} onChange={e => this.onChanges(e, 'statisticsDimension')}>
                {
                  viewSum.map(it => (
                    <Radio value={it.value} key={it.value}>
                      <span className="fs-14 c-black-85">{it.title}</span>
                      <Tooltip title={it.pro}>
                        <i className="iconfont iconshuomingwenzi" />
                      </Tooltip>
                    </Radio>
                  ))
                }
              </Radio.Group>
            </div>
            <div className={style.content}>
              <p className="m-t-8">
                <span>默认支付方式：</span>
              </p>
              {
                moneySum.map(it => (
                  <div
                    className={details.paymentMethod === it.value ? cs(style.payList, style.active) : style.payList}
                    key={it.value}
                    onClick={() => this.handleTables({ paymentMethod: it.value })}
                  >
                    <div className={style.payImg} style={{ background: !it.value ? '#FFF6EC' : '#ECF7FF' }}>
                      <i className={`iconfont ${it.icon}`} style={{ color: !it.value ? '#FFA01A' : '#0084FF' }}/>
                    </div>
                    <div className={style.rightP}>
                      <p className="c-black-85">{it.title}</p>
                      <p className={style.pros}>{it.pro}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <Divider type="horizontal" />
          {/* <Lines name="数据推送">
            <span className={style.datas}>
              <i className="iconfont icona-jinggao3x" />
              <span>推送数据为当前人员/角色的最大数据权限范围</span>
            </span>
          </Lines> */}
          {/* <DataPush roleUserList={roleUserList} details={details} onChange={this.handleTables} /> */}
        </div>
        <Modal
          visible={visible}
          title='改单是否留痕'
          bodyStyle={{
            padding: '0 24px 10px'
          }}
          footer={[
            <Button key="cancel">取消</Button>,
            <Button key="save" onClick={() => this.onSave()} type="primary">保存</Button>
          ]}
          onCancel={() => this.setState({ visible: false })}
          className={style.modalInfo}
        >
          <Checkbox
            value={changeReload}
            onChange={e => this.onChangeHis(e)}
          >
            开启留痕，在发放环节修改的所有信息，均可追溯查看
          </Checkbox>
        </Modal>
      </div>
    );
  }
}

export default SystemControl;
