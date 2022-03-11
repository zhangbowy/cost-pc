import React, { useState } from 'react';
import moment from 'moment';
import { Modal, Table, Tooltip, Select, Spin} from 'antd';
import Search from 'antd/lib/input/Search';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import aliLogo from '@/assets/img/aliTrip/aliLogo.png';
import style from './index.scss';
import Chart from './Chart';
import xzcLogo from '@/assets/img/aliTrip/xzcLogo.png';
import znxcLogo from '@/assets/img/aliTrip/znxcLogo.png';

const exportKey = {
  1: [{
    key: '0',
    value: '部门',
  }, {
    key: '1',
    value: '类别',
  }, {
    key: '2',
    value: '项目',
  }],
  2: [{
    key: '0',
    value: '部门',
  }, {
    key: '1',
    value: '类别',
  }, {
    key: '2',
    value: '项目',
  }],
  3: [{
    key: '1',
    value: '类别',
  }, {
    key: '5',
    value: '人员',
  }],
  5: [{
    key: '1',
    value: '类别',
  }, {
    key: '5',
    value: '人员',
  }],
  6: [{
    key: '1',
    value: '类别',
  }, {
    key: '5',
    value: '人员',
  }],
  4: [{
    key: '1',
    value: '类别',
  }, {
    key: '2',
    value: '项目',
  }]
};
const { Option } = Select;
function InvoicePrice({ children, onQuery, id, title,
   projectType, pageDetail, currentType, isDeptSelf }) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [pieChart, setPieChart] = useState(currentType === 1 ? '0' : '1');
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [chartList, setChartList] = useState([]);
  const [query, setQuery] = useState('0');
  const [tableLoading, setTableLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const columns = [{
      title: '序号',
      dataIndex: 'index',
      width: 80,
      render: (_, record, index) => (
        <span>
          {index+1}
        </span>
      ),
    }, {
      title: '支出类别',
        dataIndex: 'costCategoryName',
        width: 150,
        ellipsis: true,
        textWrap: 'word-break',
        render: (text) => (
          <Tooltip title={text || ''} placement="topLeft">
            {text}
          </Tooltip>
        )
    }, {
      title: '金额(元)',
      dataIndex: 'submitSum',
      render: (text) => (
        <span>{text && text / 100}</span>
      ),
      className: 'moneyCol',
      width: 120,
    }, {
    title: '事由',
      dataIndex: 'reason',
      ellipsis: true,
      textWrap: 'word-break',
      width: 150,
      render: (_, record) => (
        <InvoiceDetail
          id={record.invoiceSubmitId}
          templateType={record.templateType === 9 ? record.oldTemplateType : record.templateType}
        >
          <span>
            <Tooltip placement="topLeft" title={record.reason || ''}>
              <a className="eslips-2">
                {record.reason.length > 6 ? `${record.reason.substring(0, 6)}...` : record.reason}
              </a>
            </Tooltip>
          </span>
        </InvoiceDetail>
      ),
    }, {
      title: '项目',
      dataIndex: 'projectName',
      width: 150,
      render: (_, record) => (
        <span>
          <Tooltip placement="topLeft" title={record.projectName || ''}>
            <span className="eslips-1">{record.projectName}</span>
          </Tooltip>
        </span>
      ),
    },  {
      title: '承担人',
      dataIndex: 'userName',
      width: 150,
    }, {
      title: '承担部门',
      dataIndex: 'deptName',
      width: 180,
    },{
      title: '单号',
      dataIndex: 'invoiceNo',
      width: list.isAssetsImport ? 230:180,
      render: (_, record) => (
        <span>
          <span>{record.invoiceNo}</span>
          {
            record.thirdPlatformType===0 &&
            <img src={aliLogo} alt="阿里商旅" style={{ width: '18px', height: '18px',marginLeft: '8px' }} />
          }
          {
            record.thirdPlatformType===2 &&
              <>
                {/* <Tag color="blue">
                  <i className="iconfont iconxinzichan" style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                  <span>鑫资产</span>
                </Tag> */}
                <img src={xzcLogo} alt="鑫资产" style={{ width: '16px', height: '16px',marginLeft: '8px',verticalAlign:'text-bottom'}} />
              </>
          }
          {
            record.thirdPlatformType===3 &&
              <>
                <img src={znxcLogo} alt="智能薪酬" style={{ width: '16px', height: '16px',marginLeft: '8px',verticalAlign:'text-bottom'}} />
              </>
          }
        </span>
      )
    }, {
      title: '单据类型',
      dataIndex: 'invoiceTemplateName',
      width: 160,
    }, {
      title: '提交人',
      dataIndex: 'createName',
      width: 150,
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (_, record) => (
        <span>{record.createTime ? moment(record.createTime).format('YYYY-MM-DD') : '-'}</span>
      ),
      width: 150,
    }];

    const onNewQuery = async(payload) => {
      let result = {};
      Object.assign(payload, {
        isDeptSelf
      });
      if (payload.isTurnPage) {
        result = await pageDetail(payload);
      } else {
        result = await onQuery(payload);
      }
      setTableLoading(false);
      setChartLoading(false);
      // detailList, pieChartVos, listQuery, listTotal 返回参数
      if (result.detailList) setList(result.detailList);
      if (result.pieChartVos) setChartList(result.pieChartVos);
      if (result.listQuery) setQuery(result.listQuery);
      if (result.listTotal) setTotal(result.listTotal);
    };

    const onSearch = (e) => {
      setSearch(e);
      setTableLoading(true);
      onNewQuery({ pageNo: 1, pageSize: 10, id, projectType, searchContent: e, pieChart, isDeptSelf });
    };

    const onChange = val => {
      setPieChart(val);
      setTableLoading(true);
      setChartLoading(true);
      onNewQuery({ pageNo: 1, pageSize: 10, id, projectType, searchContent: search, pieChart: val, isDeptSelf });
    };
  return (
    <span>
      <span
        onClick={() => {
          setTableLoading(true);
          setChartLoading(true);
          onNewQuery({ pageNo: 1, pageSize: 10, id, projectType, pieChart });
          setVisible(true);
        }}
      >
        { children }
      </span>
      <Modal
        title={title}
        visible={visible}
        onCancel={() => { setSearch('');setVisible(false); }}
        footer={null}
        width="980px"
        bodyStyle={{
          height: '573px',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', height: '100%' }}>
          <div className={style.chartLeft}>
            <div className={style.chartLeftTop}>
              <div className={style.chartLeftTopL}>
                <p className="fs-16 c-black-85 fw-500">支出分布</p>
                <p className="c-black-36 fs-12">默认展示费用不为零的Top 10类别</p>
              </div>
              <Select
                style={{ width: '88px' }}
                onChange={v => onChange(v)}
                value={pieChart}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {
                  exportKey[currentType] && exportKey[currentType].map(it => (
                    <Option key={it.key}>{it.value}</Option>
                  ))
                }
              </Select>
            </div>
            <Spin spinning={chartLoading}>
              <Chart
                data={chartList}
                total={total}
                fileName={{
                  name: 'dimensionName',
                  price: 'costSum'
                }}
              />
            </Spin>
          </div>
          <div className={style.chartRight}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="fs-16 c-black-85 fw-500" style={{ lineHeight: '32px' }}>支出明细</p>
              <Search
                placeholder="请输入单号、事由、收款人"
                style={{ width: '292px',marginRight:'20px', marginBottom: '16px' }}
                onSearch={(e) => onSearch(e)}
                value={search}
                onInput={e => setSearch(e.target.value)}
              />
            </div>
            <Table
              dataSource={list}
              columns={columns}
              rowKey="id"
              scroll={{y: '380px', x: '1620px'}}
              loading={tableLoading}
              onChange={(page, filter) => {
                const { current, pageSize } = page;
                onNewQuery({
                  id,
                  pageNo: current,
                  pageSize,
                  ...filter,
                  projectType,
                  searchContent: search,
                  pieChart,
                  isTurnPage: true,
                });
              }}
              pagination={{
                current: query.pageNo,
                hideOnSinglePage: true,
                total: query.total,
                size: 'small',
                showTotal: () => (`共${query.total}条数据`),
                showSizeChanger: true,
                showQuickJumper: true,
              }}
            />
          </div>
        </div>
      </Modal>
    </span>
  );
}

export default InvoicePrice;
