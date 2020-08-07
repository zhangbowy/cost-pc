
import React, { useEffect } from 'react';
import { Tooltip, Button, message, Modal, Divider } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Lines from '../../../components/StyleCom/Lines';
import style from './index.scss';

function Controller(props) {

  const { dispatch, userInfo, removeDataTime, synCompanyTime } = props;
  useEffect(() => {
    dispatch({
      type: 'controller/getTime',
      payload: {
        companyId: userInfo.companyId,
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clears = () => {
    dispatch({
      type: 'controller/del',
      payload: {
        companyId: userInfo.companyId,
      }
    }).then(() => {
      message.success('清空数据成功');
    });
  };

  const clearCompany = () => {
    // delCompany
    dispatch({
      type: 'controller/delCompany',
      payload: {
        companyId: userInfo.companyId,
      }
    }).then(() => {
      message.success('数据同步中请稍后查看人数');
    });
  };

  const clearsModal = () => {
    Modal.confirm({
      title: '一键清空',
      content: '清空数据后不可撤销',
      onOk(){
        clears();
      }
    });
  };

  const changePeople = () => {

  };

  // const synCompany = () => {
  //   Modal.confirm({
  //     title: '人员同步',
  //     content: '清空数据后不可撤销',
  //     onOk(){
  //       clearCompany();
  //     }
  //   });
  // };

  return (
    <div>
      <div className={style.app_header}>
        <p className="c-black-85 fs-20 fw-600 m-b-8">控制中心</p>
        <p className="c-black-45 fs-14" style={{marginBottom: 0}}>您可以在此进行单据清空的设置</p>
      </div>
      <div className="content-dt">
        <Lines name="单据清空">
          <Tooltip title="清空所有单据，费用类别、单据等基础设置不变">
            <i className="iconfont iconIcon-yuangongshouce fs-14 c-black-45 m-l-8" />
          </Tooltip>
          <span className="fs-14 c-black-45 fw-400">（清空数据后不可撤销，请谨慎操作）</span>
        </Lines>
        <Button className="m-t-13 m-b-17" onClick={clearsModal}>一键清空</Button>
        <p className="fs-14 c-black-45 p-b-15">上次时间：{removeDataTime ? moment(Number(removeDataTime)).format('YYYY-MM-DD hh:mm:ss') : '无'}</p>
        <Divider type="horizontal" />
        <Lines name="人员同步">
          <Tooltip title="同步时间可能会较长，请稍后刷新页面查看同步结果">
            <i className="iconfont iconIcon-yuangongshouce fs-14 c-black-45 m-l-8" />
          </Tooltip>
        </Lines>
        <Button className="m-t-13 m-b-17" onClick={clearCompany}>同步钉钉通讯录</Button>
        <p className="fs-14 c-black-45 p-b-15">上次时间：{synCompanyTime ? moment(Number(synCompanyTime)).format('YYYY-MM-DD hh:mm:ss') : '无'}</p>
        <Divider type="horizontal" />
        <Lines name="修改发放人">
          <Tooltip title="发放人员离职时可修改已提交单据的发放人">
            <i className="iconfont iconIcon-yuangongshouce fs-14 c-black-45 m-l-8" />
          </Tooltip>
          <span className="fs-14 c-black-45 fw-400">（发放人员离职时可修改已提交单据的发放人）</span>
        </Lines>
        <Button className="m-t-13 m-b-17" onClick={changePeople}>修改发放人</Button>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    removeDataTime: state.controller.removeDataTime,
    userInfo: state.session.userInfo,
    synCompanyTime: state.controller.synCompanyTime
  };
};
export default connect(mapStateToProps)(Controller);

