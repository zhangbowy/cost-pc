import React from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'dva';
import style from './index.scss';
import ModalTemp from '../../../../components/ModalTemp';

@connect(({ global, loading }) => ({
  serviceTime: global.serviceTime,
  loading: loading.effects['global/batchPay'] || false
}))
class ComfirmPay extends React.PureComponent {
  // useEffect(() => {
  //   props.dispatch({
  //     type: 'global/signDetail',
  //     payload: {},
  //   });
  // }, []);
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      tiemStr: ''
    };
  }

  componentWillUnmount(){
    clearInterval(this.timer);
  }

  onSave = () => {
    console.log(333333333,this.props.selectKey);
    this.props.dispatch({
      type: 'batch/pay',
      payload: {
        fundBatchOrderId: this.props.selectKey.id,
        returnUrl: encodeURI(`${window.location.href}/_aliPayConfirms`)
      },
     }).then(()=>{
      this.close();
      Modal.confirm({
        title: '是否已完成支付',
        cancelText: '未完成',
        okText: '已完成',
        onOk: () => {
          this.props.onOk();
        }
      });
    });
  };


  close = () => {
    this.setState({visible:false});
    clearInterval(this.timer);
  }

  onShow = () => {
    this.props.dispatch({
      type: 'global/getServiceTime',
      payload:{}
    }).then(()=>{
      this.timer = setInterval(() => {
        this.loadTime();
      },1000);
      this.setState({visible:true});
    });
  }

  loadTime = () => {
    const time = this.props.selectKey.timeExpire;
    const nowTime = this.props.serviceTime || new Date().getTime();
    const hour =  Math.floor((time - nowTime)/(60*60*1000));
    const minute =  Math.floor((time - nowTime)%(60*60*1000)/(60*1000));
    this.setState({tiemStr:`${ hour<0?0:hour }小时${ minute<0?0:minute }分钟`});
  }

  render(){
    return (
      <div style={{display:'inline-block'}}>
        <span onClick={() => this.onShow()} >{this.props.children}</span>
        <ModalTemp
          title="确认支付"
          footer={[
            <Button key="save" onClick={() => this.onSave()} loading={this.props.loading} disabled={this.props.loading} type="primary">去支付</Button>
          ]}
          visible={this.state.visible}
          onCancel={this.close}
          size="small"
          newBodyStyle={{
            height: '450px',
            padding: '16px 32px 0px'
          }}
        >
          <div className={style.confirm}>
            <div className={style.content}>
              <div className={style.alert}>
                <i className="iconfont iconinfo-cirlce fs-20 sub-color m-r-8 m-l-16" style={{marginTop: '-4px'}} />
                <span className="c-black-65">
                  剩余支付时间：
                  <span style={{color: '#F25643'}}>{this.state.tiemStr}</span>
                  ，超时未支付批次将自动关闭
                </span>
              </div>
              <div className="m-l-32 m-t-18 m-b-47">
                <p className="c-black-65 m-b-24">付款批次：{ this.props.selectKey.batchTransId }</p>
                <p className="c-black-65 m-b-24">单据条数：{ this.props.selectKey.totalCount }</p>
                <p className="c-black-65 m-b-24">金额共计：
                  <span className="c-black-85 fs-20" style={{fontWeight: 'bold'}}>¥{this.props.selectKey.totalTransAmount/100}</span>
                  {
                    this.props.selectKey && this.props.selectKey.commission > 0 &&
                    <span>，手续费{this.props.selectKey.commission/100}元</span>
                  }
                </p>
                <p className="c-black-65 m-b-24">支付状态：<span style={{color: 'rgba(255, 204, 12, 1)'}}>待支付</span></p>
              </div>
            </div>
          </div>
        </ModalTemp>
      </div>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     signDetails: state.global.signDetails,
//   };
// };

// export default connect(mapStateToProps)(ComfirmPay);
export default ComfirmPay;
