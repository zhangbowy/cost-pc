import React from 'react';
import { Form,  Button,Table,Select} from 'antd';
// import { connect } from 'dva';
import AssociatePop from '@/components/AssociatePop/';
import style from './AssociateModal.scss';
import { defaultString } from '@/utils/constants';

let newAssociateList = [];
@Form.create()
class AssociateModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      // eslint-disable-next-line react/no-unused-state
      optionsRelevance : []
    };
  };

  // 显示弹窗
  onShow = () => {
    this.setState({ visible: true });
  };

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
    const { changeDetails, form, selectField } = this.props;
    console.log(form.getFieldsValue(),'form.getFieldsValue');
    const obj = form.getFieldsValue().ids;
    const optionsRelevance = [];
    selectField.options.forEach(item => {
      optionsRelevance.push({
        name: item,
        ids: obj[item]?obj[item]:[],
      });
    });
    console.log(optionsRelevance,'optionsRelevance');
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
      valueList, // 每一项
      associateList,
      selectField, // 当前单选
      form: { getFieldDecorator },
      spacialCenter
    } = this.props;
    const defaultList =  spacialCenter || defaultString;// 不能被关联的
    newAssociateList = associateList.filter(item => { // 关联的选项
          return !defaultList.includes(item.field)&&item.fieldType!=='9'&&item.fieldType!==9;
    });
      
    console.log(newAssociateList,'关联的选项 newAssociateList');
    const { Option } = Select;
    console.log(valueList,'选项一，选项一valueList');// 选项一，选项一
    const { visible } = this.state;
    const columns = [ {
      title: '选项关联',
      dataIndex: 'name',
      width: 200,
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
                // initialValue:  || '',
                // rules: [{ required: true, message: '' }]
              })(
                <Select
                  placeholder="请选择"
                  // onChange={(e)=>this.onChangeItem(record,e)}
                  style={{ width: '100%' }}
                  mode="multiple"
                  allowClear
                  showArrow
                >
                  {newAssociateList.map(item => (
                    <Option key={item.field} disabled={item.field===selectField.field} value={item.field}>{item.name}</Option>
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
        <span onClick={() => this.onShow()}>{children}</span>
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
              />
            </div>
          </>
        </AssociatePop>
      </span>
    );
  }
}

export default AssociateModal;
