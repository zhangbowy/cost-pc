import React from 'react';
import { Form,  Button,Table,Select} from 'antd';
// import { connect } from 'dva';
import AssociatePop from '@/components/AssociatePop/';
import style from './AssociateModal.scss';

let newAssociateList = [];
class AssociateModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    };
    
  onShow = () => {
        this.setState({visible: true});
    };

  onCancel = () => {
    // this.props.form.resetFields();
    // this.props.form.setFieldsValue({
    // });
    this.setState({
      visible: false,
    });
  }

  onSubmit = () => {
    this.setState({
        visible: false,
      });
  }

  onChange = (e) => {
    this.props.form.setFieldsValue({
    });
    // this.setState({
    //   status: e.target.value,
    // });
    console.log(e);
  }

//   check = (rule, value, callback) => {
//   }

  onChangeItem = (val) => {
      console.log(val, 'onChangeItem666');
      this.state({ selectVal: val });
  }
  
  render() {
    const {
      children,
      // form: { getFieldDecorator },
      loading,
      valueList, // 每一项
      associateList,
      selectField
    } = this.props;
    newAssociateList = associateList.filter(item => {// 关联的选项
      return item.type === 'box';
    });
    console.log(newAssociateList,'associateList');
    console.log(this.props.selectField,'当前单选的field');
    const { Option } = Select;
    console.log(valueList,'valueList');
    const { visible } = this.state;
    const columns = [ {
      title: '选择关联',
      dataIndex: 'name',
      width: 200,
    }, {
      title: '关联组件',
      dataIndex: 'component',
      width: 513,
      // 
      render: (_, record) => ( 
        <Form.Item
          key={record.id}
          style={{marginBottom: '0'}}
        >
          {
        //   getFieldDecorator('456', {
        //   initialValue:'456',
        //   rules: [{ required: true, message: '请选择' }]
        // })(
            <Select
              placeholder="请选择"
              onChange={this.onChangeItem}
              style={{ width: '100%' }}
              mode="multiple"
            //   value={{ key: 'lucy' }}
            >
              {newAssociateList.map(item => (
                 item.field===selectField?<Option key={item.field} disabled value={item.field}>{item.name}</Option>:<Option key={item.field} value={item.field}>{item.name}</Option>  
          ))}
            </Select>
        // )
      }
        </Form.Item>
      ),
    }];
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <AssociatePop
          title='选择关联'
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
                onChange={this.onChange}
                pagination={false}
                // rowKey="id"
              />
            </div>
          </>
        </AssociatePop>
      </span>
    );
  }
}

export default AssociateModal;
