// 编辑页面
import React, { PureComponent } from 'react';
import { Button, PageHeader, Divider } from 'antd';
import Lines from '@/components/StyleCom/Lines';
import PageHead from '@/components/pageHead';
import FooterBar from '../../../../components/FooterBar';
import style from './index.scss';
import BasicInfo from './components/BasicInfo';
import SetStandard from './components/SetStandard';

class editChargeStandard extends PureComponent {
  render() {
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
        breadcrumbName: '新增打车费',
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
          <p className="m-l-32 m-b-24 fs-20 c-black-85 fw-500">新增打车费</p>
        </div>
        <div className="content-dt">
          <Lines name="基础信息" />
          <BasicInfo />
          <Divider type="horizontal" />
          <Lines name="标准设置" />
          <SetStandard />
        </div>
        <FooterBar
          right={(
            <>
              <Button type="default" className="m-r-8" onClick={() => this.onCancel()}>取消</Button>
              <Button type="default" className="m-r-8" onClick={() => this.onCancel()}>保存</Button>
            </>
          )}
        />
      </div>
    );
  };
}

export default editChargeStandard;
