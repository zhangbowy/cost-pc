import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Button } from 'antd';
import moment from 'moment';
import PageHead from '@/components/pageHead';
import style from './index.scss';
import { ddDing } from '../../../utils/ddApi';


@connect(({ sendDing, loading }) => ({
  list: sendDing.list,
  loading: loading.effects['sendDing/list'] || false,
}))
class SendDing extends Component {
  static propTypes = {

  }

  componentDidMount() {
    this.onQuery({});
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'sendDing/list',
      payload,
    });
  }

  onDing = async() => {
    const { list } = this.props;
    const result = await ddDing({
      users: list.users || [],
      text: '请及时审批鑫支出单据'
    });
    if(result.isOk) {
      this.props.dispatch({
        type: 'sendDing/add',
        payload:{}
      }).then(() => {
        this.onQuery({});
      });
    }
  }

  render() {
    const {
      list,
    } = this.props;
    return (
      <div className="mainContainer">
        <PageHead
          title="一键发Ding催办"
        />
        <div className="content-dt" style={{ height: '156px' }}>
          <div className={style.cnt_foot}>
            <div className={style.header}>
              <div className={style.line} />
              <span className="fs-14 c-black-85 fw-400">发送ding消息给当前处在审批中的单据，接收人包括当前节点审批人</span>
            </div>
          </div>
          <Button type="default" onClick={() => this.onDing()}>一键发Ding</Button>
          {
            list.alertDate &&
            <p className="m-t-8 c-black-45 fs-12">上次时间：{list.alertDate ? moment(list.alertDate).format('YYYY-MM-DD HH:mm:ss') : ''}</p>
          }
        </div>
      </div>
    );
  }
}

export default SendDing;
