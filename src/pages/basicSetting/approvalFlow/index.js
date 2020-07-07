import React, { Component } from 'react';
import { Select, Button, message } from 'antd';
import cs from 'classnames';
import MenuItems from '@/components/AntdComp/MenuItems';
import { defaultFlow, repeatMethod } from '@/utils/constants';
import { connect } from 'dva';
// import ApproveProcess from './components/approveNode/ApproveProcess';
import style from './index.scss';
import Process from './components/Process';

@connect(({ approvalFlow }) => ({
  nodes: approvalFlow.nodes,
  detailNode: approvalFlow.detailNode,
}))
class ApprovalFlow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: {},
      status: 'CreatorFirstLeader',
      repeatMethods: 'NONE',
      ccPosition: '',
    };
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'global/costList',
      payload: {}
    });
    this.props.dispatch({
      type: 'global/approverRole',
      payload: {
        pageNo: 1,
        pageSize: 1000,
      }
    });
    this.props.dispatch({
      type: 'approvalFlow/list',
      payload: {
        uniqueMark: 'CreatorFirstLeader',
        deepQueryFlag: false,
      },
    }).then(() => {
      const { nodes, detailNode } = this.props;
      this.setState({
        nodes,
        ccPosition: detailNode.ccPosition,
        repeatMethods: detailNode.repeatMethod,
      });
    });
  }

  onHandle = (val) => {
    this.setState({
      status: val,
    });
    this.props.dispatch({
      type: 'approvalFlow/list',
      payload: {
        uniqueMark: val,
        deepQueryFlag: false,
      },
    }).then(() => {
      const { nodes, detailNode } = this.props;
      this.setState({
        nodes,
        ccPosition: detailNode.ccPosition,
        repeatMethods: detailNode.repeatMethod,
      });
    });
  }

  onQuery = (payloads) => {
    this.props.dispatch({
      type: 'approvalFlow/list',
      payload: payloads,
    }).then(() => {
      const { nodes, detailNode } = this.props;
      this.setState({
        nodes,
        ccPosition: detailNode.ccPosition,
        repeatMethods: detailNode.repeatMethod,
      });
    });
  }

  onChange = (nodes) => {
    this.setState({
      nodes,
    });
  }

  onStartChange = (data) => {
    console.log(data);
  }

  save = () => {
    console.log(this.processData && this.processData.getData());
    const { status, repeatMethods, ccPosition } = this.state;

    const data = this.processData.getData();
    Promise.all([data]).
    then(res => {
      this.props.dispatch({
        type: 'approvalFlow/add',
        payload: {
          node: res[0].formData,
          uniqueMark: status,
          repeatMethod: repeatMethods,
          ccPosition,
          deepQueryFlag: false,
        }
      }).then(() => {
        this.onQuery({
          uniqueMark: status,
        });
        message.success('保存成功');
      });
    }).catch(err => {
      console.log(err);
    });
  }

  onChangRepeat = (val) => {
    this.setState({
      repeatMethods: val,
    });
  }

  onChangePosition = (val) => {
    this.setState({
      ccPosition: val,
    });
  }

  render() {
    const { status, repeatMethods } = this.state;
    const { nodes } = this.state;
    return (
      <div style={{ height: '100%' }}>
        <div className="app_header">
          <p className="app_header_title">审批设置</p>
          <p className="app_header_line">默认为您提供5种类型的审批流程，您也可以自定义设置审批人</p>
        </div>
        <div className={cs('content-dt', style.approval_cnt)} style={{ height: 'auto' }}>
          <MenuItems
            lists={defaultFlow}
            onHandle={(val) => this.onHandle(val)}
            status={status}
          />
          <div className={style.nodeCnt}>
            <div className={style.method_box}>
              <p>审批去重</p>
              <Select
                value={repeatMethods}
                style={{minWidth: '300px'}}
                onChange={(val) => this.onChangRepeat(val)}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {
                  repeatMethod.map(it => (
                    <Select.Option key={it.key}>{it.value}</Select.Option>
                  ))
                }
              </Select>

            </div>
            <div className={style.approval_process} key={status}>
              <Process
                conf={nodes}
                tabName="processDesign"
                startNodeChange={this.onChange}
                ref={data => {this.processData = data;}}
              />
              <p className={style.save_box}><Button type="primary" onClick={() => this.save()}>保存</Button></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ApprovalFlow;
