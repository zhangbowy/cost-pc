import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { GetRequest } from '../../utils/common';
import { ddOpenLink } from '../../utils/ddApi';

@connect(({ global }) => ({
  msnUrl: global.msnUrl,
}))
class Transform extends PureComponent {

  componentDidMount(){
    console.log(window.location.href);
    const url = window.location.href;
    const obj = GetRequest(url);
    this.props.dispatch({
      type: 'global/qrQuery',
      payload: {
        companyId: obj.companyId,
        templateType: obj.templateType,
        invoiceId: obj.invoiceId
      }
    }).then(() => {
      // window.opener=null;
      // window.location.href='dingtalk://dingtalkclient/action/open_micro_app?appId=47108&corpId=ding9ff7224e8d6698b335c2f4657eb6378f&ddAgentId=782605167&ddAppId=47108&ddAppType=org&page=pages%2Finvoice%2FinvoiceDetail%2FinvoiceDetail%3FoaMsg%3D1%26id%3D548175569989144576';
      ddOpenLink(this.props.msnUrl);
      // window.close();
      // console.log(this.props.msnUrl);
    });
  }

  render() {
    return (
      <div />
    );
  }
}
export default Transform;
