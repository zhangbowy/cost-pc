/**
 * Routes:
 *  - src/components/PrivateRoute
 * auth: AUTHID
 */

import React, { PureComponent } from 'react';
import { Table, Divider, Modal, Button, Message, Icon } from 'antd';
import { connect } from 'dva';
import Search from 'antd/lib/input/Search';
import getDateUtil from '@/utils/tool';
import MenuItems from '@/components/AntdComp/MenuItems';
import { batchStatus, invoiceStatus } from '@/utils/constants';
import style from './index.scss';
import StepShow from '../../../components/StepShow';
// import PayModal from '../invoicePay/components/payModal';
import PayModal from './components/PayModal';
import ComfirmPay from './components/ComfirmPay';
import CostTable from './components/CostTable';

@connect(({ loading, batch, session }) => ({
  loading: loading.effects['batch/list'] || false,
  list: batch.list,
  query: batch.query,
  OftenTemplate: batch.OftenTemplate,
  UseTemplate: batch.UseTemplate,
  total: batch.total,
  userInfo: session.userInfo,
  detailList: batch.detailList
}))
class Batch extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      status: '3',
      search: '',
      huaVisible: false,
      costStatus:0,
      payVisible: false,
      cancelVisible: false,
      valueObj:{},
    };
  }

  componentDidMount() {
    this.onQuery({
      status: '3',
      pageNo: 1,
      pageSize: 10,
    });
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'batch/list',
      payload,
    });
  }

  onHandleOk = () => {
    const { status, search } = this.state;
    const { query } = this.props;
    this.onQuery({
      search,
      status: status === '0' ? '' : status,
      ...query,
    });
  }

  onSearch = (val) => {
    const { status } = this.state;
    const { query } = this.props;
    this.setState({
      search: val,
    });
    this.onQuery({
      search: val,
      status: status === '0' ? '' : status,
      ...query,
    });
  }

  handleClick = val => {
    const { query } = this.props;
    this.setState({
      status: val,
    });
    this.onQuery({
      ...query,
      status: val === '0' ? '' : val,
      pageNo: 1,
    });
  };

  openCost = (val,isfail) => {
    const status = isfail?2:'';
    this.props.dispatch({
      type: 'batch/detailList',
      payload: {
        status,
        batchOrderId: val.id
      }
    }).then(() => {
      console.log('detailList======',this.props.detailList);
      this.setState({ huaVisible: true, costStatus: status });
    });
  }

  onCancel = () => {
    this.setState({ huaVisible: false });
  }

  getStatusValue = val => {
    let value = '';
    switch(val) {
      case 1:
        value = '?????????';
         break;
      case 2:
        value = '?????????';
        break;
      case 3:
        value = '?????????';
        break;
      case 4:
        value = '?????????';
        break;
      case 5:
        value = '?????????';
        break;
      default:
        value = '???';
    }
    return value;
  }

  batchCancel = (val) => {
    this.setState({ valueObj: val, cancelVisible: true });
  }

  configCancel =() => {
    const { valueObj, status } = this.state;
    this.props.dispatch({
      type: 'batch/close',
      payload: {
        outBatchNo: valueObj.outBatchNo
      }
    }).then(() => {
      this.setState({ cancelVisible: false });
      this.onQuery({
        status,
        pageNo: 1,
        pageSize: 10,
      });
      Message.success('????????????');
    });
  }

  resetPay = () => {
    // this.setState({showComfirmPay: true});
  }

  closeComfirmPay = () => {
    // this.setState({showComfirmPay: false});
  }

  onOk =() => {
    const { status } = this.state;
    const { query } = this.props;
    this.onQuery({
      status: status === '0' ? '' : status,
      ...query,
    });
  }

  render() {
    const { list, total, query, userInfo, loading, detailList } = this.props;
    const { huaVisible ,status, costStatus, payVisible, cancelVisible, valueObj } = this.state;
    const columns = [{
      title: '????????????',
      dataIndex: 'outBatchNo',
      width: 200,
    }, {
      title: '?????????',
      dataIndex: 'totalTransAmount',
      render: (text) => (
        <span>{text && text / 100}</span>
      ),
      className: 'moneyCol',
      width: 160,
    }, {
      title: '????????????',
      dataIndex: 'totalCount',
      width: 120,
      className: 'moneyCol',
      render: (text, record) => (
        <Button style={{padding: '0'}} type="link" onClick={() => {this.openCost(record,false);}}>{text}</Button>
      )
    }, {
      title: '????????????',
      dataIndex: 'status',
      render: (text) => (
        <span>
          <span>{this.getStatusValue(text, invoiceStatus)}</span>
        </span>
      ),
      width: 100,
    }, {
      title: '????????????',
      dataIndex: 'createTime',
      render: (_, record) => (
        <span>{record.createTime ? getDateUtil(record.createTime,'yyyy-MM-dd HH:mm:ss') : '-'}</span>
      ),
      width: 200,
    }];
    if(status === '3'){
      columns.splice(3,0, {
        title: '???????????????',
        dataIndex: 'failTransAmount',
        render: (text) => (
          <span>{text && text / 100}</span>
        ),
        className: 'moneyCol',
        width: 160,
      }, {
        title: '????????????',
        dataIndex: 'failCount',
        className: 'moneyCol',
        width: 120,
        render: (text, record) => (
          <Button style={{padding: '0'}} type="link" onClick={() => {this.openCost(record,true);}}>{text}</Button>
        )
      });
    }
    if(status !== '0'){
      columns.push({
        title: '??????',
        dataIndex: 'ope',
        render: (_, record) => (
          <span>
            {status === '3' &&
              <PayModal selectKey={[record]} onOk={() => this.onOk()} templateType={1}>
                <a style={{padding: '0'}} type="link" >????????????</a>
              </PayModal>}
            {status === '1' &&
              <ComfirmPay
                dispatch={this.props.dispatch}
                selectKey={record}
                onOk={() => this.onOk()}
                close={this.closeComfirmPay}
                templateType={0}
              >
                <a style={{padding: '0'}} type="link" onClick={this.resetPay} >????????????</a>
              </ComfirmPay>}
            <Divider type="vertical" />
            <a style={{padding: '0'}} type="link" onClick={() => this.batchCancel(record)} >??????</a>
          </span>
        ),
        width: 200,
        fixed: 'right',
        className: 'fixCenter'
      });
    }else{
      columns.splice(columns.length-1,0,{
        title: '?????????',
        dataIndex: 'grantUserName',
        width: 150,
      });
    }
    return (
      <div className="content-dt" style={{ padding: 0 }}>
        {
          userInfo.isSupperAdmin && (localStorage.getItem('initShow') !== 'true') ?
            <StepShow {...this.props} userInfo={userInfo} />
            :
            <>
              <div>
                <div style={{ marginBottom: '24px',position: 'relative' }}>
                  <Button style={{padding: 0}} onClick={this.onOk} type="link" className={style.reload}><Icon type="sync" />??????</Button>
                  <MenuItems
                    lists={batchStatus}
                    onHandle={(val) => this.handleClick(val)}
                    status="3"
                  />
                </div>
                <div style={{ margin: '0 32px' }}>
                  <div className="m-b-16">
                    {/* <Button>??????</Button>
                    <Button className="m-l-8">??????</Button> */}
                    <Search
                      placeholder="?????????????????????"
                      style={{ width: '272px' }}
                      onSearch={(e) => this.onSearch(e)}
                    />
                  </div>
                  <Table
                    columns={columns}
                    dataSource={list}
                    rowKey="id"
                    tableLayout="fixed"
                    scroll={{ x: columns.length>6?1300:0 }}
                    loading={loading}
                    pagination={status==='0'?{
                      current: query.pageNo,
                      onChange: (pageNumber) => {
                        const { search } = this.state;
                        this.onQuery({
                          pageNo: pageNumber,
                          pageSize: query.pageSize,
                          status: Number(status) === 0 ? '' : status,
                          search,
                        });
                      },
                      total,
                      size: 'small',
                      showTotal: () => (`???${total}?????????`),
                      showSizeChanger: true,
                      showQuickJumper: true,
                      onShowSizeChange: (cur, size) => {
                        const { search } = this.state;
                        this.onQuery({
                          status: status === '0' ? '' : status,
                          search,
                          pageNo: cur,
                          pageSize: size
                        });
                      }
                    }:false}
                  />
                </div>
              </div>
            </>
        }
        <Modal
          visible={huaVisible}
          title={costStatus?'??????????????????':'????????????'}
          onCancel={this.onCancel}
          bodyStyle={{
            padding: 0,
            height: '342px',
            overflowY: 'scroll',
          }}
          footer={[
            <Button key="cancel" onClick={() => this.onCancel()}>??????</Button>,
          ]}
          width='980px'
        >
          <CostTable status={costStatus} list={detailList}  />
        </Modal>
        <Modal
          visible={cancelVisible}
          onCancel={() => this.setState({cancelVisible: false})}
          title={null}
          footer={null}
          bodyStyle={{
            height: '300px',
            padding: '38px 40px'
          }}
          // footer={[
          //   <Button key="save" type="primary" onClick={() => this.configCancel()}>????????????</Button>
          // ]}
          width='580px'
        >
          <h1 className="fs-24 c-black-85 m-b-16">????????????</h1>
          <div className={style.modalTit}>
            ????????????{ valueObj.failCount || valueObj.totalCount }???????????????????????????
            <span style={{fontSize:'20px',fontWeight:'500'}}>{ (valueObj.failTransAmount && valueObj.failTransAmount/100) || valueObj.totalTransAmount/100 }</span>???
          </div>
          <div className={style.modalText} style={{marginTop:'20px'}}>
            ???????????????????????????????????????????????????
          </div>
          <div style={{ marginTop: '70px' }}>
            <Button key="save" type="primary" onClick={() => this.configCancel()}>??????</Button>
          </div>
        </Modal>
        <Modal
          visible={payVisible}
          title={costStatus?'??????????????????':'????????????'}
          onCancel={this.onCancel}
          bodyStyle={{
            padding: 0,
            height: '360px',
            overflowY: 'scroll',
          }}
          footer={[
            <Button key="cancel" onClick={() => this.setState({payVisible: false})}>??????</Button>,
          ]}
          width='980px'
        >
          <CostTable status={costStatus} list={detailList}  />
        </Modal>
      </div>
    );
  }
}

export default Batch;
