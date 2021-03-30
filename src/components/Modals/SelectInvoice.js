import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import cs from 'classnames';
import { Modal, Tooltip } from 'antd';
import { debounce } from 'lodash-decorators';
import style from './index.scss';
import AddInvoice from './AddInvoice';
import Tags from '../Tags';

@connect(({ global, costGlobal }) => ({
  currencyList: global.currencyList,
  queryTemplateIds: costGlobal.queryTemplateIds,
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
    templateType: 0,
    invoiceVisible: false,
    invoiceId: '',
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
      let lists = treeConvert({
        pId: 'parentId',
        rootId: 0,
        otherKeys: ['note', 'type', 'parentId', 'createTime', 'templateType', 'disabled']
      }, users.filter(it => !(it.type === 1 && it.parentId === 0))).filter(({children = [], type}) => {
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
      });
    });
  }

  modalOk = (item) => {
    this.setState({
      invoiceVisible: true,
      invoiceId: item.id,
      templateType: item.templateType,
      visible: false,
    }, () => {
      if (this.props.onCancel) {
        this.props.onCancel();
      }
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
      const top = el.scrollTop + 110;
      const index = Array.prototype.findIndex.call(
        el.children, v => v.offsetTop > top
      ) - 1;
      const i = index < -1 || (index === -1) ? lastChild : index;
      const elChild = el.children[i];
      this.setState({
        id: elChild.dataset ? elChild.dataset.id : 'often'
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
            id: elChild.dataset ? elChild.dataset.id : 'often'
          });
        }
      }, 100, { maxWait: 200 }
    );
  };

  onCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    this.setState({
      visible: false,
    });
  }

  onChangeVi = () => {
    this.setState({
      invoiceVisible: false,
    });
  }

  render() {
    const { list, visible, id, selectCost, invoiceVisible, templateType, invoiceId } = this.state;
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
              ref={scroll => {this.scroll=scroll;}}
              onScroll={({target}) => this.handleScroll(target)}
            >
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
                            <div className={style.tags} key={item.id} onClick={() => this.modalOk(item)}>
                              <p className="c-black-85 fs-14">{item.name}</p>
                              <p className="fs-12 c-black-36 eslips-1">{item.note}</p>
                            </div>
                        }
                      </>

                    ));
                  }
                  return (
                    <div className="m-b-20" key={it.id} id={it.id} data-id={it.id} dataset={it}>
                      <div style={{display: 'flex', alignItems: 'center'}} className="m-b-12">
                        <p className="c-black-85 fs-16 fw-500" style={{marginBottom: '0'}}>
                          {it.name}
                        </p>
                        <span style={{ marginLeft: '6px' }}>
                          {
                            (it.type === 0) && it.templateType === 0 &&
                            <Tags color='rgba(38, 128, 242, 0.08)'>
                              报销
                            </Tags>
                          }
                          {
                            (it.type === 0) && it.templateType === 1 &&
                            <Tags color='rgba(0, 199, 149, 0.08)'>
                              借款
                            </Tags>
                          }
                          {
                            (it.type === 0) && it.templateType === 2 &&
                            <Tags color='rgba(255, 159, 0, 0.08)'>
                              申请
                            </Tags>
                          }
                        </span>
                      </div>
                      <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        {childrens}
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
          <AddInvoice
            templateType={templateType}
            visible={invoiceVisible}
            id={invoiceId}
            // onHandleOk={this.props.onOk}
            costSelect={selectCost}
            onChangeVisible={() => this.onChangeVi()}
            onFolder={() => { this.setState({ visible: false }); if (this.props.onHandle) this.props.onHandle(); }}
            onHandleOk={() => {
              if (this.props.onCallback) {
                this.props.onCallback();
              }
            }}
          />
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
