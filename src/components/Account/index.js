import React from 'react';
import { Card,Tag,Icon,Tooltip} from 'antd';
import styles from './index.scss';
import AddAccount from '@/pages/basicSetting/payAccount/components/AddModal.js';


export default function index(props) {
    const {item,delCart,signChange,onOk,personal} = props;
    const {id, awAreas, type, bankName, name, isDefault, status, account, bankNameBranch, note,signStatus } = item;
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
    const icon = {
      0: <i className="iconfont iconyinhangka1 m-t-4" style={{ color: 'rgba(255, 146, 0, 1)' }} />,
      1: <i className="iconfont iconzhifubao1 m-t-4" style={{ color: 'rgba(3, 122, 254, 1)' }} />,
      2: <i className="iconfont iconxianjin1 m-t-4" style={{ color: 'rgba(255, 185, 0, 1)' }} />,
      3: <i className="iconfont iconweixin1 m-t-4" style={{ color: 'rgba(10, 206, 102, 1)' }} />,
      4: <i className="iconfont iconqitabeifen m-t-4" style={{ color: 'rgba(0, 0, 0, 0.16)' }} />,
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
      <Card style={{ width:'390px',height:'220px',backgroundColor:'#fff',margin:'16px 16px 0 0'}} className={styles.cardContent} bordered={false}>
        {/* 账户类型 */}
        <div className={styles.accountType}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {/* 账户图标 */}
            {accountIcon(type)}
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(0, 0, 0, 0.65)' }}>{accountType(type)||bankName}</span>
          </span>
          <span className={styles.caozuo}>
            <i className="iconfont icona-caozuo3x" />
            <dl className={styles.content}>
              <dt><AddAccount title="edit" record={item} onOk={() =>onOk()}>编辑</AddAccount></dt>         
              <dt onClick={() => del(id)}>删除</dt>
              {((!signStatus&&signStatus!=null&&type===1)||!personal&&personal!=null)?<dt onClick={()=>sign(account)}>签约</dt>:null}         
            </dl>     
          </span>
        </div>
        {/* 名称 */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0', lineHeight: '24px' }}>
          <Tooltip placement="topLeft" title={name}><span className={styles.name}>{name}</span></Tooltip>
          {/* 是否默认/已停用 */}
          {(isDefault?<Tag color="blue">默认</Tag>:null)||(!status?<Tag color="red">已停用</Tag>:null)}
        </div>
        {/* 卡号/账号 */}
        <div>
          <i className="iconfont iconzhanghao c-black-016" />
          {type===2||type===4?empty():<span className={styles.account}>{account}</span>}
        </div>
        {/* 开户行/支行 */}
        <div style={{ margin:'10px 0'}}>
          <i className="iconfont iconkaihushengshi c-black-016" />
          {bankName ?
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

