import React, { PureComponent } from 'react';
import { PageHeader, Menu, Button } from 'antd';
import { connect } from 'dva';
import LabelLeft from '../../../../components/LabelLeft';
import style from './index.scss';
import FooterBar from '../../../../components/FooterBar';
import Basic from '../components/Basic';

@connect(({ loading, session, addCategory }) => ({
  loading: loading.effects['addCategory/add'] || loading.effects['addCategory/edit'],
  userInfo: session.userInfo,
  details: addCategory.details,
  allList: addCategory.allList,
  checkDel: addCategory.checkDel,
  expandLists: addCategory.expandLists,
}))
class CategoryAdd extends PureComponent {
  componentDidMount(){
    this.props.dispatch({
      type: 'addCategory/allList',
      payload: {}
    });
  }

  render () {
    const {
      allList,
    } = this.props;
    const routes = [
      {
        path: 'index',
        breadcrumbName: '返回上一页',
      },
      {
        path: 'first',
        breadcrumbName: '费用类别设置',
      },
      {
        path: 'second',
        breadcrumbName: '新建费用类别',
      },
    ];

    return (
      <div style={{height: '100%'}}>
        <PageHeader
          title={null}
          breadcrumb={{routes}}
          style={{background: '#fff'}}
        />
        <Menu mode="horizontal">
          <Menu.Item key="one">
            <span className={style.circle}>1</span>
            <span>基础设置</span>
          </Menu.Item>
          <Menu.Item key="two">
            <span className={style.circle}>2</span>
            <span>字段设置</span>
          </Menu.Item>
          <Menu.Item key="three">
            <span className={style.circle}>3</span>
            <span>分摊设置</span>
          </Menu.Item>
        </Menu>
        <div className="content-dt" style={{height: 'calc(100% - 178px)'}}>
          <LabelLeft title="基础设置" />
          <Basic
            wrappedComponentRef={form => {this.formRef = form;}}
            list={allList}
            data={{}}
            title="add"
          />
        </div>
        <FooterBar
          right={(
            <>
              <Button type="default" className="m-r-8">取消</Button>
              <Button type="primary">下一步</Button>
            </>
          )}
        />
      </div>
    );
  }
}

export default CategoryAdd;
