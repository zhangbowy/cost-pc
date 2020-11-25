/**
 * Routes:
 *  - src/components/PrivateRoute
 * auth: AUTHID
 */

import React, { PureComponent } from 'react';
import { Table, Divider, Modal, Button, Message, Icon } from 'antd';
import { connect } from 'dva';
import getDateUtil from '@/utils/tool';
import MenuItems from '@/components/AntdComp/MenuItems';
import { batchStatus, invoiceStatus } from '@/utils/constants';
import Search from 'antd/lib/input/Search';
import style from './index.scss';
import StepShow from '../../../components/StepShow';
// import PayModal from '../invoicePay/components/payModal';
import PayModal from './components/payModal';
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
        value = '待支付';
         break;
      case 2:
        value = '处理中';
        break;
      case 3:
        value = '待处理';
        break;
      case 4:
        value = '已关闭';
        break;
      case 5:
        value = '已支付';
        break;
      default:
        value = '无';
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
      Message.success('取消成功');
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
      title: '付款批次',
      dataIndex: 'outBatchNo',
      width: 200,
    }, {
      title: '总金额',
      dataIndex: 'totalTransAmount',
      render: (text) => (
        <span>{text && text / 100}</span>
      ),
      className: 'moneyCol',
      width: 160,
    }, {
      title: '单据数量',
      dataIndex: 'totalCount',
      width: 120,
      className: 'moneyCol',
      render: (text, record) => (
        <Button style={{padding: '0'}} type="link" onClick={() => {this.openCost(record,false);}}>{text}</Button>
      )
    }, {
      title: '支付状态',
      dataIndex: 'status',
      render: (text) => (
        <span>
          <span>{this.getStatusValue(text, invoiceStatus)}</span>
        </span>
      ),
      width: 100,
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (_, record) => (
        <span>{record.createTime ? getDateUtil(record.createTime,'yyyy-MM-dd hh:mm:ss') : '-'}</span>
      ),
      width: 200,
    }];
    if(status === '3'){
      columns.splice(3,0, {
        title: '失败总金额',
        dataIndex: 'failTransAmount',
        render: (text) => (
          <span>{text && text / 100}</span>
        ),
        className: 'moneyCol',
        width: 160,
      }, {
        title: '失败单据',
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
        title: '操作',
        dataIndex: 'ope',
        render: (_, record) => (
          <span>
            {status === '3' &&
              <PayModal selectKey={[record]} onOk={() => this.onOk()} templateType={1}>
                <a style={{padding: '0'}} type="link" >发起支付</a>
              </PayModal>}
            {status === '1' &&
              <ComfirmPay 
                dispatch={this.props.dispatch} 
                selectKey={record}
                onOk={() => this.onOk()} 
                close={this.closeComfirmPay}
                templateType={0}
              >
                <a style={{padding: '0'}} type="link" onClick={this.resetPay} >发起支付</a>
              </ComfirmPay>}
            <Divider type="vertical" />
            <a style={{padding: '0'}} type="link" onClick={() => this.batchCancel(record)} >取消</a>
          </span>
        ),
        width: 200,
        fixed: 'right',
        className: 'fixCenter'
      });
    }else{
      columns.splice(columns.length-1,0,{
        title: '发放人',
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
                  <Button style={{padding: 0}} onClick={this.onOk} type="link" className={style.reload}><Icon type="sync" />刷新</Button>
                  <MenuItems
                    lists={batchStatus}
                    onHandle={(val) => this.handleClick(val)}
                    status="3"
                  />
                </div>
                <div style={{ margin: '0 32px' }}>
                  <div className="m-b-16">
                    {/* <Button>导出</Button>
                    <Button className="m-l-8">打印</Button> */}
                    <Search
                      placeholder="请输入付款批次"
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
                      showTotal: () => (`共${total}条数据`),
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
          title={costStatus?'失败单据明细':'单据明细'}
          onCancel={this.onCancel}
          bodyStyle={{
            padding: 0,
            height: '342px',
            overflowY: 'scroll',
          }}
          footer={[
            <Button key="cancel" onClick={() => this.onCancel()}>关闭</Button>,
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
          //   <Button key="save" type="primary" onClick={() => this.configCancel()}>确定取消</Button>
          // ]}
          width='580px'
        >
          <h1 className="fs-24 c-black-85 m-b-16">取消支付</h1>
          <div className={style.modalTit}>
            本次取消{ valueObj.failCount || valueObj.totalCount }条单据的支付，共计
            <span style={{fontSize:'20px',fontWeight:'500'}}>{ (valueObj.failTransAmount && valueObj.failTransAmount/100) || valueObj.totalTransAmount/100 }</span>元
          </div>
          <div className={style.modalText} style={{marginTop:'20px'}}>
            取消后，单据将释放回待发放单据列表
          </div>
          <div style={{ marginTop: '70px' }}>
            <Button key="save" type="primary" onClick={() => this.configCancel()}>确定</Button>
          </div>
        </Modal>
        <Modal
          visible={payVisible}
          title={costStatus?'失败单据明细':'单据明细'}
          onCancel={this.onCancel}
          bodyStyle={{
            padding: 0,
            height: '360px',
            overflowY: 'scroll',
          }}
          footer={[
            <Button key="cancel" onClick={() => this.setState({payVisible: false})}>关闭</Button>,
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
