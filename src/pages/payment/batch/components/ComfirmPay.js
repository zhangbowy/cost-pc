import React from 'react';
import { Modal, Button, Alert } from 'antd';
import style from './index.scss';

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
        returnUrl: '/batch'
      },
     }).then(()=>{
      this.close();
    });
  };


  close = () => {
    this.setState({visible:false});
    clearInterval(this.timer);
  }

  onShow = () => {
    this.timer = setInterval(() => {
      this.loadTime();
    },1000);
    console.log(this.props.selectKey);
    this.setState({visible:true});
  }

  loadTime = () => {
    const time = this.props.selectKey.createTime+24*60*60*1000;
    const nowTime = new Date().getTime();
    const hour =  Math.floor((time - nowTime)/(60*60*1000));
    const minute =  Math.floor((time - nowTime)%(60*60*1000)/(60*1000));
    this.setState({tiemStr:`${hour  }小时${  minute  }分钟，`});
  }

  render(){
    return (
      <div style={{display:'inline-block'}}>
        <span onClick={() => this.onShow()} >{this.props.children}</span>
        <Modal
          title={null}
          footer={null}
          visible={this.state.visible}
          onCancel={this.close}
          width="680px"
        >
          <h1>确认支付</h1>
          <div className={style.confirm}>
            <Alert
              type="success"
              message={(
                <span className="c-black-65">
                  剩余支付时间：
                  <span className="c-black-85" style={{color: '#F25643'}}>{this.state.tiemStr}</span>
                  超时未支付批次将自动关闭
                </span>
              )}
              icon={(
                <i className="iconfont iconIcon-yuangongshouce fs-14 sub-color m-l-8" />
              )}
            />
            <span className="c-black-65 m-b-24 m-t-24">付款批次：{ this.props.selectKey.batchTransId }</span>
            <span className="c-black-65 m-b-24">单据条数：{ this.props.selectKey.totalCount }</span>
            <span className="c-black-65 m-b-24">金额共计：{ this.props.selectKey.totalTransAmount/100 }</span>
            <span className="c-black-65 m-b-24">支付状态：<span style={{color: 'rgba(255, 204, 12, 1)'}}>待支付</span></span>
            <Button key="save" onClick={() => this.onSave()}>去支付</Button>
          </div>
        </Modal>
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
