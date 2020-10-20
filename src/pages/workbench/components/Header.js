import React from 'react';
import cs from 'classnames';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
import constants from '@/utils/constants';
import Avatar from '../../../components/AntdComp/Avatar';
import style from './index.scss';

function Header(props) {
  const { APP_VER } = constants;
  const { personal } = props;
  return (
    <div className={style.header}>
      <section className={style['wave-container']} style={{background: '#F6F9FB'}}>
        <svg id="svg-area">
          <path />
          <path />
          <path />
        </svg>
      </section>
      <div className={style.headerLeft}>
        <Avatar avatar={props.userInfo && props.userInfo.avatar} name="谈薇" size={72} />
        <p className="m-l-24">
          <p className="c-black-85 fs-20 fw-600 li-28 m-b-12">你好，{props.userInfo && props.userInfo.name}！</p>
          <p className="c-black-85 fs-14 li-22">WELCOME 欢迎使用鑫支出V{APP_VER}版本</p>
        </p>
      </div>
      <div className={style.headerRight}>
        <div className={cs(style.headTag, style.hdLoan)}>
          <p>
            <i className={cs(style.loan, 'iconfont', 'icondaihuankuan')} />
            <span className="c-black-45 fs-14 m-l-4">
              待还款<span className={style.loan}>{personal.loanCount || 0}</span>单
            </span>
          </p>
          <p className="c-black-85 fs-30 fw-400">¥{props.loanSum || 0}</p>
        </div>
        <i className={style.lines} />
        <div className={cs(style.headTag, style.hdLoan)}>
          <p>
            <i className={cs(style.cost, 'iconfont', 'iconfeiyongjia')} />
            <span className="c-black-45 fs-14 m-l-4">
              费用夹<span className="c-black-85 fs-14">{props.folderCount || 0}</span>笔
            </span>
          </p>
          <p className="c-black-85 fs-30 fw-400">¥{props.folderSum || 0}</p>
        </div>
        <i className={style.lines} />
        <div className={cs(style.headTag, style.hdLoan)}>
          <p>
            <i className={cs(style.caogao, 'iconfont', 'iconcaogaoxiang')} />
            <span className="c-black-45 fs-14 m-l-4">
              草稿箱
            </span>
          </p>
          <p className="c-black-85 fs-30 fw-400">
            {props.draftCount || 0}
            <span className="fs-14 c-black-45 m-l-4">笔</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// Header.propTypes = {
//   datas: PropTypes.object,
// };

const mapStateToProps = (state) => {
  return {
    userInfo: state.session.userInfo,
    personal: state.workbench.personal,
  };
};

export default connect(mapStateToProps)(Header);

