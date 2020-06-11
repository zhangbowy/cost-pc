import React, { Component } from 'react';
import { Popover, Divider } from 'antd';
// import cs from 'classnames';
import treeConvert from '@/utils/treeConvert';
import AddInvoice from '../Modals/AddInvoice';
import style from './index.scss';

class AddCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modalVis: false,
    };
  }

  handleOk = (val) => {
    this.setState({
      visible: val,
    });
  }

  onHandelShow = () => {
    this.setState({
      visible: false,
      modalVis: true,
    });
  }

  onOK = () => {
    this.props.onHandleOk();
  }

  handleData = (UseTemplate) => {
    const lists = treeConvert({
      pId: 'parentId',
      rootId: 0,
      otherKeys: ['parentId', 'type', 'note']
    }, UseTemplate).filter(({children = [], type}) => {
      if(type === 1) return true;
      // eslint-disable-next-line no-shadow
      return children.length > 0 ? children.map(({type}) => type === 1).length : false;
    }).sort(({children = []}, {children: bChildren = []}) => {
      return bChildren.length - children.length;
    });
    return lists;
  }

  render() {
    const { children, UseTemplate } = this.props;
    const { visible, modalVis } = this.state;
    const lists = this.handleData(UseTemplate);
    return (
      <Popover
        visible={visible}
        placement="bottomLeft"
        overlayClassName={style.pop_hover}
        overlayStyle={{ padding: 0 }}
        onVisibleChange={this.handleOk}
        trigger="click"
        content={(
          <div className={style.pop_cnt}>
            {/* <div className={style.content}>
              <div className={style.header}>
                <div className={style.line} />
                <span>常用</span>
              </div>
              {
                OftenTemplate.map(item => (
                  <AddInvoice
                    key={item.id}
                    visible={modalVis}
                  >
                    <div className={cs('p-t-10', style.cnt_cnts)} onClick={() => this.onHandelShow()}>
                      <p className="c-black-85 fw-500 fs-14">{item.name}</p>
                      <p className="c-black-36 fs-13 m-b-13">{item.note}</p>
                      <Divider type="horizontal" style={{margin: 0}} />
                    </div>
                  </AddInvoice>
                ))
              }
            </div> */}
            {
              lists.map(item => (
                <div className={style.content} key={item.id}>
                  {
                    item.type === 0 &&
                    <div className={style.header} key={item.id}>
                      <div className={style.line} />
                      <span>{item.name}</span>
                    </div>
                  }
                  {
                    item.parentId === 0 && (item.type === 1) &&
                    <AddInvoice id={item.id} visible={modalVis} onHandleOk={this.onOK}>
                      <div className={style.cnt_cnts} key={item.id} onClick={() => this.onHandelShow()}>
                        <div className={style.cnt_list}>
                          <p className="c-black-85 fw-500 fs-14 eslips-1">{item.name}</p>
                          <p className="c-black-36 fs-13 eslips-1">{item.note || ''}</p>
                        </div>
                        <Divider type="horizontal" style={{margin: 0}} />
                      </div>
                    </AddInvoice>
                  }
                  {
                    item.children && item.children.map(it => (
                      <AddInvoice id={it.id} visible={modalVis}>
                        <div className={style.cnt_cnts} key={it.id} onClick={() => this.onHandelShow()}>
                          <div className={style.cnt_list}>
                            <p className="c-black-85 fw-500 fs-14 eslips-1">{it.name}</p>
                            <p className="c-black-36 fs-13 eslips-1">{it.note || ''}</p>
                          </div>
                          <Divider type="horizontal" style={{margin: 0}} />
                        </div>
                      </AddInvoice>
                    ))
                  }
                </div>
              ))
            }
          </div>
        )}
      >
        <span onClick={() => this.handleOk()}>{children}</span>
      </Popover>
    );
  }
}

export default AddCategory;
