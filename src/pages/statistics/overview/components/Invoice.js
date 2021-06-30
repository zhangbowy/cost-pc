import React, { useState } from 'react';
import moment from 'moment';
import { Modal, Table, Tooltip, Select } from 'antd';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import Search from 'antd/lib/input/Search';
import { getArrayValue, invoiceStatus } from '@/utils/constants';
import style from './index.scss';
import Chart from './Chart';

const selects = [{
  key: '0',
  value: '部门',
}, {
  key: '1',
  value: '类别',
}, {
  key: '2',
  value: '项目',
}];
const { Option } = Select;
function InvoicePrice({ children, detailList, onQuery, id, query, total, projectType, pageDetail, chartList }) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [pieChart, setPieChart] = useState('0');

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
    title: '事由',
      dataIndex: 'reason',
      width: 150,
      render: (_, record) => (
        <InvoiceDetail id={record.invoiceSubmitId} templateType={0}>
          <span>
            <Tooltip placement="topLeft" title={record.reason || ''}>
              <a className="eslips-2">{record.reason}</a>
            </Tooltip>
          </span>
        </InvoiceDetail>
      ),
    }, {
      title: '金额(元)',
      dataIndex: 'submitSum',
      render: (text) => (
        <span>{text && text / 100}</span>
      ),
      className: 'moneyCol',
      width: 140,
    }, {
      title: '单号',
      dataIndex: 'invoiceNo',
      width: 160,
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
    }, {
      title: '单据状态',
      dataIndex: 'statusStr',
      width: 100,
      render: (_, record) => (
        <span>{record.statusStr || getArrayValue(record.status, invoiceStatus)}</span>
      ),
      fixed: 'right',
    }];
    const onSearch = (e) => {
      setSearch(e);
      pageDetail({ pageNo: 1, pageSize: 10, deptId: id, projectType, searchContent: e, pieChart });
    };

    const onChange = val => {
      setPieChart(val);
      onQuery({ pageNo: 1, pageSize: 10, deptId: id, projectType, searchContent: search, pieChart: val });
    };
  return (
    <span>
      <span onClick={() => {
        console.log(onQuery);
        onQuery({ pageNo: 1, pageSize: 10, deptId: id, projectType, pieChart });
        setVisible(true);  }}
      >
        { children }
      </span>
      <Modal
        title="单据列表"
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
                <p className="fs-16 c-black-85 fw-500">支出分部</p>
                <p className="c-black-36 fs-12">默认展示费用不为零的Top 10类别</p>
              </div>
              <Select
                style={{ width: '88px' }}
                onChange={v => onChange(v)}
                value={pieChart}
              >
                {
                  selects.map(it => (
                    <Option key={it.key}>{it.value}</Option>
                  ))
                }
              </Select>
            </div>
            <Chart
              data={chartList}
              total={0}
              fileName={{
                name: 'dimensionName',
                price: 'costSum'
              }}
            />
          </div>
          <div className={style.chartRight}>
            <Search
              placeholder="请输入单号、事由、收款账户名称"
              style={{ width: '292px',marginRight:'20px', marginBottom: '16px' }}
              onSearch={(e) => onSearch(e)}
              value={search}
              onInput={e => setSearch(e.target.value)}
            />
            <Table
              dataSource={detailList}
              columns={columns}
              rowKey="invoiceSubmitId"
              scroll={{y: '280px', x: '1090px'}}
              onChange={(page, filter) => {
                const { pageNumber } = page;
                console.log('onChange');
                pageDetail({
                  pageNo: pageNumber,
                  pageSize: query.pageSize,
                  ...filter,
                  id,
                  projectType,
                  searchContent: search,
                  pieChart,
                  isTurnPage: true,
                });
              }}
              pagination={{
                current: query.pageNo,
                hideOnSinglePage: true,
                total,
                size: 'small',
                showTotal: () => (`共${total}条数据`),
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
