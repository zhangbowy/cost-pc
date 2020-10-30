import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Table, Form, Modal, Button, message, Input, Icon } from 'antd';
// import SubHeader from '@/components/SubHeader';
import getDateUtil from '@/utils/tool';
import { formItemLayout } from '@/utils/constants';
// import addAvatar from '@/assets/img/allAvatars.png';
import PageHead from '@/components/PageHead';
import style from './index.scss';

const { confirm } = Modal;

@Form.create()
@connect(({ currency, loading }) => ({
  loading: loading.effects['currency/list'] || false,
  list: currency.list,
  query: currency.query,
  total: currency.total,
}))
class ApproveIndex extends Component {
  static propTypes = {
    list: PropTypes.array,
    query: PropTypes.object,
    total: PropTypes.number,
  }

  state = {
    visible: false,
    isOpen: false,
    currencyData:{},
  }

  componentDidMount() {
    this.onQuery({
      pageNo:1,
      pageSize: 10,
    });
  }

  onOk = () => {
    const { query } = this.props;
    this.onQuery({
      ...query,
    });
  }

  onLink = (id) => {
    this.props.history.push(`/system/approve/${id}`);
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'currency/list',
      payload,
    });
  }

  showModel = (record,isEdit) => {
    if(isEdit){
      this.setState({isOpen:false, currencyData: record, visible: true });
      console.log(record.exchangeRate);
      this.props.form.setFields({
        exchangeRate: {
          value: record.exchangeRate,
        },
      });
      return;
    }
    if(record.status){
      this.setState({isOpen:true, currencyData: record, visible: true });
      this.props.form.setFields({
        exchangeRate: {
          value: '',
        },
      });
    }else{
      const payload = {
        currencyType: record.currencyType,
        exchangeRate: record.exchangeRate,
        status: 1
      };
      if(record.id){
        payload.id = record.id;
      }
      const { dispatch } = this.props;
      const that = this;
      confirm({
        title: '确定禁用该币种吗？',
        // okText: '确定',
        // cancelText: '取消',
        onOk() {
          dispatch({
            type: 'currency/del',
            payload
          }).then(() => {
            message.success('禁用成功');
            that.onQuery({});
          });
        },
      });
    }
  }

  handleOk = () => {
    const {
      form,
      dispatch,
      loading,
    } = this.props;
    const { currencyData, isOpen } = this.state;
    if (loading) return;
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        const payload = {
          currencyType: currencyData.currencyType,
          status: isOpen?'0':currencyData.status,
          exchangeRate: values.exchangeRate
        };
        if(currencyData.id){
          payload.id = currencyData.id;
        }
        const that = this;
        dispatch({
          type: 'currency/del',
          payload
        }).then(() => {
          that.setState({visible: false});
          message.success(isOpen?'开启成功':'修改成功');
          that.onQuery({});
        });
      }
    });
  }

  render() {
    const {
      list,
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const { visible, isOpen, currencyData } = this.state;
    console.log(formItemLayout);
    formItemLayout.labelCol.sm.span = 3;
    const columns = [{
      title: '币种名称',
      dataIndex: 'name',
    }, {
      title: '编码',
      dataIndex: 'currencyCode',
    }, {
      title: '符号',
      dataIndex: 'currencySymbol',
    }, {
      title: '汇率',
      dataIndex: 'exchangeRate',
      render: (text,record) => (
        <span>
          {(!record.status&&text)?text:''}
          {(!record.status&&text)?<Icon type="form" className="sub-color m-l-8" onClick={()=>{ this.showModel(record,true); }} />:''}
        </span>
      ),
    }, {
      title: '最近修改汇率时间',
      dataIndex: 'updateTime',
      render: (text) => (
        text?getDateUtil(text,'yyyy-MM-dd hh:mm:ss'):''
      ),
    }, {
      title: '状态',
      dataIndex: 'status',
      render: (text) => (
        <span>
          <span className={!text?style.circleGreen:style.circleRed} />
          {!text?'启用':'禁用'}
        </span>
      ),
      className: 'fixCenter'
    }, {
      title: '操作',
      dataIndex: 'ope',
      render: (_, record) => (
        <span>
          { (record.currencyType !== 3 &&
            <Button type="link" onClick={() => { this.showModel(record); }} >{!record.status?'关闭':'开启'}</Button>)
            || '-'}
        </span>
      ),
      width: '190px',
      className: 'fixCenter'
    }];
    return (
      <div>
        {/* <SubHeader
          type="role"
          content={{
            roleName: '多币种与汇率',
            note: '本币默认CNY人民币，开启其他币种后，所有报销单均需选择币种才可发起申请（声明：人民币的核算均以当前已输入汇率进行计算）',
          }}
          {...this.props}
        /> */}
        <PageHead title="多币种与汇率" note="本币默认CNY人民币，开启其他币种后，所有报销单均需选择币种才可发起申请（声明：人民币的核算均以当前已输入汇率进行计算）" />
        <div className="content-dt">
          <Table
            rowKey="currencyType"
            columns={columns}
            dataSource={list}
            loading={loading}
            overflow={{x: 1000}}
            pagination={false}
          />
        </div>
        <Modal
          title={`${(isOpen? '开启（' : '修改汇率（')+currencyData.name}）`}
          visible={visible}
          onOk={this.handleOk}
          onCancel={() => { this.setState({visible: false}); }}
          okText="确认"
          width="480px"
          cancelText="取消"
          bodyStyle={{
            height: '220px',
          }}
        >
          { isOpen &&
            <div className={style.alert}>
              <i className="iconfont iconinfo-cirlce fs-20 sub-color m-r-8 m-l-16" style={{marginTop: '-4px'}} />
              <span className="c-black-65">
                启用该币种后，所有报销单据均需选择币种才可发起申请
              </span>
            </div>}
          <div style={{height: isOpen?'24px':'48px'}} />
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label="汇率" {...formItemLayout} >
              {getFieldDecorator('exchangeRate', {
                rules: [
                  {
                    required: true,
                    message: '请输入汇率!',
                  },{
                    pattern: /^((\d{1,10}(\.{1}\d{1,4}))|([1-9]\d{0,9}))$/g,
                    message: '汇率不能为0，最多保留4位小数!',
                  },{
                    max:10,
                    message: '汇率不能超过十位'
                  }
                ],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ApproveIndex;

