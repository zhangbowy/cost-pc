import React, { PureComponent } from 'react';
import { Divider, Button, Form, Input, Row, Col } from 'antd';
import style from '../index.scss';

@Form.create()
class AddTravel extends PureComponent {
  render () {
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
    const { form: { getFieldDecorator } } = this.props;
    return (
      <div>
        <Divider type="horizontal" />
        <div style={{paddingTop: '24px', paddingBottom: '30px'}}>
          <div className={style.header}>
            <div className={style.line} />
            <span>行程</span>
          </div>
        </div>
        <div style={{textAlign: 'center'}} className={style.addbtn}>
          <Button
            icon="plus"
            style={{ width: '231px', marginBottom: '16px' }}
            key="handle"
            onClick={() => this.onHandle()}
          >
            添加行程
          </Button>
        </div>
        <Form>
          <Row>
            <Col span={12}>
              <Form.Item label="成本中心" {...formItemLayout}>
                {
                  getFieldDecorator('nnames', {
                    rules: [{ required: true, message: '请选择成本中心' }]
                  })(
                    <Input />
                  )
                }
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="发票抬头" {...formItemLayout}>
                {
                  getFieldDecorator('piaoqian', {
                    rules: [{ required: true, message: '请输入发票抬头' }]
                  })(
                    <Input placeholder="请输入" />
                  )
                }
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="同行人" {...formItemLayout}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={(<span>费用归属<i className="iconfont iconshuomingwenzi" /></span>)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('feiy', {
                    rules: [{ required: true, message: '请选择费用归属' }]
                  })(
                    <Input />
                  )
                }
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default AddTravel;
