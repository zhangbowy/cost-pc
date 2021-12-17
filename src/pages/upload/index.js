import dd from 'dingtalk-jsapi';
import React, { Component } from 'react';
import UploadFileMini from '../../components/UploadFileMini';

class upload extends Component {

  componentDidMount(){
    if (dd.env.platform === 'android' || dd.env.platform === 'ios') {
      const el = document.createElement('script');
      el.onload = () => {
        if (window.dd) {
          window.dd.postMessage({ type: 'init' });
          window.dd.onMessage = e => {
            const { type, content } = e;
            const obj = { type, content };
            console.log(obj);
          };
        }
      };
      el.src = 'https://appx/web-view.min.js';
      document.body.prepend(el);
    }
  }

 render() {
   return (
     <div>
       <UploadFileMini />
     </div>
   );
 }
}

export default upload;
