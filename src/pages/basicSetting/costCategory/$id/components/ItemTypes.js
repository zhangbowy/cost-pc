export const ItemTypes = {
  CARD: 'card',
};

export const aliTrip =  [
  {
      'dateType': 0,
      'expandFieldVos': [
          {
              'dateType': 0,
              'expandFieldVos': [],
              'field': 'trip_traffic',
              'fieldType': 2,
              'isModify': false,
              'isWrite': true,
              'name': '交通工具',
              'note': '',
              'options': ['飞机','火车','汽车','其他'],
              'sort': 1,
              'status': 1
          },
          {
              'dateType': 0,
              'expandFieldVos': [],
              'field': 'trip_way',
              'fieldType': 2,
              'isModify': false,
              'isWrite': true,
              'name': '单程往返',
              'note': '',
              'options': ['单程','往返'],
              'sort': 3,
              'status': 1
          },
          {
              'dateType': 0,
              'expandFieldVos': [],
              'field': 'start_and_end_city',
              'fieldType': 0,
              'isModify': false,
              'isWrite': true,
              'name': '起止城市',
              'note': '',
              'options': [],
              'sort': 4,
              'status': 1
          },
          {
              'dateType': 2,
              'expandFieldVos': [],
              'field': 'start_and_end_time',
              'fieldType': 5,
              'isModify': false,
              'isWrite': true,
              'name': '起止日期',
              'note': '',
              'options': [],
              'sort': 5,
              'status': 1
          }
      ],
      'field': 'sub_trip',
      'fieldType': 11,
      'isModify': false,
      'isWrite': true,
      'name': '子行程',
      'note': '',
      'options': [],
      'sort': 1,
      'status': 1
  }
];

export const aliTripStr = [{
  'dateType': 0,
  'expandFieldVos': [],
  'field': 'alitrip_cost_center',
  'fieldType': 2,
  'isModify': false,
  'isWrite': true,
  'name': '成本中心',
  'note': '',
  'options': [],
  'sort': 2,
  'status': 1
},
{
  'dateType': 0,
  'expandFieldVos': [],
  'field': 'alitrip_invoice_title',
  'fieldType': 2,
  'isModify': false,
  'isWrite': true,
  'name': '发票抬头',
  'note': '',
  'options': [],
  'sort': 3,
  'status': 1
},
{
  'dateType': 0,
  'expandFieldVos': [],
  'field': 'alitrip_fellow_travelers',
  'fieldType': 8,
  'isModify': false,
  'isWrite': false,
  'name': '同行人',
  'note': '',
  'options': [],
  'sort': 4,
  'status': 1,
},
{
  'dateType': 0,
  'expandFieldVos': [],
  'field': 'alitrip_expenses_owner',
  'fieldType': 2,
  'isModify': false,
  'isWrite': true,
  'name': '费用归属',
  'note': '',
  'options': ['按分摊计入', '均计入申请人'],
  'sort': 5,
  'status': 1,
}];

export const aliTripHasTrip = [{
  'dateType': 0,
  'expandFieldVos': [],
  'field': 'alitrip_cost_center',
  'fieldType': 2,
  'isModify': false,
  'isWrite': true,
  'name': '成本中心',
  'note': '',
  'options': [],
  'sort': 2,
  'status': 1
},
{
  'dateType': 0,
  'expandFieldVos': [],
  'field': 'alitrip_invoice_title',
  'fieldType': 2,
  'isModify': false,
  'isWrite': true,
  'name': '发票抬头',
  'note': '',
  'options': [],
  'sort': 3,
  'status': 1
}];
