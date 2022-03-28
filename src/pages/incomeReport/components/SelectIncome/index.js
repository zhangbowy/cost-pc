/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
import cs from 'classnames';
import { Modal, Tooltip } from 'antd';
import { debounce } from 'lodash-decorators';
import withRouter from 'umi/withRouter';
import Search from 'antd/lib/input/Search';
import treeConvert from '@/utils/treeConvert';
import style from './index.scss';
import NoData from '@/components/NoData';
// import AddInvoice from './AddInvoice';
// import Tags from '../Tags';

@withRouter
@connect(({ global, costGlobal }) => ({
  currencyList: global.currencyList,
  queryTemplateIds: costGlobal.queryTemplateIds,
}))
class SelectIncome extends Component {
  static propTypes = {

  }

  state = {
    visible: false,
    scrollCancel: false,
    list: [],
    id: 'often',
    selectCost: [],
    noTreeList: [],
    searchContent: '',
    searchList: [],
    activeObj: {},
    isScroll: false,
    // templateType: 0,
    // invoiceVisible: false,
    // invoiceId: '',
  }

  componentDidUpdate(prevProps){
    if(prevProps.visible !==  this.props.visible) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        visible: this.props.visible
      });
      if (this.props.visible) {
        this.onShow();
      }
    }
  }

  onShow = async() => {
    await this.props.dispatch({
      type: 'global/getCurrency',
      payload: {},
    });
    const { selectInvoice } = this.props;
    const arr = [];
    console.log('SelectInvoice -> onShow -> selectInvoice', selectInvoice);
    if (selectInvoice) {
      const costCategoryIds = selectInvoice.map(it => it.categoryId);
      await this.props.dispatch({
        type: 'costGlobal/queryTemplateIds',
        payload: {
          costCategoryIds
        }
      });
    }
    await this.props.dispatch({
      type: 'global/oftenList',
      payload: {}
    }).then(() => {
      const { useTemplate, oftenTemplate, currencyList, queryTemplateIds  } = this.props;
      console.log('SelectInvoice -> onShow -> queryTemplateIds', queryTemplateIds);
      const users = useTemplate.map(it => {
        const obj = {
          ...it,
        };
        if (selectInvoice && !queryTemplateIds.includes(it.id)) {
          Object.assign(obj, {
            disabled: true
          });
        }
        return obj;
      });
      const often = oftenTemplate.map(it => {
        const obj = {
          ...it,
        };
        if (selectInvoice && !queryTemplateIds.includes(it.id)) {
          Object.assign(obj, {
            disabled: true
          });
        }
        return obj;
      });
      const others = users.filter(it => (it.type === 1 && it.parentId === 0));
      const sortUsers = users.sort();
      let lists = treeConvert({
        pId: 'parentId',
        rootId: 0,
        otherKeys: ['note', 'type', 'parentId', 'createTime', 'templateType', 'disabled']
      }, sortUsers.filter(it => !(it.type === 1 && it.parentId === 0))).filter(({children = [], type}) => {
        if(type === 1) return true;
        return children.length > 0 ? children.map(it => it.type === 1).length : false;
      });
      lists = [
        { id: 'often', name: '常用单据', children: often },
        ...lists,
        { id: 'qita', name: '其他单据模板（未分组）', children: others }];
      if (selectInvoice) {
        selectInvoice.forEach(it => {
          let currency = {};
          const costDetailShareVOS = [];
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
          if (it.costDetailShareVOS) {
            it.costDetailShareVOS.forEach(item => {
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
        selectCost: arr,
        noTreeList: users,
      });
    });
  }

  handleOk = () => {
    // const { activeObj } = this.state;
    const { selectCost } = this.state;
    if (selectCost) {
      localStorage.setItem('selectCost', JSON.stringify(selectCost));
    }
    localStorage.removeItem('contentJson');
    // this.props.history.push(`/workbench/add~${activeObj.templateType}~${activeObj.id}`);
    this.props.history.push('/incomeReport/add~20~713812629653217280');
  }

  modalOk = (item) => {
    this.setState({
      activeObj: item,
    }, () => {
      this.handleOk();
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

  handleScroll = (el) => {
    if (el && el.children) {
      const lastChild = el.children.length - 1;
      // const top = el.scrollTop + 110;
      const top = el.scrollTop + 174;
      const index = Array.prototype.findIndex.call(
        el.children, v => v.offsetTop > top
      ) - 1;
      const i = index < -1 || (index === -1) ? lastChild : index;
      const elChild = el.children[i];
      this.setState({
        id: elChild.dataset ? elChild.dataset.id : 'often',
        isScroll: el.scrollTop > 0,
      });
    }
    debounce(
      () => {
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
            id: elChild.dataset ? elChild.dataset.id : 'often',
            isScroll: el.scrollTop > 0,
          });
        }
      }, 100, { maxWait: 200 }
    );
  };

  onSearch = (val) => {
    console.log('🚀 ~ file: SelectInvoice.js ~ line 215 ~ SelectInvoice ~ val', val);
    const { noTreeList } = this.state;
    if (val) {
      this.setState({
        searchList: noTreeList.filter(it => it.name.indexOf(val) > -1 && it.type),
        searchContent: val
      });
    } else {
      this.setState({
        searchList: [],
        searchContent: ''
      });
    }

  }

  onCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    this.setState({
      visible: false,
    });
  }

  // onChangeVi = () => {
  //   this.setState({
  //     invoiceVisible: false,
  //   });
  // }

  render() {
    const { list, visible, id, searchList, searchContent, activeObj, isScroll } = this.state;
    // const isScroll = this.scroll.scrollTop > 1;
    return (
      <span>
        <span onClick={() => this.onShow(true)}>{this.props.children}</span>
        <Modal
          title={null}
          // footer={[
          //   <Button key="cancel" type="default" onClick={this.onCancel}>取消</Button>,
          //   <Button
          //     key="go"
          //     disabled={!activeObj.id}
          //     type="primary"
          //     onClick={this.handleOk}
          //   >去填写单据
          //   </Button>,
          // ]}
          footer={null}
          onCancel={this.onCancel}
          visible={visible}
          width="980px"
          className={isScroll ? 'ant-footer-shadow' : ''}
          closeIcon={(
            <div className="modalIcon">
              <i className="iconfont icona-guanbi3x1" />
            </div>
          )}
          wrapClassName="centerModal"
          bodyStyle={{
            height: '580px',
            padding: '24px 0px 0px 32px'
          }}
        >
          <p className="fs-20 fw-500 m-b-16 c-black-85">选择单据模板</p>
          <div className={style.scrollCont}>
            <div className={style.slInLeft}>
              {/* <p className="c-black-85 fs-14 fw-500 m-t-12">全部</p> */}
              <div className={cs(style.scroll, 'm-t-16')}>
                {
                  list.map(it => (
                    <p className={cs(style.namePro, 'm-b-16')} key={it.id} onClick={() => this.scrollToAnchor(it.id)}>
                      <span className={id ===it.id ? cs(style.name, 'c-black-85', 'fw-500') : cs(style.name, 'c-black-45')}>{it.name}</span>
                    </p>
                  ))
                }
              </div>
            </div>
            <div
              className={style.slRight}
              ref={scroll => {this.scroll=scroll;}}
              onScroll={({target}) => this.handleScroll(target)}
            >
              <div className="m-r-32">
                <Search
                  placeholder="请输入单据名称"
                  style={{marginBottom: '16px'}}
                  onChange={e => this.onSearch(e.target.value)}
                  allowClear
                />
              </div>
              <div className={style.scroll}>
                {
                  searchContent && searchList.length === 0 ?
                    <div style={{marginTop: '76px', marginRight: '8px'}}>
                      <NoData />
                    </div>
                    :
                    searchContent && searchList.length > 0 ?
                      <div className="m-b-20">
                        <div style={{display: 'flex', alignItems: 'center'}} className="m-b-8">
                          <p className="c-black-85 fs-14 fw-500" style={{marginBottom: '0'}}>
                            匹配到{searchList.length}个单据模板
                          </p>
                        </div>
                        <div style={{display: 'flex', flexWrap: 'wrap'}}>
                          {
                          searchList.map(item => (
                            <>
                              {
                                item.disabled ?
                                  <Tooltip
                                    title="已选的支出类别不支持该单据模版"
                                    placement="bottom"
                                  >
                                    <div
                                      className={style.tags}
                                      key={item.id}
                                      style={{
                                        background: 'rgba(0,0,0,0.01)',
                                        border: 'none',
                                        cursor:'not-allowed',
                                        boxShadow: 'none'
                                      }}
                                    >
                                      <p className="c-black-15 fs-14">{item.name}</p>
                                      <p className="fs-12 c-black-15 eslips-1">{item.note}</p>
                                    </div>
                                  </Tooltip>
                                  :
                                  <div className={activeObj.id === item.id ? cs(style.tags, style.active) : style.tags} key={item.id} onClick={() => this.modalOk(item)}>
                                    <p className="c-black-85 fs-14">{item.name}</p>
                                    <p className="fs-12 c-black-36 eslips-1">{item.note}</p>
                                  </div>
                              }
                            </>
                          ))
                        }
                        </div>
                      </div>
                    :
                      <>
                        {
                          list.map(it => {
                            let childrens = null;
                            if (it.children) {
                              childrens = it.children.map(item => (
                                <>
                                  {
                                    item.disabled ?
                                      <Tooltip
                                        title="已选的支出类别不支持该单据模版"
                                        placement="bottom"
                                      >
                                        <div
                                          className={style.tags}
                                          key={item.id}
                                          style={{
                                            background: 'rgba(0,0,0,0.01)',
                                            border: 'none',

                                            cursor:'not-allowed',
                                            boxShadow: 'none'
                                          }}
                                        >
                                          <p className="c-black-15 fs-14">{item.name}</p>
                                          <p className="fs-12 c-black-15 eslips-1">{item.note}</p>
                                        </div>
                                      </Tooltip>
                                      :
                                      <div className={activeObj.id === item.id ? cs(style.tags, style.active) : style.tags} key={item.id} onClick={() => this.modalOk(item)}>
                                        <p className="c-black-85 fs-14">{item.name}</p>
                                        <p className="fs-12 c-black-36 eslips-1">{item.note}</p>
                                      </div>
                                  }
                                </>

                              ));
                            }
                            return (
                              <div className="m-b-8" key={it.id} id={it.id} data-id={it.id} dataset={it}>
                                <div style={{display: 'flex', alignItems: 'center'}} className="m-b-8">
                                  <span style={{ marginRight: '6px' }}>
                                    {
                                      (it.type === 0) && it.templateType === 0 &&
                                      <i className="iconfont icona-baoxiaodan3x" style={{marginLeft: '1px'}} />
                                    }
                                    {
                                      (it.type === 0) && it.templateType === 1 &&
                                      <i className="iconfont icona-jiekuandan3x" style={{marginLeft: '1px'}} />
                                    }
                                    {
                                      (it.type === 0) && it.templateType === 2 &&
                                      <i className="iconfont icona-shenqingdan3x" style={{marginLeft: '1px'}} />
                                    }
                                    {
                                      (it.type === 0) && it.templateType === 3 &&
                                      <i className="iconfont icona-zidingyifenzu3x" style={{marginLeft: '1px'}} />
                                    }
                                  </span>
                                  <p className="c-black-85 fs-14 fw-500" style={{marginBottom: '0'}}>
                                    {it.name}（
                                    {it.children.length}）
                                  </p>
                                </div>
                                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                                  {childrens}
                                </div>
                              </div>
                            );
                          })
                        }
                      </>
                }
              </div>
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

export default connect(mapStateToProps)(SelectIncome);
