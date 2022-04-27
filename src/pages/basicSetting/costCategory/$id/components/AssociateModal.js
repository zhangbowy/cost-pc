import React from 'react';
// import { Form, Select,  Button, message, Tooltip, Radio } from 'antd';
import { Button} from 'antd';
// import { connect } from 'dva';
import ModalTemp from '@/components/ModalTemp/';
// import style from './AssociateModal.scss';

// const { Option } = Select;
class AssociateModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

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

  render() {
    const {
      children,
    //   form: { getFieldDecorator },
      loading,
    } = this.props;
    const { visible} = this.state;
    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 4 },
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 14 },
    //   },
    // };
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <ModalTemp
          title='选择关联'
          maskClosable={false}
          visible={visible}
          onCancel={() => this.onCancel()}
          footer={[<Button key="cancel" onClick={() => this.onCancel()} className="m-l-8">取消</Button>,
            <Button key="save" onClick={() => this.onSubmit()} loading={loading} disabled={loading} type="primary">确认</Button>
          ]}
          size="small"
        //   newBodyStyle={{
        //     minHeight: '274px',
        //     maxHeight: '505px',
        //     height: 'auto'
        //   }}
        //   newDivStyle={{
        //     minHeight: '274px',
        //     maxHeight: '505px',
        //     height: 'auto'
        //   }}
        >
          <>
            
          </>
        </ModalTemp>
      </span>
    );
  }
}

export default AssociateModal;
