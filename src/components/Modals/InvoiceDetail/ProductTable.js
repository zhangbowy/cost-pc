import React from 'react';
import PropTypes from 'prop-types';
import { Table, Tooltip } from 'antd';
import moment from 'moment';

function ProductTable(props) {
  const columns = props.cols.map(it => {
    return ({
      title: it.name,
      dataIndex: it.field,
      render: (_, record) => {
        let str = it.field === 'detail_money' || it.field === 'detail_sale' ?
        record[it.field]/100 : record[it.field];
        if (it.fieldType === 5 && record[it.field]) {
          if (it.dateType === 1) {
            str = moment(Number(record[it.field])).format('YYYY-MM-DD');
          } else {
            const st = record[it.field].split('~');
            console.log('ProductTable -> st', st);
            str = `${moment(Number(st[0])).format('YYYY-MM-DD')}-${moment(Number(st[1])).format('YYYY-MM-DD')}`;
          }
        }
        return (
          <>
            {
              str ?
                <span>
                  <Tooltip placement="topLeft" title={str || ''}>
                    <span className="eslips-2">{str}</span>
                  </Tooltip>
                </span>
                :
                <span>
                  -
                </span>
            }
          </>
        );
      }
    });
  });
  return (
    <div>
      <Table
        dataSource={props.list}
        columns={columns}
        pagination={false}
        scroll={{y: '500px'}}
      />
    </div>
  );
}

ProductTable.propTypes = {
  cols: PropTypes.array,
  list: PropTypes.array
};

export default ProductTable;

