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
    selectedRows.forEach(it => {
      arrs.push({
        id: it.id,
        applicationInvoiceId: it.applicationInvoiceId,
      });
      arrOffice.push(it.officeId);
      // TO DO:
      // 判断是否是同一个公司
    });
    const flag = arrOffice.filter(it => !it);
    if (flag && flag.length) {
      message.error('请先编辑填写分公司信息');
      return;
    }
    const arrsLen = Array.from(new Set(arrOffice));
    if (arrsLen.length !== 1) {
      message.error('请筛选同一分公司的明细进行报销');
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
          title: `该申请单还有${checkLinkCost.unassociatedCount}条明细，是否同步导入`,
          okText: '是',
          cancelText: '否',
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
      message.error('请勾选费用');
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
      title: '支出类别',
      dataIndex: 'categoryName',
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
          <span style={{verticalAlign: 'middle'}}>{record.categoryName}</span>
          {
            record.showAlitripIcon &&
            <img src={aliLogo} alt="阿里商旅" style={{ width: '18px', height: '18px',marginLeft: '8px' }} />
          }
        </span>
      ),
      width: '180px'
    }, {
      title: '金额（元）',
      dataIndex: 'costSum',
      render: (_, record) => (
        <span>
          <span className={record.costDetailShareVOS && record.costDetailShareVOS.length > 0 ? '' : 'm-r-72'}>{record.currencySumStr ?  `${record.costSumStr}(${record.currencySumStr})`: record.costSumStr}</span>
          {
            record.costDetailShareVOS && record.costDetailShareVOS.length > 0 &&
            <Popover
              content={(
                <div className={style.share_cnt}>
                  <p key={record.id} className="c-black-85 fs-14 fw-500 m-b-8">分摊明细：金额 ¥{record.costSum/100}{record.currencySumStr ? `(${record.currencySumStr})` : ''}</p>
                  {
                    record.costDetailShareVOS.map(it => (
                      <p key={it.id} className="c-black-36 fs-13">
                        <span className="m-r-8">{it.userName ? `${it.userName}/` : ''}{it.deptName}</span>
                        {
                          it.projectName &&
                          <span className="m-r-8">{it.projectName}</span>
                        }
                        <span>¥{it.shareAmount/100}{it.currencySumStr ? `(${it.currencySumStr})` : ''}</span>
                      </p>
                    ))
                  }
                </div>
              )}
            >
              <Tag className="m-l-8" style={{marginRight: '0px'}}>分摊明细</Tag>
            </Popover>
          }
        </span>
      ),
      className: 'moneyTagCol',
      width: '180px'
    }, {
      title: '发生日期',
      dataIndex: 'happenTime',
      width: '150px',
      render: (_, record) => (
        <span>
          <span>{record.startTime ? moment(Number(record.startTime)).format('YYYY-MM-DD') : '-'}</span>
          <span>{record.endTime ? `-${moment(Number(record.endTime)).format('YYYY-MM-DD')}` : ''}</span>
        </span>
      )
    }, {
      title: '备注',
      dataIndex: 'note',
      ellipsis: true,
      width: '100px',
      render: (text) => (
        <Tooltip placement="topLeft" title={text || ''}>
          <span>{text}</span>
        </Tooltip>
      )
    }, {
      title: '图片',
      dataIndex: 'imgUrl',
      render: (_, record) => (
        <span className={record.imgUrl && (record.imgUrl.length > 0) ? style.imgScroll : style.imgUrlTable}>
          {record.imgUrl && record.imgUrl.map((it, index) => (
            <div className="m-r-8" onClick={() => this.previewImage(record.imgUrl, index)}>
              <img alt="图片" src={it.imgUrl} className={style.images} />
            </div>
          ))}
        </span>
      ),
      textWrap: 'word-break',
      width: '140px'
    }, {
      title: '操作',
      dataIndex: 'opea',
      render: (_, record) => (
        <span>
          <Popconfirm
            title="确认删除吗？"
            onConfirm={() => this.onDelete(record.id)}
          >
            <span className="deleteColor">删除</span>
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
            <a>编辑</a>
          </AddCost>
        </span>
      ),
      className: 'fixCenter',
      fixed: 'right',
      width: 120,
    }];
    if (officeList && officeList.length) {
      columns.splice(2,0, {
        title: '分公司',
        dataIndex: 'officeName',
        width: 120,
        render: (text) => (
          <span>{text || '-'}</span>
        )
      });
    }
    return (
      <div>
        <div onClick={() => this.onShow()}>{this.props.children}</div>
        <Modal
          title="账本"
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
                    {/* <Button type="default" key="cancel" onClick={this.onCancel}>取消</Button> */}
                    <div>
                      <span className="fs-15 c-black-85 m-r-8">
                        已选{selectedRowKeys.length}笔 合计¥
                        <span className="fs-20 fw-500">{money}</span>
                      </span>
                      <Button type="primary" onClick={() => this.slInvoice()}>发起报销</Button>
                    </div>
                  </div>
                :
                  <Button type="default" key="cen" onClick={this.onCancel}>取消</Button>
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
            searchPro="请输入支出类别名称搜索"
            total={folderPage.total}
            loading={loading}
            onQuery={this.onQuery}
            searchContent={searchContent}
            scroll={{x: '1120px'}}
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
                  <Button type='default' className="m-r-8">记一笔</Button>
                </AddCost>
                <Button type='default' onClick={() => this.onDelete()} className="m-r-8">批量删除</Button>
                {
                  officeList && officeList.length > 0 &&
                  <Select
                    placeholder="请选择公司"
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
                    <Select.Option value={-1}>其他</Select.Option>
                  </Select>
                }
              </>
            )}
            production={(
              <span>
                账本共计{folderSum.totalCount ? folderSum.totalCount : 0}笔，
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
