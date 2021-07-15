import React from 'react';
import cs from 'classnames';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
// import constants from '@/utils/constants';
import { Button } from 'antd';
import Avatar from '../../../components/AntdComp/Avatar';
import style from './index.scss';
import CostFolder from '../../../components/Modals/AddInvoice/InvoiceTable/CostFolder';
import Draft from '../../../components/Modals/AddInvoice/InvoiceTable/Draft';
import LoanTable from '../../../components/Modals/AddInvoice/InvoiceTable/LoanTable';
import AddCost from '../../../components/Modals/AddInvoice/AddCost';
import SelectInvoice from '../../../components/Modals/SelectInvoice';

function Header(props) {
  const {
    personal,
    isBoss,
  } = props;

  return (
    <div className={isBoss ? cs(style.header, style.bossHeader) : style.header}>
      <section className={style['wave-container']} style={{background: '#F6F9FB'}}>
        <svg id="svg-area">
          <path />
          <path />
          <path />
        </svg>
      </section>
      <div className={style.headerLeft}>
        <Avatar avatar={props.userInfo && props.userInfo.avatar} name={props.userInfo && props.userInfo.name} size={72} />
        <p className="m-l-24">
          <p className="c-black-85 fs-20 fw-600 li-28 m-b-12">你好，{props.userInfo && props.userInfo.name}！</p>
          <p className="c-black-85 fs-14 li-22">WELCOME 欢迎使用鑫支出</p>
        </p>
      </div>
      <div className={style.headerRight}>
        <LoanTable>
          <div className={cs(style.headTag, style.hdLoan)}>
            <p>
              <i className={cs(style.loan, 'iconfont', 'icondaihuankuan')} />
              <span className="c-black-45 fs-14 m-l-4">
                待还款 <span className={style.loan}>{personal.loanCount ? personal.loanCount : 0}</span>单
              </span>
            </p>
            {
              !isBoss &&
              <p className="c-black-85 fs-30 fw-400">¥{personal.loanSum ? personal.loanSum/100 : 0}</p>
            }
          </div>
        </LoanTable>
        <i className={style.lines} />
        <CostFolder onPerson={() => props.onOk()}>
          <div className={cs(style.headTag, style.hdLoan)}>
            <p>
              <i className={cs(style.cost, 'iconfont', 'iconfeiyongjia')} />
              <span className="c-black-45 fs-14 m-l-4">
                账本 <span className="c-black-85 fs-14">{personal.folderCount ? personal.folderCount : 0}</span>笔
              </span>
            </p>
            {
              !isBoss &&
              <p className="c-black-85 fs-30 fw-400">¥{personal.folderSum ? personal.folderSum/100 : 0}</p>
            }
          </div>
        </CostFolder>
        <i className={style.lines} />
        <Draft onPerson={() => props.onOk()}>
          <div className={cs(style.headTag, style.hdLoan)}>
            <p>
              <i className={cs(style.caogao, 'iconfont', 'iconcaogaoxiang')} />
              <span className="c-black-45 fs-14 m-l-4">
                草稿箱&nbsp;
                {
                  isBoss ?
                    <><span className={style.loan}>{personal.draftCount ? personal.draftCount : 0}</span>笔</>
                    :
                    null
                }
              </span>
            </p>
            {
              !isBoss &&
              <p className="c-black-85 fs-30 fw-400">
                {personal.draftCount ? personal.draftCount : 0}
                <span className="fs-14 c-black-45 m-l-4">单</span>
              </p>
            }
          </div>
        </Draft>
      </div>
      {
        isBoss &&
        <div className={style.btns}>
          <SelectInvoice onOk={props.onOk} onCallback={() => props.onOk()}>
            <Button type="primary" className="m-r-8" style={{width: '140px', height: '40px'}}>
              <i className="iconfont iconPCxinzengdanju fs-20" style={{ verticalAlign: 'middle' }} />
              <span className="m-l-8 fs-16 m-r-10" style={{ verticalAlign: 'middle' }}>提单据</span>
            </Button>
          </SelectInvoice>
          <AddCost costType={1} onCallback={() => props.onOk()} againCost>
            <Button type="primary" ghost style={{width: '140px', height: '40px', verticalAlign: 'center'}}>
              <i className="iconfont iconjiyibi fs-20 sub-color" style={{ verticalAlign: 'middle' }} />
              <span className="m-l-4 sub-color fs-16 m-r-10" style={{ verticalAlign: 'middle' }}>记一笔</span>
            </Button>
          </AddCost>
        </div>
      }
    </div>
  );
}

// Header.propTypes = {
//   datas: PropTypes.object,
// };

const mapStateToProps = (state) => {
  return {
    userInfo: state.session.userInfo,
  };
};

export default connect(mapStateToProps)(Header);

