import React, { Component } from 'react';
import { Modal, Form, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import UserSelector from '@/components/Modals/SelectPeople';
// import styles from './index.scss';

@Form.create()
@connect(({ global }) => ({
  costCategoryList: global.costCategoryList,
  invoiceList: global.invoiceList,
  projectList: global.projectList,
  supplierList: global.supplierList,
}))
class LevelSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      userVOS: [],
      deptVos: [],
    };
  }

  onShow = async () => {
    const { details } = this.props;
    if (details) {
      const {
        userVOS,
        deptVos,
      } = details;
      this.setState({
        userVOS,
        deptVos,
      });
    }
    this.setState({
      visible: true,
    });
  }

  onSubmit = () => {
    const {
      userVOS,
      deptVos,
    } = this.state;
    this.props.form.validateFieldsAndScroll((err) => {
      if (!err) {
        const detail = {
          userVOS,
          deptVos,
        };
        this.onCancel();
        this.props.onOk(detail);
      }
    });
  }

  selectPle = (res, name) => {
    if (name === 'user') {
      this.setState({
        [`${name}VOS`]: res.users || [],
      });
    } else {
      this.setState({
        [`${name}Vos`]: res.depts || [],
      });
    }
  }

  onReset = () => {
    this.setState({
      userVOS: [],
      deptVos: [],
    });
    this.props.form.resetFields();
  }

  onCancel = () => {
    this.onReset();
    this.setState({
      visible: false,
    });
  }

  render() {
    const {
      children,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    };
    const { visible, userVOS, deptVos } = this.state;
    console.log('LevelSearch -> render -> deptVos', deptVos);
    return (
      <span>
        <span onClick={this.onShow}>{children}</span>
        <Modal
          title="高级搜索"
          visible={visible}
          onCancel={this.onCancel}
          width="680px"
          bodyStyle={{ height: '373px', overflowY: 'scroll' }}
          footer={(
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button key="reset" onClick={() => this.onReset()}>重置</Button>
              <div>
                <Button key="cancel" onClick={() => this.onCancel()}>取消</Button>
                <Button type="primary" key="save" onClick={() => this.onSubmit()}>确定</Button>
              </div>
            </div>
          )}
        >
          <Form className="formItem">
            <Row>
              <Col span={12}>
                <Form.Item label="提交人" {...formItemLayout}>
                  <UserSelector
                    users={userVOS || []}
                    placeholder='请选择'
                    onSelectPeople={(val) => this.selectPle(val, 'user')}
                    invalid={[]}
                    disabled={false}
                    flag="users"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="部门" {...formItemLayout}>
                  <UserSelector
                    depts={deptVos || []}
                    placeholder='请选择'
                    onSelectPeople={(val) => this.selectPle(val, 'dept')}
                    invalid={[]}
                    disabled={false}
                    flag="dept"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default LevelSearch;
