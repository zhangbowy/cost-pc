import React, { useState, useEffect } from 'react';
import { Card,Tag,Icon,Tooltip} from 'antd';
import styles from './index.scss';
import EditPayAccount from '@/pages/basicSetting/payAccount/components/AddModal.js';
import EditReceiptAccount from '@/pages/basicSetting/receiptAccount/components/AddModal.js';


export default function Account(props) {
    const {item,delCart,signChange,onOk,personal} = props;
    const {id, awAreas, type, bankName, name, isDefault, status, account, bankNameBranch, note,signStatus } = item;

    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
      const handleWindowResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleWindowResize);
      return () => window.removeEventListener('resize', handleWindowResize);
    }, []);
   // 账户类型
    const accountType = (aType) => {
      const theType = {
      0:'银行卡',
      1: '支付宝',
      2: '现金',
      3: '微信',
      4: '其他账户类型'
    };
    return theType[aType];
  };
    // 账户图标
  const accountIcon = (aType) => {
    // 已停用时灰度显示
    const tColor = 'rgba(0, 0, 0, 0.25)';
    const icon = {
      // 银行卡
      0: <i className="iconfont iconyinhangka1 m-t-4" style={{ color: status === 0 ? tColor : 'rgba(255, 146, 0, 1)' }} />,
      // 支付宝
      1: <i className="iconfont iconzhifubao1" style={{ color: status === 0 ? tColor : 'rgba(3, 122, 254, 1)' }} />,
      // 现金
      2: <i className="iconfont iconxianjin1 m-t-4" style={{ color: status === 0 ? tColor : 'rgba(255, 185, 0, 1)' }} />,
      // 微信
      3: <i className="iconfont iconweixin1 m-t-4" style={{ color: status === 0 ? tColor : 'rgba(10, 206, 102, 1)' }} />,
      // 其他账户类型
      4: <i className="iconfont iconqitabeifen m-t-4" style={{ color: status===0?tColor:'rgba(0, 0, 0, 0.16)' }} />,
    };
    return icon[aType];
  };
    // 内容为空时，横杠代替
    const empty = () => {
     return <Icon type="minus" className={styles.minus} style={{marginLeft:'10px'}} />;
    };
    // 开户省市
    const accountCity = () => {
        if (awAreas.length) {
            if (awAreas[0].areaName === awAreas[1].areaName) {
                return awAreas[0].areaName;
            }
                return `${awAreas[0].areaName}${awAreas[1].areaName}`;
            }
        return null;
    };
    // 删除账户
    const del = (theId) => {
        delCart(theId);
  };
    // 签约
    const sign = (theAccount) => {
      signChange(theAccount);
    };
    return (
      <Card style={{ width: width > 1280 ? '390px' : '336px',height:'220px',backgroundColor:'#fff',margin:'16px 16px 0 0'}} className={styles.cardContent} bordered={false}>
        {/* 账户类型 */}
        <div className={styles.accountType}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {/* 账户图标 */}
            {accountIcon(type)}
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(0, 0, 0, 0.65)' }}>{accountType(type)||bankName}</span>
          </span>
          <span className={styles.caozuo}>
            <i className="iconfont icona-caozuo3x"/>
            <dl className={styles.content}>
              <dt>
                {/* 收付款编辑 */}
                {personal!=null?<EditReceiptAccount title="edit" record={item} onOk={() => onOk()}>编辑</EditReceiptAccount>:<EditPayAccount title="edit" record={item} onOk={() => onOk()}>编辑</EditPayAccount>}
              </dt>         
              {((!signStatus&&signStatus!=null&&type===1)||!personal&&personal!=null)?<dt onClick={()=>sign(account)}>签约</dt>:null}         
              <dt onClick={() => del(id)}>删除</dt>
            </dl>     
          </span>
        </div>
        {/* 名称 */}
        <div style={{ display: 'flex',  margin: '15px 0', lineHeight: '24px' }}>
          <Tooltip placement="topLeft" title={name}><span className={styles.name}>{name}</span></Tooltip>
          {/* 是否默认/已停用/已签约 */}
          {isDefault ? <Tag color="blue">默认</Tag> : null}
          {signStatus===0&&type===1?<Tag color="#f0f0f0">未签约</Tag>:null}
          {signStatus === 2&&type===1 ? <Tag color="cyan">已签约</Tag> : null}
          {!status ? <Tag color="red">已停用</Tag> : null}
        </div>
        {/* 卡号/账号 */}
        <div>
          <i className="iconfont iconzhanghao c-black-016" />
          {type===2||type===4?empty():<span className={styles.account}>{account}</span>}
        </div>
        {/* 开户行/支行 */}
        <div style={{ margin:'10px 0'}}>
          <i className="iconfont iconkaihushengshi c-black-016" />
          {type===0?
            <span className={styles.bankNameBranch}>{accountCity()}<i style={{ color: 'rgba(216, 216, 216, 1)' }}><Icon type="line" /></i> {bankNameBranch}</span>
            : empty()}
        </div>
        {/* 备注 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <i className="iconfont iconbeizhu c-black-016" />
          {note?<Tooltip placement="topLeft" title={note}><span className={styles.note}>{note}</span></Tooltip>:empty()}
        </div>
      </Card>
    );
}

