import train from '../assets/img/aliTrip/train.png';
import plant from '../assets/img/aliTrip/plant.png';
import car from '../assets/img/aliTrip/car.png';
import other from '../assets/img/aliTrip/other.png';

// 固定字段
export default {
  dateType: [{key: '0_m', value: '本月' }, // 日期格式
  { key: '-1_m', value: '上月' },
  { key: '0_q', value: '本季度' },
  { key: '-1_q', value: '上季度' },
  { key: '0_y', value: '本年' },
  { key: '-1_y', value: '上年' },
  { key: '-1', value: '自定义' }],
  monthType: [{ key: '3_cm', value: '最近3个月' },
  { key: '6_cm', value: '最近6个月' },
  { key: '1_cy', value: '最近1年' },
  { key: '-1', value: '自定义' }],
  costType: [{ key: 0, value: '费用支出'},
  { key: 1, value: '成本支出'}],
  projectType: [{
    key: '1',
    value: '我负责的'
  }, {
    key: '2',
    value: '我参与的项目'
  }, {
    key: '3',
    value: '我团队的项目'
  }],
  aliTraffic: [{
    value: '0',
    label: '飞机',
    icon: plant
  }, {
    value: '1',
    label: '火车',
    icon: train
  }, {
    value: '2',
    label: '汽车',
    icon: car
  }, {
    value: '3',
    label: '其他',
    icon: other
  }],
  aliWay: [{
    value: '0',
    label: '单程'
  }, {
    value: '1',
    label: '往返'
  }]
};
