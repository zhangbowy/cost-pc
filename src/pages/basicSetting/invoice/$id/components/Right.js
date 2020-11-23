/* eslint-disable react/no-did-update-set-state */
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, Checkbox, Divider, Select } from 'antd';
import style from './index.scss';
import { dataType } from '../../../../../utils/common';

@Form.create()
class Right extends PureComponent {

  state = {
    details: this.props.selectList && this.props.selectList.filter(it => it.field === this.props.selectId) ? this.props.selectList.filter(it => it.field === this.props.selectId)[0] : {},
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps){
    const { selectList, selectId } = this.props;
    if (prevProps.selectId !== selectId) {
      this.setState({
        details: selectList && selectList.filter(it => it.field === selectId) ? selectList.filter(it => it.field === selectId)[0] : {}
      });
    }
  }

  render() {
    const { details } = this.state;
    const { selectId } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    console.log('Right -> render -> selectId', selectId);
    // console.log('Right -> render -> selectList', selectList);
    console.log(details);
    return (
      <div className={style.strRight}>
        <div className={style.header}>
          <span className="fs-16 c-black-85 fw-500">{details.name}</span>
          <span className={style.tags}>默认字段</span>
        </div>
        <Form style={{ padding: '0 24px' }}>
          <Form.Item label="字段标题">
            {
              getFieldDecorator(`name[${details.field}]`, {
                initialValue: details.name,
              })(
                <Input placeholder="请输入" disabled={details.disabled} />
              )
            }
          </Form.Item>
          <Form.Item label="校验">
            {
              getFieldDecorator(`isWrite[${details.field}]`, {
                initialValue: details.isWrite ? [details.isWrite] : [],
              })(
                <Checkbox.Group
                  style={{ width: '100%' }}
                  disabled={details.disabled}
                >
                  <Checkbox value>必填</Checkbox>
                </Checkbox.Group>
              )
            }
          </Form.Item>
          {
            (details.fieldType === '5') || (details.fieldType === 5) &&
            <Form.Item label="日期">
              {
                getFieldDecorator(`dateType[${details.field}]`, {
                  initialValue: details.dateType ? `${details.dateType}` : '1',
                })(
                  <Select>
                    {
                      dataType.map(it => (
                        <Select.Option key={it.key}>{it.value}</Select.Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
          }
          {
            details.field && (details.field.indexOf('self_') > -1) &&
            <>
              <Divider type="horizontal" />
              <Form.Item label="其他设置">
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
