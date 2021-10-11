// 编辑页面
import React, { PureComponent } from 'react';
import { Button, PageHeader, Divider } from 'antd';
import Lines from '@/components/StyleCom/Lines';
import PageHead from '@/components/pageHead';
import FooterBar from '../../../../components/FooterBar';
import style from './index.scss';
import BasicInfo from './components/BasicInfo';
import SetStandard from './components/SetStandard';
import fields from '../../../../utils/fields';

const { chargeType } = fields;
class editChargeStandard extends PureComponent {

  splitParams = () => {
    const { id } = this.props.match.params;
    const arr = id.split('_');
    console.log('editChargeStandard -> splitParams -> arr', arr);
    return {
      type: Number(arr[0]),
      id: arr.length > 1 ? arr[1] : '',
    };
  }

  onCancel = () => {
    this.props.history.push('/basicSetting/costStandard');
  }

  onSave = () => {

  }

  render() {
    const { type, id } = this.splitParams();
    const routes = [
      // {
      //   path: '/basicSetting/invoice',
      //   breadcrumbName: '返回上一页',
      //   paths: 'basicSetting/invoice'
      // },
      {
        path: '/basicSetting/costStandard',
        breadcrumbName: '费用标准',
        paths: 'basicSetting/costStandard'
      },
      {
        path: 'second',
        breadcrumbName: `${id ? '编辑' : '新增'}${chargeType[type].name}费`,
      },
    ];
    return (
      <div>
        <PageHead
          title={
            <PageHeader
              title={null}
              breadcrumb={{routes}}
              style={{background: '#fff'}}
            />
          }
        />
        <div className={style.title}>
          <p className="m-l-32 m-b-24 fs-20 c-black-85 fw-500">{id ? '编辑' : '新增'}{chargeType[type].name}费</p>
        </div>
        <div className="content-dt">
          <Lines name="基础信息" />
          <BasicInfo type={type} />
          <Divider type="horizontal" />
          <Lines name="标准设置" />
          <SetStandard type={Number(type)} />
          {
            type === 2 &&
            <>
              <Divider type="horizontal" />
              <Lines name="其他规则" />
            </>
          }
        </div>
        <FooterBar
          right={(
            <>
              <Button type="default" className="m-r-8" onClick={() => this.onCancel()}>取消</Button>
              <Button type="primary" className="m-r-8" onClick={() => this.onSave()}>保存</Button>
            </>
          )}
        />
      </div>
    );
  };
}

export default editChargeStandard;
