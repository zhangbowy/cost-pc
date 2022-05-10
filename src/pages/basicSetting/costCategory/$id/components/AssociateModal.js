import React from 'react';
import { Form,  Button,Table,Select,Tooltip} from 'antd';
// import { connect } from 'dva';
import AssociatePop from '@/components/AssociatePop/';
import style from './AssociateModal.scss';
import { defaultString } from '@/utils/constants';

// let newAssociateList = [];
@Form.create()
class AssociateModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      // eslint-disable-next-line react/no-unused-state
      optionsRelevance: [],
      newAssociateList: [],
      disabledArr: [],
    };
  };

  // 显示弹窗
  // eslint-disable-next-line no-shadow
  onShow = (selectField) => {
    console.log('🚀 ~ file: AssociateModal.js ~ line 23 ~ AssociateModal ~ selectField', selectField);
    const { getValueList, valueList ,associateList, spacialCenter } = this.props;
    const arrs = [];
    getValueList().forEach(item => {
     if (item.name !== '') {
       arrs.push(item);
       }
    });
    // 选项 name为空就返回
    if (arrs.length&&arrs.length !== valueList.length) return;
    const defaultList =  spacialCenter || defaultString;// 不能被关联的
    const newAssociateList = associateList.filter(item => {
      return !defaultList.includes(item.field)&&item.fieldType!==3&&item.fieldType!=='3'&&item.fieldType!==9&&item.fieldType!=='9'&&item.fieldType!=='10'&&item.fieldType!==10;
    });
    // 所有的循环的禁止字段
    const newDisabled = this.getNewList([], newAssociateList, selectField.field) || [];
    console.log('🚀 ~ file: AssociateModal.js ~ line 40 ~ AssociateModal ~ newArrList', newDisabled);

    const obj = {};
    if (selectField.optionsRelevance) {
       selectField.optionsRelevance.forEach(item => {
      const arr = [];
      newAssociateList.forEach(it => {
        if (item.ids.includes(it.field)) {
          arr.push(it);
        }
        obj[item.name] = arr.map(its => its.field);
      });
    });
    }
    // 调用父级 更改valueList
    getValueList();
    // 把自己加上去
    newDisabled.push(selectField.field);
    this.setState({ visible: true, obj, newAssociateList, disabledArr: newDisabled });
  };

  getNewList = (arrs, list, s) => {
    for (let j =0; j< list.length; j++) {
      const item = list[j];
      if (item.optionsRelevance && item.optionsRelevance.length) {
        for(let i=0; i< item.optionsRelevance.length; i++) {
          const { ids } = item.optionsRelevance[i];
          if (ids && ids.length && ids.includes(s)) {
            arrs.push(item.field);
            console.log('🚀 ~ file: AssociateModal.js ~ line 68 ~ AssociateModal ~ newArr', arrs);
            this.getNewList(arrs, list, item.field);
          }
        }
      }
    }
    return arrs;
  }

  // 关闭/取消等
  onCancel = () => {
    this.props.form.resetFields();
    // this.props.form.setFieldsValue({
    // });
    this.setState({
      visible: false,
    });
  }

  // 确定
  onSubmit = () => {
    const { changeDetails, form, selectField, valueList } = this.props;
    // 注意：valueList 要拿到最新的
    const arr = [];
    valueList.forEach(item => {
      arr.push(item.name);
    });
    const obj = form.getFieldsValue().ids;
    const optionsRelevance = [];
    arr.forEach(item => {
      optionsRelevance.push({
        name: item,
        ids: obj[item]?obj[item]:[],
      });
    });
    changeDetails({
      ...selectField,
      optionsRelevance
    });
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
  }

  render() {
    const {
      children,
      // form: { getFieldDecorator },
      loading,
      selectField, // 当前单选
      form: { getFieldDecorator },
      valueList
    } = this.props;
    const { newAssociateList, disabledArr } = this.state;
    console.log(valueList,'要拿到最新的 valueList');

    console.log(newAssociateList,'可被关联的选项 newAssociateList');
    const { Option } = Select;
    const { visible,obj} = this.state;
    // const { visible} = this.state;
    const columns = [ {
      title: '选项关联',
      dataIndex: 'name',
      width: 200,
      // 第一列
      onCell: () => {
        return {
          style: {
            maxWidth: 200,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            lineClamp: 2
          }
        };
      },
      render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    }, {
      title: '关联组件',
      dataIndex: 'component',
      width: 513,
      //
      render: (_, record) => (
        <Form>
          <Form.Item
            key={record.id}
            style={{marginBottom: '0'}}
          >
            {
              getFieldDecorator(`ids[${record.name}]`,{
                initialValue:  obj[record.name] || undefined,
                // rules: [{ required: true, message: '' }]
              })(
                <Select
                  placeholder="请选择"
                  style={{ width: '100%' }}
                  mode="multiple"
                  allowClear
                  showArrow
                >
                  {newAssociateList.map(item => (
                    <Option key={item.field} disabled={disabledArr.includes(item.field)} value={item.field}>{item.name}</Option>
              ))}
                </Select>
              )

          // )
        }
          </Form.Item>
        </Form>
      ),
    }];
    return (
      <span>
        <span onClick={() => this.onShow(selectField,newAssociateList)}>{children}</span>
        <AssociatePop
          title={`${selectField.name}_选项关联`}
          maskClosable={false}
          visible={visible}
          onCancel={() => this.onCancel()}
          footer={[<Button key="cancel" onClick={() => this.onCancel()} className="m-l-8">取消</Button>,
            <Button key="save" onClick={() => this.onSubmit()} loading={loading} disabled={loading} type="primary">确认</Button>
          ]}
          size="middle"
        >
          <>
            <span className={style.tip}>根据选择的选项，显示其他控件。当前控件、默认字段和上级选项不能被关联显示</span>
            <div className={style.dataTable}>
              <Table
                columns={columns}
                loading={loading}
                bordered
                align='center'
                dataSource={valueList}
                pagination={false}
                rowKey={row => row.id}
                className={style.optContent}
              />
            </div>
          </>
        </AssociatePop>
      </span>
    );
  }
}

export default AssociateModal;
