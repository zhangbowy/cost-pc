/* eslint-disable react/no-did-update-set-state */
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, Checkbox, Divider } from 'antd';
import style from './index.scss';

@Form.create()
class Right extends PureComponent {

  state = {
    selectList: this.props.selectList,
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps){
    const { selectList } = this.props;
    if (prevProps.selectList !== selectList) {
      this.setState({
        selectList,
      });
    }
  }

  render() {
    const { selectList } = this.state;
    const { selectId } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    console.log('Right -> render -> selectId', selectId);
    const details = selectList ? selectList.filter(it => it.field === selectId)[0] : {};
    console.log('Right -> render -> selectList', selectList);
    console.log(details);
    return (
      <div className={style.strRight}>
        <div className={style.header}>
          <span className="fs-16 c-black-85 fw-500">{details.name}</span>
          <span className={style.tags}>默认字段</span>
        </div>
        <Form style={{ padding: '0 24px' }}>
          <Form.Item label="字段标题" key="name">
            {
              getFieldDecorator('name', {
                initialValue: details.name,
              })(
                <Input placeholder="请输入" disabled={details.disabled} />
              )
            }
          </Form.Item>
          <Form.Item label="校验" key="isWrite">
            {
              getFieldDecorator('isWrite', {
                initialValue: details.isWrite ? [details.isWrite] : [],
              })(
                <Checkbox.Group style={{ width: '100%' }}>
                  <Checkbox value>必填</Checkbox>
                </Checkbox.Group>
              )
            }
          </Form.Item>
          {
            details.field && (details.field.indexOf('self_') > -1) &&
            <>
              <Divider type="horizontal" />
              <Form.Item label="其他设置" key="isWrite">
                <Checkbox>添加此字段到公用库</Checkbox>
              </Form.Item>
            </>
          }
        </Form>
      </div>
    );
  }
}

export default Right;
