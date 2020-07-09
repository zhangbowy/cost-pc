
import React from 'react';
import { Tooltip, Button, Divider } from 'antd';
import Lines from '../../../components/StyleCom/Lines';
import style from './index.scss';


function Controller() {
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
        <Button className="m-t-13 m-b-17">一键清空</Button>
        <p className="fs-14 c-black-45 p-b-15">上次时间：2020-06-22</p>
        <Divider type="horizontal" />
        <Lines name="人员同步">
          <Tooltip title="同步时间可能会较长，请稍后刷新页面查看同步结果">
            <i className="iconfont iconIcon-yuangongshouce fs-14 c-black-45 m-l-8" />
          </Tooltip>
        </Lines>
        <Button className="m-t-13 m-b-17">同步钉钉通讯录</Button>
        <p className="fs-14 c-black-45 p-b-15">上次时间：2020-06-22</p>
      </div>
    </div>
  );
}

export default Controller;

