// 编辑页面
import React, { PureComponent } from 'react';
import { Button, PageHeader, Divider } from 'antd';
import { connect } from 'dva';
import Lines from '@/components/StyleCom/Lines';
import PageHead from '@/components/pageHead';
import treeConvert from '@/utils/treeConvert';
import FooterBar from '../../../../components/FooterBar';
import style from './index.scss';
import BasicInfo from './components/BasicInfo';
import SetStandard from './components/SetStandard';
import fields from '../../../../utils/fields';
import OtherRule from './components/OtherRule';

const { chargeType } = fields;
@connect(({ global, loading, addStandard }) => ({
  costCategoryList: global.costCategoryList,
  detail: addStandard.detail,
  loading: loading.effects['addStandard/add'] || loading.effects['addStandard/edit'] || false,
}))
class editChargeStandard extends PureComponent {

  constructor(props){
    super(props);
    this.basicForm = null;
    this.otherForm = null;
    this.setForm = null;
    this.state = {
      details: {},
      costList: [],
    };
  }

  componentDidMount() {
    const { id } = this.splitParams();
    this.fetch(() => {
      if (id) {
        const { detail } = this.props;
        console.log('detail', detail);
        this.setState({
          details: detail,
        });
      }
      const { costCategoryList } = this.props;
      this.setState({
        costList: treeConvert({
          rootId: 0,
          pId: 'parentId',
          name: 'costName',
          tName: 'title',
          tId: 'value'
        }, costCategoryList)
      });
    });
  }

  fetch = (callback) => {
    const arr = [{
      url: 'global/costList',
      payload: {},
    }];
    const { dispatch } = this.props;
    const { id } = this.splitParams();
    if (id) {
      arr.push({
        url: 'addStandard/detail',
        payload: {
          id
        },
      });
    }
    const fetchs = arr.map(it => {
      return dispatch({
        type: it.url,
        payload: it.payload,
      });
    });
    Promise.all(fetchs).then(() => {
      if (callback) callback();
    });
  }

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
    const { type, id } = this.splitParams();
    const val = {};
    if (this.basicForm && this.basicForm.getItems) {
      console.log(this.basicForm.getItems());
      Object.assign(val, {
        costStandardBaseVo: this.basicForm.getItems(),
      });
    }
    if (this.setForm && this.setForm.getItems) {
      console.log(this.setForm.getItems());
      Object.assign(val, {
        costStandardDetailVo: this.setForm.getItems(),
      });
    }
    if (this.otherForm && this.otherForm.getItems) {
      console.log(this.otherForm.getItems());
      Object.assign(val, {
        costStandardOtherVo: this.otherForm.getItems(),
      });
    }
    if (val.costStandardBaseVo && val.costStandardDetailVo
      && (type !== 2 || val.costStandardOtherVo)) {
      this.props.dispatch({
        type: id ? 'addStandard/edit' : 'addStandard/add',
        payload: {
          ...val
        }
      }).then(() => {
        this.props.history.push('/basicSetting/costStandard');
      });
    }

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
        breadcrumbName: `${id ? '编辑' : '新增'}${chargeType[type].name}标准`,
      },
    ];
    const { loading } = this.props;
    const { details, costList } = this.state;
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
          <p className="m-l-32 m-b-24 fs-20 c-black-85 fw-500">{id ? '编辑' : '新增'}{chargeType[type].name}标准</p>
        </div>
        <div className="content-dt">
          <Lines name="基础信息" />
          <BasicInfo
            type={type}
            details={details.costStandardBaseVo || {}}
            wrappedComponentRef={form => {this.basicForm = form;}}
            costList={costList}
            id={id}
          />
          <Divider type="horizontal" />
          <Lines name="标准设置" />
          <SetStandard
            type={Number(type)}
            details={details.costStandardDetailVo || {}}
            wrappedComponentRef={form => {this.setForm = form;}}
          />
          {
            type === 2 &&
            <>
              <Divider type="horizontal" />
              <Lines name="其他规则" />
              <OtherRule
                details={details.costStandardOtherVo || {}}
                wrappedComponentRef={form => {this.otherForm = form;}}
              />
            </>
          }
        </div>
        <FooterBar
          right={(
            <>
              <Button type="default" className="m-r-8" onClick={() => this.onCancel()}>取消</Button>
              <Button
                type="primary"
                className="m-r-8"
                onClick={() => this.onSave()}
                loading={loading}
              >
                保存
              </Button>
            </>
          )}
        />
      </div>
    );
  };
}

export default editChargeStandard;
