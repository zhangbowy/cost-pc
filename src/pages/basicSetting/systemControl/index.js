import React, { useState } from 'react';
import PageHead from '@/components/PageHead';
import { Switch, Modal, Checkbox } from 'antd';
import style from './index.scss';
// import PropTypes from 'prop-types';

const { confirm } = Modal;
function SystemControl() {
  const [switchCheck, setSwitchCheck] = useState(false);
  const onChange = checked => {
    if (checked) {
      confirm({
        title: '改单是否留痕',
        content: (
          <Checkbox>开启留痕，在发放环节修改的所有信息，均可追溯查看</Checkbox>
        ),
        okText: '保存',
        onOk: () => {
          setSwitchCheck(true);
        }
      });
    } else {
      setSwitchCheck(false);
    }
  };
  return (
    <div>
      <PageHead title="控制开关" />
      <div className={style.content}>
        <Switch className={style.switch} onChange={e => onChange(e)} checked={switchCheck} />
        <p className="fs-16 c-black-85 fw-500">允许发放环节改单</p>
        <p className={style.production}>
          <span>开启后，在单据发放环节，发放人可对单据的部分信息进行修改后发放，无需重新打回。比如费用类别、金额等，如需支持更多信息的修改，请至</span>
          <span className="sub-color">单据模版设置/费用类别设置</span>
          <span>，编辑页面操作</span>
        </p>
        <div className={style.label}>
          <div className={style.lables}>
            <span className={style.circle} />
            <span>已关闭</span>
          </div>
          <div className={style.lables}>
            <span className={style.circle} />
            <span>已关闭留痕</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// index.propTypes = {

// };

export default SystemControl;
