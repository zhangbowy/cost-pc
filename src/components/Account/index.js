import React from 'react';
import { Card,Tag,Icon} from 'antd';
import styles from './index.scss';

export default function index(props) {
    const { item } = props;
    console.log(item,'items,items,items');
    // 图标
    return (
      <Card style={{ width:'390px',height:'220px',backgroundColor:'#fff',margin:'16px 16px 0 0'}} className={styles.cardContent} bordered={false}>
        <div className={styles.bankName}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <i className="iconfont iconyinhangka1" />
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(0, 0, 0, 0.65)' }}>招商银行</span>
          </span>
          <span style={{color:'rgba(0, 0, 0, 0.65)'}}><i className="iconfont icona-caozuo3x"/></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center',margin:'15px 0',lineHeight:'24px' }}>
          <span className={styles.name}>{item.name}</span>
          <Tag color="blue">lime</Tag>
        </div>
        <div>
          <i className="iconfont iconzhanghao c-black-016" />
          <span className={styles.account}>63170037482305456346</span>
        </div>
        <div style={{ margin:'10px 0'}}>
          <i className="iconfont iconkaihushengshi c-black-016" />
          <span className={styles.bankNameBranch}>浙江省杭州市 <i style={{color:'rgba(216, 216, 216, 1)'}}>|</i> 杭州高新支行</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <i className="iconfont iconbeizhu c-black-016" />
          {item.note?<span className={styles.note}>{item.note}</span>:<Icon type="minus" className={styles.minus} style={{marginLeft:'10px'}} /> }
        </div>
      </Card>
    //   <div style={{ width:'390px',height:'220px',backgroundColor:'#fff',margin:'16px 16px 0 0'}} className={styles.cardContent}>
    //     <div>Cardcontent</div>
    //   </div>
    );
}

