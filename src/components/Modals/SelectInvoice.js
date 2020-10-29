import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import cs from 'classnames';
import { Modal } from 'antd';
import { debounce } from 'lodash-decorators';
import style from './index.scss';
import AddInvoice from './AddInvoice';

@connect(({ global }) => ({
  currencyList: global.currencyList,
}))
class SelectInvoice extends Component {
  static propTypes = {

  }

  state = {
    visible: false,
    scrollCancel: false,
    list: [],
    id: 'often',
    selectCost: [],
  }

  onShow = async() => {
    await this.props.dispatch({
      type: 'global/getCurrency',
      payload: {},
    });
    await this.props.dispatch({
      type: 'global/oftenList',
      payload: {}
    }).then(() => {
      const { useTemplate, oftenTemplate, selectInvoice, currencyList  } = this.props;
      const others = useTemplate.filter(it => (it.type === 1 && it.parentId === 0));
      let lists = treeConvert({
        pId: 'parentId',
        rootId: 0,
        otherKeys: ['note', 'type', 'parentId', 'createTime', 'templateType']
      }, useTemplate.filter(it => !(it.type === 1 && it.parentId === 0))).filter(({children = [], type}) => {
        if(type === 1) return true;
        return children.length > 0 ? children.map(it => it.type === 1).length : false;
      });
      lists = [
        { id: 'often', name: '常用单据', children: oftenTemplate },
        ...lists,
        { id: 'qita', name: '其他单据模板（未分组）', children: others }];
      if (selectInvoice) {
        const costDetailShareVOS = [];
        const arr = [];
        selectInvoice.forEach(it => {
          let currency = {};
          if (it.currencyId && it.currencyId !== '-1') {
            // eslint-disable-next-line prefer-destructuring
            currency = currencyList.filter(its => its.id === it.currencyId)[0];
          }
          const obj = {
            ...it,
            key: it.id,
            folderType: 'folder',
            costSum: currency.id ? it.currencySum/100 : it.costSum/100,
            detailFolderId: it.id,
          };
          if (arr.costDetailShareVOS) {
            arr.costDetailShareVOS.forEach(item => {
              costDetailShareVOS.push({
                ...item,
                shareAmount: currency.id ? item.currencySum/100 : item.shareAmount/100,
              });
            });
          }
          arr.push({
            ...obj,
            costDetailShareVOS,
            currencyId: it.currencyId || '-1',
            currencyName: currency.name || '',
            exchangeRate: currency.exchangeRate || 1,
            currencySymbol: currency.currencySymbol || '¥',
          });
        });
      }
      this.setState({
        list: lists,
        visible: true,
        selectCost: [],
      });
    });
  }

  scrollToAnchor = (anchorName) => {
    this.setState({
      id: anchorName,
    });
    if (anchorName) {
      // 找到锚点
      const anchorElement = document.getElementById(anchorName);
      // 如果对应id的锚点存在，就跳转到锚点
      if(anchorElement) { anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'}); }
    }
  };

  handleScroll = () => debounce(
    el => {
      const { scrollCancel } = this.state;
      if (scrollCancel) {
        this.setState({
          scrollCancel: false,
        });
      } else if (el && el.children) {
        const lastChild = el.children.length - 1;
        const top = el.scrollTop + 760;
        const index = Array.prototype.findIndex.call(
          el.children, v => v.offsetTop > top
        ) - 1;
        const i = index < -1 ? lastChild : index;
        const elChild = el.children[i];
        this.setState({
          id: elChild.dataset ? elChild.dataset.id : 'often'
        });
      }
    }, 100, { maxWait: 200 }
  );

  onCancel = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { list, visible, id, selectCost } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow(true)}>{this.props.children}</span>
        <Modal
          title={null}
          footer={null}
          onCancel={this.onCancel}
          visible={visible}
          width="780px"
          bodyStyle={{
            height: '500px',
            padding: '38px 40px 34px'
          }}
        >
          <p className="fs-24 fw-500 m-b-24 c-black-85">选择单据模板</p>
          <div className={style.scrollCont}>
            <div className={style.slInLeft}>
              <p className="c-black-25 fs-14">选择分组</p>
              <div className={style.scroll}>
                {
                  list.map(it => (
                    <p className={cs(style.namePro, 'm-b-16')} key={it.id} onClick={() => this.scrollToAnchor(it.id)}>
                      <span className={id ===it.id ? cs(style.name, 'c-black-85', 'fw-500') : cs(style.name, 'c-black-65')}>{it.name}</span>
                      <span className="c-black-25">{it.children ? it.children.length : 0}</span>
                    </p>
                  ))
                }
              </div>
            </div>
            <div
              className={style.slRight}
              onScroll={({target}) => this.handleScroll(target)}
            >
              {
                list.map(it => {
                  let childrens = null;
                  if (it.children) {
                    childrens = it.children.map(item => (
                      <AddInvoice
                        templateType={item.templateType}
                        id={item.id}
                        onHandleOk={this.props.onOk}
                        costSelect={selectCost}
                      >
                        <div className={style.tags} key={item.id}>
                          <p className="c-black-85 fs-14">{item.name}</p>
                          <p className="fs-12 c-black-36">{item.note}</p>
                        </div>
                      </AddInvoice>
                    ));
                  }
                  return (
                    <div className="m-b-20" key={it.id} id={it.id} data-id={it.id}>
                      <p className="c-black-85 fs-16 fw-500">{it.name}</p>
                      <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        {childrens}
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    useTemplate: state.global.UseTemplate, // 普通列表
    oftenTemplate: state.global.OftenTemplate, // 常用单据列表
  };
};

export default connect(mapStateToProps)(SelectInvoice);
