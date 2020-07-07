export default {
  'processData': {
    'nodeType': 'start',
    'content': '所有人',
    'nodeId': 'Gb2',
    'bizData': {
      'title': '发起人',
      'initiator': 'ALL',
      'formOperates': [
        {
          'formId': 2,
          'formOperate': 2
        }
      ]
    },
    'childNode': {
      'nodeId': 'Nb2',
      'prevId': 'Gb2',
      'nodeType': 'route',
      'content': '发起人自选',
      'bizData': {
        'title': '审批人',
        'assigneeType': 'optional',
        'formOperates': [
          {
            'formId': 2,
            'formOperate': 1
          }
        ],
        'counterSign': true,
        'optionalMultiUser': false,
        'optionalRange': 'ALL'
      },
      'conditionNodes': [
        {
          'nodeType': 'condition',
          'content': '[学历 = 博士生] \n',
          'nodeId': 'Lb2',
          'prevId': 'Nb2',
          'priority': 1,
          'bizData': {
            'title': '条件1',
            'conditions': [
              {
                'formId': 3,
                'conditionValue': '博士生'
              }
            ],
            'initiator': null
          },
          'childNode': {
            'nodeType': 'approver',
            'content': '张三',
            'bizData': {
              'title': '审批人',
              'approvers': [
                {
                  'nodeId': 20,
                  'userId': 20,
                  'userName': '张三',
                  'deptId': 1
                }
              ],
              'assigneeType': 'user',
              'formOperates': [
                {
                  'formId': 2,
                  'formOperate': 1
                }],
              'counterSign': true,
              'optionalMultiUser': false,
              'optionalRange': 'ALL'
            },
            'nodeId': 'Wb2',
            'prevId': 'Lb2',
            'childNode': {
              'nodeType': 'notifier',
              'content': 'xxx研发部',
              'bizData': {
                'title': '抄送人',
                'menbers': {
                  'dep': [
                    {
                      'nodeId': 4,
                      'deptId': 4,
                      'deptName': 'xxx研发部',
                      'parentDeptId': 1
                    }
                  ]
                },
                'userOptional': true
              },
              'nodeId': 'Yb2',
              'prevId': 'Wb2'
            }
          }
        },
        {
          'nodeType': 'condition',
          'content': '其他情况进入此流程',
          'nodeId': 'Mb2',
          'prevId': 'Nb2',
          'priority': 2,
          'bizData': {
            'title': '条件2',
            'conditions': [],
            'initiator': null,
            'priority': 1,
            'isDefault': true
          },
          'childNode': {
            'nodeType': 'approver',
            'content': '王五',
            'nodeId': 'Xb2',
            'prevId': 'Mb2',
            'bizData': {
              'title': '审批人',
              'approvers': [
                {
                  'nodeId': 40,
                  'userId': 40,
                  'userName': '王五',
                  'deptId': 1
                }
              ],
              'assigneeType': 'user',
              'formOperates': [
                {
                  'formId': 2,
                  'formOperate': 1
                }
              ],
              'counterSign': true,
              'optionalMultiUser': false,
              'optionalRange': 'ALL'
            }
          }
        }
      ],
      childNode: {
        'nodeId': 'lbs',
        'prevId': 'Nb2',
        'nodeType': 'grant',
        'name': '发放人',
        'content': '发起人自选',
        'bizData': {
          'title': '审批人',
          'assigneeType': 'optional',
          'formOperates': [
            {
              'formId': 2,
              'formOperate': 1
            }
          ],
          'counterSign': true,
          'optionalMultiUser': false,
          'optionalRange': 'ALL'
        },
      }
    },

  }
};
