import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Tooltip, Divider, Popover, Tag, Button, Popconfirm, message, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import InvoiceTable from '.';
import AddCost from '../AddCost';
import style from './index.scss';
import { getArrayColor, classifyIcon } from '../../../../utils/constants';
import { rowSelect } from '../../../../utils/common';
import SelectInvoice from '../../SelectInvoice';
import aliLogo from '../../../../assets/img/aliTrip/alitrip.png';
import { ddPreviewImage } from '../../../../utils/ddApi';

@connect(({ costGlobal, loading, session }) => ({
  folderList: costGlobal.folderList,
  folderSum: costGlobal.folderSum,
  total: costGlobal.total,
  folderPage: costGlobal.folderPage,
  checkLinkCost: costGlobal.checkLinkCost,
  officeList: costGlobal.officeList,
  userInfo: session.userInfo,
  loading: loading.effects['costGlobal/listFolder'] || false,
}))
class CostFolder extends Component {
  static propTypes = {
    folderList: PropTypes.array,
  }

  state = {
    selectedRowKeys:[],
    selectedRows: [],
    visible: false,
    searchContent: '',
    money: 0,
    slVisible: false,
    officeId: '',
  }

  onShow = () => {
    const { userInfo } = this.props;
    this.props.dispatch({
      type: 'costGlobal/officeList',
      payload: {
        userId: userInfo.userId
      }
    });
    this.props.dispatch({
      type: 'costGlobal/listFolder',
      payload: {
        pageNo: 1,
        pageSize: 5,
      }
    }).then(() => {
      this.setState({
        visible: true,
      });
    });
  }

  onCancel = () => {
    this.setState({
      selectedRowKeys:[],
      selectedRows: [],
      visible: false,
      officeId: '',
    }, () => {
      this.props.onPerson();
    });
  }

  onSelectAll = (selected, selectedRows, changeRows) => {
    const result = rowSelect.onSelectAll(this.state, selected, changeRows);
    const _selectedRows = result.selectedRows;
    const { selectedRowKeys } = result;
    const money = _selectedRows.reduce((acc, cur) => {
      return acc+cur.costSum/100;
    }, 0);
    this.setState({
      selectedRows: _selectedRows,
      selectedRowKeys,
      details: _selectedRows,
      money: Number(((money*1000)/10).toFixed(0))/100,
    });
  };

  onSelect = (record, selected) => {
    const {
      selectedRows,
      selectedRowKeys,
    } = rowSelect.onSelect(this.state, record, selected);
    const money = selectedRows.reduce((acc, cur) => {
      return acc+cur.costSum/100;
    }, 0);
    this.setState({
      selectedRows,
      selectedRowKeys,
      details: selectedRows,
      money: Number(((money*1000)/10).toFixed(0))/100,
    });
  };

  onSearch = (e) => {
    const { folderPage } = this.props;
    const { officeId } = this.state;
    this.setState({
      searchContent: e,
    });
    this.props.dispatch({
      type: 'costGlobal/listFolder',
      payload: {
        pageNo: folderPage.pageNo,
        pageSize: folderPage.pageSize,
        searchContent: e,
        officeId: officeId || ''
      }
    });
  }

  slInvoice = () => {
    const { selectedRows } = this.state;
    console.log('selectedRows', selectedRows);
    const arrs = [];
    const arrOffice = [];
    const { officeList } = this.props;
    selectedRows.forEach(it => {
      arrs.push({
        id: it.id,
        applicationInvoiceId: it.applicationInvoiceId,
      });
      arrOffice.push(it.officeId);
      // TO DO:
      // ??????????????????????????????
    });
    const flag = arrOffice.filter(it => !it);
    if (flag && flag.length && (officeList.length > 0)) {
      message.error('?????????????????????????????????');
      return;
    }
    const arrsLen = Array.from(new Set(arrOffice));
    if (arrsLen.length !== 1 && (officeList.length > 0)) {
      message.error('?????????????????????????????????????????????');
      return;
    }
    this.props.dispatch({
      type: 'costGlobal/checkLinkCost',
      payload: {
        list: arrs,
      }
    }).then(() => {
      const { checkLinkCost } = this.props;
      if (checkLinkCost.unassociatedCount) {
        Modal.confirm({
          title: `??????????????????${checkLinkCost.unassociatedCount}??????????????????????????????`,
          okText: '???',
          cancelText: '???',
          onOk: () => {
            const { folders } = checkLinkCost;
            const oldIds = selectedRows.map(it => it.id);
            const newArr = [...selectedRows];
            folders.forEach(it => {
              if (!oldIds.includes(it.id)) {
                newArr.push({
                  ...it,
                });
              }
            });
            this.setState({
              selectedRows: newArr,
            }, () => {
              this.setState({
                slVisible: true,
              });
            });
          },
          onCancel: () => {
            this.setState({
              slVisible: true,
            });
          },
        });
      } else {
        this.setState({
          slVisible: true,
        });
      }
    });

  }

  onChangeVisible = () => {
    this.setState({
      slVisible: false,
    });
  }

  previewImage = (arr, index) => {
    ddPreviewImage({
      urlArray: arr.map(it => it.imgUrl),
      index,
    });
  }

  onChangeOffice = val => {
    this.setState({
      officeId: val,
    }, () => {
      const { searchContent } = this.state;
      const { folderPage } = this.props;
      this.onQuery({
        pageNo: folderPage.pageNo,
        pageSize: folderPage.pageSize,
        searchContent,
      });
    });

  }

  onDelete = (id) => {
    let ids = this.state.selectedRowKeys;
    if (id) {
      ids = [id];
    }
    if (!ids.length) {
      message.error('???????????????');
      return;
    }
    this.props.dispatch({
      type: 'costGlobal/delFolder',
      payload: {
        ids,
      }
    }).then(() => {
      const { folderPage } = this.props;
      const { searchContent } = this.state;
      if (!id) {
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
        });
      }
      this.onQuery({
        pageNo: folderPage.pageNo,
        pageSize: folderPage.pageSize,
        searchContent,
      });
    });
  }

  onQuery = (payload) => {
    const { officeId } = this.state;
    Object.assign(payload, {
      officeId: officeId || '',
    });
    this.props.dispatch({
      type: 'costGlobal/listFolder',
      payload,
    });
  }

  render() {
    const { folderList, loading, folderPage, folderSum, officeList } = this.props;
    const { selectedRowKeys, selectedRows, visible, money, searchContent, slVisible, officeId } = this.state;
    const columns = [{
      title: '????????????',
      dataIndex: 'categoryName',
      ellipsis: true,
      render: (_, record) => (
        <span className={style.cateNames}>
          <i
            className={`iconfont icon${record.icon}`}
            style={{
              color: getArrayColor(record.icon, classifyIcon),
              fontSize: '24px',
              marginRight: '4px',
              verticalAlign: 'middle'
            }}
          />
          <Tooltip title={record.categoryName}>
            <span
              style={{maxWidth: record.showAlitripIcon ? '130px' : '154px'}}
              className={style.categoryName}
            >
              {record.categoryName}
            </span>
          </Tooltip>
          {
            record.showAlitripIcon &&
            <img src={aliLogo} alt="????????????" style={{ width: '18px', height: '18px',marginLeft: '8px' }} />
          }
        </span>
      ),
      width: '180px'
    }, {
      title: '???????????????',
      dataIndex: 'costSum',
      render: (_, record) => (
        <span>
          <span
            className={record.costDetailShareVOS && record.costDetailShareVOS.length > 0 ? '' : 'm-r-72'}
            style={{display: 'inline-block'}}
          >{record.currencySumStr ?  `${record.costSumStr}(${record.currencySumStr})`: record.costSumStr}
          </span>
          {
            record.costDetailShareVOS && record.costDetailShareVOS.length > 0 &&
            <Popover
              content={(
                <div className={style.share_cnt}>
                  <p key={record.id} className="c-black-85 fs-14 fw-500 m-b-8">????????????????????? ??{record.costSum/100}{record.currencySumStr ? `(${record.currencySumStr})` : ''}</p>
                  {
                    record.costDetailShareVOS.map(it => (
                      <p key={it.id} className="c-black-36 fs-13">
                        <span className="m-r-8">{it.userName ? `${it.userName}/` : ''}{it.deptName}</span>
                        {
                          it.projectName &&
                          <span className="m-r-8">{it.projectName}</span>
                        }
                        <span>??{it.shareAmount/100}{it.currencySumStr ? `(${it.currencySumStr})` : ''}</span>
                      </p>
                    ))
                  }
                </div>
              )}
            >
              <Tag className="m-l-8" style={{marginRight: '0px'}}>????????????</Tag>
            </Popover>
          }
        </span>
      ),
      className: 'moneyTagCol',
      width: '180px'
    }, {
      title: '????????????',
      dataIndex: 'happenTime',
      width: '150px',
      render: (_, record) => (
        <span>
          <span>{record.startTime ? moment(Number(record.startTime)).format('YYYY-MM-DD') : '-'}</span>
          <span>{record.endTime ? `-${moment(Number(record.endTime)).format('YYYY-MM-DD')}` : ''}</span>
        </span>
      )
    }, {
      title: '??????',
      dataIndex: 'note',
      ellipsis: true,
      width: '100px',
      render: (text) => (
        <Tooltip placement="topLeft" title={text || ''}>
          <span>{text}</span>
        </Tooltip>
      )
    }, {
      title: '??????',
      dataIndex: 'imgUrl',
      render: (_, record) => (
        <span className={record.imgUrl && (record.imgUrl.length > 0) ? style.imgScroll : style.imgUrlTable}>
          {record.imgUrl && record.imgUrl.map((it, index) => (
            <div className="m-r-8" onClick={() => this.previewImage(record.imgUrl, index)}>
              <img alt="??????" src={it.imgUrl} className={style.images} />
            </div>
          ))}
        </span>
      ),
      textWrap: 'word-break',
      width: '140px'
    }, {
      title: '??????',
      dataIndex: 'opea',
      render: (_, record) => (
        <span>
          <Popconfirm
            title="??????????????????"
            onConfirm={() => this.onDelete(record.id)}
          >
            <span className="deleteColor">??????</span>
          </Popconfirm>
          <Divider type="vertical" />
          <AddCost
            costType={1}
            id={record.id}
            costTitle="edit"
            onCallback={() => {
              this.setState({
                selectedRowKeys:[],
                selectedRows: [],
              });
              this.onQuery({ searchContent,
              pageNo: folderPage.pageNo,
              pageSize: folderPage.pageSize });
              this.props.onPerson();
            }}
            isDelete4Category={record.isDelete4Category}
          >
            <a>??????</a>
          </AddCost>
        </span>
      ),
      className: 'fixCenter',
      fixed: 'right',
      width: 120,
    }];
    if (officeList && officeList.length) {
      columns.splice(2,0, {
        title: '?????????',
        dataIndex: 'officeName',
        ellipsis: true,
        width: 120,
        render: (text) => (
          <Tooltip title={text || '-'}>
            <span>{text || '-'}</span>
          </Tooltip>
        )
      });
    }
    return (
      <div>
        <div onClick={() => this.onShow()}>{this.props.children}</div>
        <Modal
          title="??????"
          visible={visible}
          onCancel={() => this.onCancel()}
          width="980px"
          bodyStyle={{height: '470px', overflowY: 'scroll'}}
          footer={(
            <>
              {
                selectedRowKeys.length ?
                  <div key="dull" className={style.costMoney}>
                    <div />
                    {/* <Button type="default" key="cancel" onClick={this.onCancel}>??????</Button> */}
                    <div>
                      <span className="fs-15 c-black-85 m-r-8">
                        ??????{selectedRowKeys.length}??? ????????
                        <span className="fs-20 fw-500">{money}</span>
                      </span>
                      <Button type="primary" onClick={() => this.slInvoice()}>????????????</Button>
                    </div>
                  </div>
                :
                  <Button type="default" key="cen" onClick={this.onCancel}>??????</Button>
              }
            </>
          )}
        >
          <InvoiceTable
            list={folderList}
            columns={columns}
            selectedRowKeys={selectedRowKeys}
            selectedRows={selectedRows}
            onSelect={this.onSelect}
            onSelectAll={this.onSelectAll}
            onSearch={this.onSearch}
            searchPro="?????????????????????????????????"
            total={folderPage.total}
            loading={loading}
            onQuery={this.onQuery}
            searchContent={searchContent}
            scroll={{x: '1250px'}}
            page={{
              pageNo: folderPage.pageNo,
              pageSize: folderPage.pageSize,
            }}
            btn={(
              <>
                <AddCost
                  costType={1}
                  onCallback={() => {
                    this.onQuery({ searchContent, pageNo: 1, pageSize: 5 });
                    this.props.onPerson();
                  }}
                  againCost
                >
                  <Button type='default' className="m-r-8">?????????</Button>
                </AddCost>
                <Button type='default' onClick={() => this.onDelete()} className="m-r-8">????????????</Button>
                {
                  officeList && officeList.length > 0 &&
                  <Select
                    placeholder="???????????????"
                    style={{width: '160px'}}
                    className="m-r-8"
                    onChange={val => this.onChangeOffice(val)}
                    allowClear
                    value={officeId || undefined}
                  >
                    {
                      officeList && officeList.map(it => (
                        <Select.Option key={it.id}>{it.officeName}</Select.Option>
                      ))
                    }
                    <Select.Option value={-1}>??????</Select.Option>
                  </Select>
                }
              </>
            )}
            production={(
              <span>
                ????????????{folderSum.totalCount ? folderSum.totalCount : 0}??????
                {folderSum.costSumStr ? folderSum.costSumStr : 0}
              </span>
            )}
          />
          <SelectInvoice
            selectInvoice={selectedRows}
            onHandle={() => this.onCancel()}
            onOk={this.props.onPerson}
            onCloseInvoice={() => this.onCancel()}
            visible={slVisible}
            onCancel={() => this.onChangeVisible()}
            onCallback={() => {
              this.setState({
                selectedRows: [],
                selectedRowKeys: [],
              });
              this.onQuery({ searchContent,
              pageNo: folderPage.pageNo,
              pageSize: folderPage.pageSize });
              this.props.onPerson();
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default CostFolder;
