import React, { Component } from 'react';
import { Form, Popover, Input, Divider } from 'antd';
import style from './index.scss';

@Form.create()
class LevelSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onShow = () => {

  }

  onSubmit = () => {

  }

  selectPle = (res, name, dep) => {
    this.setState({
      [`${name}VOS`]: res.users || [],
      [`${dep}VOS`]: res.depts || [],
    });
  }

  onReset = () => {
    this.props.form.resetFields();
  }

  onCancel = () => {
    this.onReset();
  }

  render() {
    const {
      children,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <span>
        <Popover
          trigger="click"
          title={null}
          placement="bottomRight"
          overlayClassName={style.popover}
          content={(
            <>
              <div className={style.formCnt}>
                <Form layout='inline' {...formItemLayout}>
                  <Form.Item label="测试1">
                    <Input />
                  </Form.Item>
                  <Form.Item label="测试2">
                    <Input />
                  </Form.Item>
                </Form>
              </div>
              <Divider type="horizontal" style={{ margin: 0 }} />
              <div className={style.delBtn} onClick={() => this.onCancel()}>
                <i className="iconfont iconshanchu" />
                <span>清除所有筛选条件</span>
              </div>
            </>
          )}
        >
          <span>{children}</span>
        </Popover>
      </span>
    );
  }
}

export default LevelSearch;
