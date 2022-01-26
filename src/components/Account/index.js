import React from 'react';
import { Card,Tag,Icon} from 'antd';
import styles from './index.scss';

export default function index(props) {
    const { item } = props;
    // 账户类型
  const accountType = (type) => {
    const theType = {
      1: '支付宝',
      2: '现金',
      3: '微信',
      4: '其他账户类型'
    };
    return theType[type];
  };
    // 账户图标
  const accountIcon = (type) => {
    const icon = {
      0: <i className="iconfont iconyinhangka1 m-t-4 bank" style={{ color: 'rgba(255, 146, 0, 1)' }} />,
      1: <i className="iconfont iconzhifubao1 m-t-4 alipay" style={{ color: 'rgba(3, 122, 254, 1)' }} />,
      2: <i className="iconfont iconxianjin1 m-t-4 money" style={{ color: 'rgba(255, 185, 0, 1)' }} />,
      3: <i className="iconfont iconweixin1 m-t-4 wechat" style={{ color: 'rgba(10, 206, 102, 1)' }} />,
      4: <i className="iconfont iconqitabeifen m-t-4 other" style={{ color: 'rgba(0, 0, 0, 0.16)' }} />,
    };
    return icon[type];
  };
    // 内容为空时，横杠代替
    const empty = () => {
     return <Icon type="minus" className={styles.minus} style={{marginLeft:'10px'}} />;
    };
    return (
      <Card style={{ width:'390px',height:'220px',backgroundColor:'#fff',margin:'16px 16px 0 0'}} className={styles.cardContent} bordered={false}>
        {/* 账户类型 */}
        <div className={styles.accountType}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {/* 账户图标 */}
            {accountIcon(item.type)}
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(0, 0, 0, 0.65)' }}>{item.bankName||accountType(item.type)}</span>
          </span>
          <span style={{color:'rgba(0, 0, 0, 0.65)'}}><i className="iconfont icona-caozuo3x"/></span>
        </div>
        {/* 名称 */}
        <div style={{ display: 'flex', alignItems: 'center',margin:'15px 0',lineHeight:'24px' }}>
          <span className={styles.name}>{item.name}</span>
          {/* 是否默认/已停用 */}
          {item.isDefault?<Tag color="blue">默认</Tag>:null}
          {/* <Tag color="red">已停用</Tag> */}
        </div>
        {/* 卡号/账号 */}
        <div>
          <i className="iconfont iconzhanghao c-black-016" />
          {item.type===2||item.type===4?empty():<span className={styles.account}>{item.account}</span>}
        </div>
        {/* 开户行/支行 */}
        <div style={{ margin:'10px 0'}}>
          <i className="iconfont iconkaihushengshi c-black-016" />
          {item.bankName ? <span className={styles.bankNameBranch}>浙江省杭州市 <i style={{ color: 'rgba(216, 216, 216, 1)' }}><Icon type="line" /></i> {item.bankNameBranch}</span>:empty()}
        </div>
        {/* 备注 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <i className="iconfont iconbeizhu c-black-016" />
          {item.note?<span className={styles.note}>{item.note}</span>:empty()}
        </div>
      </Card>
    );
}

