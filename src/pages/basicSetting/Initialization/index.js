
import React, { useEffect } from 'react';
import { Tooltip, Button, message, Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHead from '@/components/PageHead';
import Lines from '../../../components/StyleCom/Lines';


function Controller(props) {

  const { dispatch, userInfo, removeDataTime } = props;

  useEffect(() => {
    dispatch({
      type: 'controller/getTime',
      payload: {
        companyId: userInfo.companyId,
      }
    });
    dispatch({
      type: 'controller/queryUsers',
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

  const clearsModal = () => {
    Modal.confirm({
      title: '一键清空',
      content: '清空数据后不可撤销',
      onOk(){
        clears();
      }
    });
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
      <PageHead title="数据初始化" />
      <div className="content-dt">
        <Lines name="单据清空">
          <Tooltip title="清空所有单据，费用类别、单据等基础设置不变">
            <i className="iconfont iconIcon-yuangongshouce fs-14 c-black-45 m-l-8" />
          </Tooltip>
          <span className="fs-14 c-black-45 fw-400">（清空数据后不可撤销，请谨慎操作）</span>
        </Lines>
        <Button className="m-t-13 m-b-17" onClick={clearsModal}>一键清空</Button>
        <p className="fs-14 c-black-45 p-b-15">上次时间：{removeDataTime ? moment(Number(removeDataTime)).format('YYYY-MM-DD hh:mm:ss') : '无'}</p>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    removeDataTime: state.controller.removeDataTime,
    userInfo: state.session.userInfo,
    synCompanyTime: state.controller.synCompanyTime,
    queryUsers: state.controller.queryUsers,
    modifyGrant: state.controller.modifyGrant,
  };
};
export default connect(mapStateToProps)(Controller);

