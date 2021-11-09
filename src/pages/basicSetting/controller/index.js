/* eslint-disable react/jsx-no-bind */

import React, { useEffect, useState } from 'react';
import { Tooltip, Button, message, Modal, Divider,Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { choosePeople } from '../../../utils/ddApi';
import Lines from '../../../components/StyleCom/Lines';
import style from './index.scss';
import Avatar from '../../../components/AntdComp/Avatar';


function Controller(props) {

  const { Option } = Select;
  const { dispatch, userInfo, removeDataTime, synCompanyTime,queryUsers } = props;
  const [ visible, setVisible ] = useState(false);
  const [ users, setUsers ] = useState([]);
  const [ rawUser, setRawUser ] = useState();
  const [ isOpen, setIsOpen ] = useState(false);
  const [ userIdExpired, setUserIdExpired ] = useState();

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

  function onChange(value) {
    setUserIdExpired(value);
  }

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
    setVisible(true);
  };

  const handleCancel = () => {
    setUsers([]);
    setRawUser('');
    setUserIdExpired('');
    setVisible(false);
  };

  const handleOk = () => {
    if(!userIdExpired){
      message.error('请选择原发放人');
      return;
    }
    if(!users.length){
      message.error('请选择交接发放人');
      return;
    }
    dispatch({
      type: 'controller/modifyGrant',
      payload: {
        userIdExpired,
        userVO:{
          userId: users[0].emplId,
          name: users[0].name
        }
      },
      callback: (res) => {
        if(res.success){
          message.success(res.message);
          handleCancel();
        }else{
          message.error(res.message);
        }
      }
    });
  };

  const getUsers = () => {
    if(!queryUsers){
      return '';
    }
    return queryUsers.map( item => {
      return (
        <Option value={item.id} key={item.id} >
          <Avatar avatar={item.avatar} name={item.name}  />{` ${item.name}`}
        </Option>
      );
    });
  };

  const getOption = () => {
    if(!users){
      return <Option />;
    }
    return users.map( item => {
      return (
        <Option value={item.emplId} key={item.emplId} >
          <Avatar avatar={item.avatar} name={item.name}  />{` ${item.name}`}
        </Option>
      );
    });
  };


  const setUser = (e) => {
    if (e && e.length > 0) {
      const user = e.map(it => { return {...it, userId: it.emplId}; });
      setUsers(user);
      setRawUser(e[0].emplId);
    }
  };

  const selectPeople = () => {
    setIsOpen(true);
    choosePeople([],setUser,{multiple:false});
    setIsOpen(false);
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
        <p className="c-black-45 fs-14" style={{marginBottom: 0}}>你可以在此进行单据清空的设置</p>
      </div>
      <div className="content-dt">
        <Lines name="单据清空">
          <Tooltip title="清空所有单据，支出类别、单据等基础设置不变">
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
        <Lines name="离职交接" />
        <Button className="m-t-13 m-b-17" onClick={changePeople}>修改发放人</Button>
        <p>发放人员离职时可修改已提交单据的发放人</p>
      </div>
      <Modal
        title="修改发放人"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className={style.formItem}>
          <label>原发放人：</label>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="请选择"
            optionFilterProp="children"
            size='large'
            value={userIdExpired}
            onChange={onChange}
          >
            { getUsers() }
          </Select>
        </div>
        <div className={style.formItem}>
          <label>交接发放人：</label>
          <div style={{display:'inline-block'}} onClick={selectPeople} >
            <Select
              style={{ width: 200 }}
              placeholder="请选择"
              optionFilterProp="children"
              size='large'
              value={rawUser}
              open={isOpen}
            >
              { getOption() }
            </Select>
          </div>
        </div>
      </Modal>
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

