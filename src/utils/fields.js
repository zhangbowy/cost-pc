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
  }],
  // 费用标准
  chargeType: {
    0: {
      name: '飞机',
      key: '0',
      fields: ['航班舱型'],
    },
    1: {
      name: '火车',
      key: '1',
      fields: ['火车席位'],
    },
    2: {
      name: '住宿',
      key: '2',
      fields: ['发生日期（时间段）', '消费城市'],
      options: '晚',
      amountUnitType: 2
    },
    3: {
      name: '打车',
      key: '3',
      fields: ['发生日期（单日）'],
      options: [{
        name: '次',
        key: '0',
      }, {
        name: '月',
        key: '1',
      }],
      amountUnitType: 0
    },
    4: {
      name: '补贴',
      key: '4',
      fields: ['发生日期(时间段)'],
      options: '天',
      amountUnitType: 3
    },
    5: {
      name: '招待',
      key: '5',
      fields: ['招待人数'],
      options: '人',
      amountUnitType: 4
    }
  },
  // 超标类型
  highType: {
    0: {
      name: '允许报销，需填写超标理由',
      key: '0'
    },
    1: {
      name: '允许报销，需关联申请单',
      key: '1'
    },
    2: {
      name: '不允许报销',
      key: '2'
    },
  },
  trainLevels: {
    0: {
      name: '硬座',
      key: '0'
    },
    1: {
      name: '软座',
      key: '1'
    },
    2: {
      name: '硬卧',
      key: '2'
    },
    3: {
      name: '软卧',
      key: '3'
    },
    4: {
      name: '高级软卧',
      key: '4'
    },
    5: {
      name: '动卧',
      key: '5'
    },
    6: {
      name: '二等座',
      key: '6'
    },
    7: {
      name: '一等座',
      key: '7'
    },
    8: {
      name: '商务座',
      key: '8'
    },
  },
  flightLevels: {
    0: {
      name: '经济舱',
      key: '0'
    },
    1: {
      name: '商务舱',
      key: '1'
    },
    2: {
      name: '头等舱',
      key: '2'
    },
  }
};
