import React, { useState, useEffect } from 'react';
import cs from 'classnames';
import PageHead from '@/components/PageHead';
import { Switch, Modal, Checkbox } from 'antd';
import { connect } from 'dva';
import style from './index.scss';
// import PropTypes from 'prop-types';

const { confirm } = Modal;
function SystemControl(props) {
  const { isModifyInvoice, isModifyReload, dispatch } = props;
  const [switchCheck, setSwitchCheck] = useState(false);
  const [changeReload, setChangeReload] = useState(false);
  useEffect(() => {
    dispatch({
      type: 'systemControl/query',
      payload: {},
    }).then(() => {
      setSwitchCheck(isModifyInvoice);
      setChangeReload(isModifyReload);
    });
  }, []);

  const onQuery = (options, callback) => {
    dispatch({
      type: 'systemControl/change',
      payload: {
        ...options,
      }
    }).then(() => {
      callback && callback();
    });
  };

  const onChangeHis = e => {
    setChangeReload(e.target.checked);
  };

  const onChange = checked => {
    onQuery({
      isModifyInvoice: checked,
      isModifyReload: changeReload,
    }, () => {
      setSwitchCheck(checked);
      if (checked) {
        confirm({
          title: '改单是否留痕',
          content: (
            <Checkbox
              value={changeReload}
              onChange={e => onChangeHis(e)}
            >
              开启留痕，在发放环节修改的所有信息，均可追溯查看
            </Checkbox>
          ),
          okText: '保存',
          onOk: () => {
            onQuery({
              isModifyInvoice: switchCheck,
              isModifyReload: changeReload,
            });
          }
        });
      }
    });
  };

  return (
    <div>
      <PageHead title="控制开关" />
      <div className={style.content}>
        <Switch className={style.switch} onChange={e => onChange(e)} checked={switchCheck} />
        <p className="fs-16 c-black-85 fw-500">允许发放环节改单</p>
        <p className={style.production}>
          <span>开启后，在单据发放环节，发放人可对单据的部分信息进行修改后发放，无需重新打回。比如费用类别、金额等，如需支持更多信息的修改，请至</span>
          <span className="sub-color">
            <a>单据模版设置</a>/<a>费用类别设置</a>
          </span>
          <span>，编辑页面操作</span>
        </p>
        <div className={style.label}>
          <div className={style.lables}>
            <span className={switchCheck ? cs(style.circle, style.active) : style.circle} />
            <span>{ switchCheck ? '已开启' : '已关闭' }</span>
          </div>
          <div className={style.lables}>
            <span className={changeReload ? cs(style.circle, style.active) : style.circle} />
            <span>{ changeReload ? '已开启留痕' : '已关闭留痕' }</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// index.propTypes = {

// };
const mapStateToProps = (state) => {
  return {
    isModifyInvoice: state.systemControl.isModifyInvoice,
    isModifyReload: state.systemControl.isModifyReload,
  };
};

export default connect(mapStateToProps)(SystemControl);
