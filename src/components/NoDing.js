import React from 'react';
import PropTypes from 'prop-types';
import group from '@/assets/img/group.jpg';
import { Divider } from 'antd';

const config = {
  403: '尊敬的用户！ 您当前暂无鑫支出的管理权限',
  500: '无法进入鑫支出',
};

const download = () => {
  window.location.href='https://page.dingtalk.com/wow/dingtalk/act/download';
};

const NoDing = ({ type }) => (
  <div style={{margin: '64px 0 0 50px'}}>
    <p className="c-black-85 fs-28 fw-600 m-b-17">{config[type]}</p>
    {
      type === '500' &&
      <p>请下载安装【钉钉PC客户端】后访问，<span onClick={() => download()} className="use_a">去下载&gt;</span></p>
    }
    {
      type === '403' &&
      <p className="c-black-85 fs-14">请联系以下任意一位管理员给您添加权限：张小三/李小四/王小五</p>
    }
    <Divider type="horizontal" />
    {
      type === '500' &&
      <img src={group} alt="钉钉" style={{width: '685px'}} />
    }
  </div>
);

NoDing.propTypes = {
  type: PropTypes.string.isRequired,
};

export default NoDing;
