// 固定字段
export default {
  dateType: [{key: '0_m', value: '本月' },
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
  { key: 1, value: '成本支出'}]
};
