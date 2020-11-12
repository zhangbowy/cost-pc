import React, { PureComponent } from 'react';
import { PageHeader, Menu, Button } from 'antd';
import { connect } from 'dva';
import cs from 'classnames';
import LabelLeft from '../../../../components/LabelLeft';
import style from './index.scss';
import FooterBar from '../../../../components/FooterBar';
import Basic from '../components/Basic';

const basicStr = [{
  key: 'one',
  value: '基础设置',
}, {
  key: 'two',
  value: '字段设置',
}, {
  key: 'three',
  value: '分摊设置',
}];
@connect(({ loading, session, addCategory }) => ({
  loading: loading.effects['addCategory/add'] || loading.effects['addCategory/edit'],
  userInfo: session.userInfo,
  details: addCategory.details,
  allList: addCategory.allList,
  checkDel: addCategory.checkDel,
  expandLists: addCategory.expandLists,
}))
class CategoryAdd extends PureComponent {

  state = {
    current: 'one',
  }

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
    const { current } = this.state;
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
        <div style={{background: '#fff', width: '100%'}}>
          <Menu
            mode="horizontal"
            className="m-l-32 titleMenu"
            selectedKeys={[current]}
          >
            {
              basicStr.map((it, index) => (
                <Menu.Item key={it.key}>
                  <span className={it.key === current ? cs(style.circle, style.active) : style.circle}>{index+1}</span>
                  <span>{it.value}</span>
                </Menu.Item>
              ))
            }
          </Menu>
        </div>
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
