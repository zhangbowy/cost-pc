import React, { Component } from 'react';
import { Menu, Button, Dropdown, Icon } from 'antd';
import style from './index.scss';
import LevelSearch from '../../../components/LevelSearch';


const menus = [{
  key: '0',
  name: '支出明细',
}, {
  key: '1',
  name: '部门支出',
}, {
  key: '2',
  name: '类别支出',
}, {
  key: '3',
  name: '项目支出',
}, {
  key: '4',
  name: '员工支出',
}, {
  key: '5',
  name: '供应商支出',
}];
class EchartsTest extends Component {

  state={
    current: '0'
  }

  componentDidMount () {

  }

  render() {
    const { current } = this.state;
    return (
      <div>
        <div style={{background: '#fff', paddingTop: '16px'}}>
          <p className="m-l-32 m-b-8 c-black-85 fs-20" style={{ fontWeight: 'bold' }}>支出分析表</p>
          <Menu
            onClick={this.handleClick}
            mode="horizontal"
            selectedKeys={[current]}
            className="m-l-32 titleMenu"
          >
            {
              menus.map(it => (
                <Menu.Item key={it.key}>{it.name}</Menu.Item>
              ))
            }
          </Menu>
        </div>
        <div className="content-dt">
          <div className="cnt-header">
            <div className="head_lf" style={{display: 'flex'}}>
              <Dropdown
                overlay={(
                  <Menu onClick={e => this.onExport(e)}>
                    <Menu.Item key="2"><span className="pd-20-9 c-black-65">导出高级搜索结果</span></Menu.Item>
                    <Menu.Item key="3"><span className="pd-20-9 c-black-65">导出全部</span></Menu.Item>
                  </Menu>
                )}
                overlayClassName={style.menuBtn}
              >
                <Button>
                  导出 <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
            <div className="head_rf">
              <LevelSearch>
                <span className={style.searchLevel}>
                  <i className="iconfont" />
                  高级筛选
                </span>
              </LevelSearch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EchartsTest;
