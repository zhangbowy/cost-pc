import React, { Component } from 'react';
import { Modal, Icon, Button, Input, Select, message } from 'antd';
import { connect } from 'dva';
import style from './addFlow.scss';
import { repeatMethod } from '../../../../utils/constants';
import Process from './Process';

@connect(({ global }) => ({
  nodes: global.nodes,
  initDetailNode: global.initDetailNode,
  initNode: global.initNode,
  detailNode: global.detailNode
}))
class AddFlow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      flag: true,
      nodes: {},
      repeatMethods: '',
      name: '',
    };
  }

  onShow = async() => {
    console.log('点击了');
    const { title, processPersonId, name } = this.props;
    this.props.dispatch({
      type: 'global/costList',
      payload: {}
    });
    this.props.dispatch({
      type: 'global/projectList',
      payload: {},
    });
    this.props.dispatch({
      type: 'global/supplierList',
      payload: {},
    });
    this.props.dispatch({
      type: 'global/approverRole',
      payload: {
        pageNo: 1,
        pageSize: 1000,
      }
    });
    await this.props.dispatch({
      type: 'global/approverPersonList',
      payload: {}
    });
    if (title === 'add') {
      await this.props.dispatch({
        type: 'global/initNode',
        payload: {}
      }).then(() => {
        const { initNode, initDetailNode } = this.props;
        this.setState({
          nodes:initNode,
          ccPosition: initDetailNode.ccPosition,
          repeatMethods: initDetailNode.repeatMethod,
          visible: true,
          name
        });
      });

    } else {
      await this.props.dispatch({
        type: 'global/nodeList',
        payload: {
          processPersonId,
          deepQueryFlag: false,
        },
      }).then(() => {
        const { nodes, detailNode } = this.props;
        this.setState({
          nodes,
          ccPosition: detailNode.ccPosition,
          repeatMethods: detailNode.repeatMethod,
          visible: true,
          name: title === 'copy' ? `${name}-副本` : name,
        });
      });
    }

  }

  handleCancel = () => {
    this.setState({
      visible: false,
      flag: true,
      nodes: {},
      repeatMethods: '',
    });
  }

  handleTitle = () => {
    const { flag } = this.state;
    this.setState({
      flag: !flag,
    });
  }

  onInput = e => {
    this.setState({
      name: e.target.value,
    });
  }

  onBlur = () => {
    this.setState({
      flag: false,
    });
  }

  onQuery = (payloads) => {
    this.props.dispatch({
      type: 'global/nodeList',
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
    const { templateType, processPersonId, title, dispatch } = this.props;
    const { status, repeatMethods, ccPosition, name } = this.state;

    const data = this.processData.getData();
    const params = {
      uniqueMark: status,
      repeatMethod: repeatMethods,
      ccPosition,
      deepQueryFlag: false,
      templateType,
      name
    };
    let url = 'global/addNode';
    if (title === 'edit') {
      Object.assign(params, { processPersonId });
      url = 'global/editNode';
    }
    Promise.all([data]).
    then(res => {
      dispatch({
        type: url,
        payload: {
          ...params,
          node: res[0].formData,
        },
      }).then(() => {
        this.props.onOk();
        message.success('保存成功');
        this.setState({
          visible: false,
        });
      });
    }).catch(err => {
      console.log(err);
    });
  }

  render() {
    const { children, templateType } = this.props;
    const { visible, flag, ccPosition, nodes, repeatMethods, name } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title={null}
          footer={null}
          visible={visible}
          width="100%"
          top="0"
          style={{
            top: '0',
            height: '100vh',
            backgroundColor: ' #F7F8FA',
            padding: 0,
            overflowY: 'scroll'
          }}
          bodyStyle={{
            height: '100vh',
            padding: 0,
            backgroundColor: ' #F7F8FA',
            overflowY: 'scroll'
          }}
          onCancel={this.handleCancel}
          closable={false}
        >
          <div>
            <div className={style.titles}>
              <div className={style.inputs}>
                <Icon className="m-r-8 cur-p" type="left" onClick={() => this.handleCancel()} />
                {
                  flag ?
                    <span>{name}</span>
                    :
                    <Input value={name} onInput={e => this.onInput(e)} onBlur={() => this.onBlur()} />
                }
                <Icon type="form" className="sub-color m-l-8" onClick={() => this.handleTitle()} />
              </div>
              <Button type="primary" key="save" onClick={() => this.save()}>保存</Button>
            </div>
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
              <div className={style.approval_process}>
                <Process
                  conf={nodes}
                  tabName="processDesign"
                  startNodeChange={this.onChange}
                  ref={data => {this.processData = data;}}
                  onChangePosition={this.onChangePosition}
                  ccPosition={ccPosition}
                  templateType={templateType}
                />
              </div>
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}

export default AddFlow;
