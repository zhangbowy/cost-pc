import React, { useState } from 'react';
import { Modal, Radio } from 'antd';
import moment from 'moment';
import Line from './Line';
import Pie from './Pie';

function Chart({ children, data, type, onChart, chartList, dateType, startTime, chartName, changeMoney }) {
  console.log('Chart -> type', type);
  const [visible, setVisible] = useState(false);
  const [newArr, setNewArr] = useState([]);
  const [saveArr, setSaveArr] = useState([]);
  const [max, setMax] = useState(10);
  const [changeType, setChangeType] = useState(1);
  const [series, setSeries] = useState([]);
  console.log('chart', data);

  const onChangeTime = (types) => {
    const year = moment(startTime).format('YYYY');
    const month = moment(startTime).format('MM');
    const quarter = moment(startTime).quarter();
    let arr = [];
    //  月度
    if (dateType === 0) {
      if (types) {
        if (month === 1) {
          arr = [`${year}年${month}月`, `${year -1}年12月`, '环比增长'];
        } else {
          arr = [`${year}年${month}月`, `${year}年${month-1}月`, '环比增长'];
        }
      } else {
        arr = [`${year}年${month}月`, `${year-1}年${month}月`, '同比增长'];
      }
    } else if (dateType === 1) {
      if (types) {
        if (month === 1) {
          arr = [`${year}年第${quarter}季度`, `${year -1}年第四季度`, '环比增长'];
        } else {
          arr = [`${year}年第${quarter}季度`, `${year}年第${quarter-1}季度`, '环比增长'];
        }
      } else {
        arr = [`${year}年第${quarter}季度`, `${year-1}年第${quarter}季度`, '同比增长'];
      }
    } else if (dateType === 2) {
      if (types) {
        arr = [`${year}年`, `${year -1}年`, '环比增长'];
      } else {
        arr = [`${year}年`, `${year -1}年`, '环比增长'];
      }
    }
    return arr;
  };

  const onShow = async() => {
    const newArrs = [];
    if (type === 'project' || type === 'supplier') {
      onChart({
        projectId: data.projectId,
        projectType: data.projectType,
        supplierId: data.supplierId,
      });
    } else {
      newArrs.push({
        name: data[chartName],
        submitSum: Number((data.submitSum/changeMoney).toFixed(2)),
        submitSumAnnulus: Number((data.submitSumAnnulus/changeMoney).toFixed(2)),
        submitSumYear: Number((data.submitSumYear/changeMoney).toFixed(2)),
        annulus: data.submitSumAnnulus ?
        Number(((((data.submitSum - data.submitSumAnnulus) / data.submitSumAnnulus).toFixed(2)) * 100).toFixed(0))
        : 0,
        yearOnYear: data.submitSumYear ?
        Number(((((data.submitSum - data.submitSumYear) / data.submitSumYear).toFixed(2)) * 100).toFixed(0))
        :
        0,
      });
      if ((data && data.children.length) || (data.id === -1 && data.childrens.length)) {
        const childens = data.id === -1 ? data.childrens : data.children;
        childens.forEach(item => {
          if(item.submitSum) {
            newArrs.push({
              name: item[chartName],
              yearOnYear: item.yearOnYear, // 同比
              submitSumYear: data.submitSumYear/changeMoney,
              annulus: item.annulus, // 环比
              submitSum: Number((item.submitSum/changeMoney).toFixed(2)),
              submitSumAnnulus: Number((item.submitSumAnnulus/changeMoney).toFixed(2))
            });
          }
        });
      }
      const moneys = newArrs.map(it => it.submitSum);
      const newA = newArrs.map(it => it.submitSumAnnulus);
      const maxs = [...moneys, ...newA].sort(function (a, b) {
        return a-b;
      });
      console.log('onShow -> newArrs', newArrs);
      setMax(maxs[maxs.length - 1]);
    }

    setNewArr(newArrs);
    setSaveArr(newArrs);
    setSeries(onChangeTime(changeType));
    await setVisible(true);
  };

  const onchange = e => {
    setChangeType(e.target.value);
    if (e.target.value) {
      setNewArr(saveArr);
      setSeries(onChangeTime(e.target.value));
    } else {
      setNewArr([]);
      setSeries(onChangeTime(e.target.value));
    }
  };

  return (
    <div>
      <span onClick={() => onShow()}>{ children }</span>
      <Modal
        title={`${type === 'project' || type === 'supplier' ? '查看费用类别分布' : '查看趋势图'}`}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width="980px"
      >
        {
          type !== 'project' && type !== 'supplier' &&
            <Radio.Group value={changeType} onChange={(e) => onchange(e)}>
              <Radio.Button value={0}>同比</Radio.Button>
              <Radio.Button value={1}>环比</Radio.Button>
            </Radio.Group>
        }
        {
          type === 'project' || type === 'supplier' ?
            <Pie data={chartList} changeMoney={changeMoney} />
            :
            <Line data={newArr} max={max} changeType={changeType} series={series} changeMoney={changeMoney} />
        }
      </Modal>
    </div>
  );
}

export default Chart;
