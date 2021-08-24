/* eslint-disable no-unused-expressions */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Col } from 'antd';
import { convert, config, dateFormat } from './_utils';

const FormItem = Form.Item;

class MyForm extends PureComponent {
  renderFormItem = (item, getFieldDecorator) => (
    <FormItem key={item.label} label={item.label} {...item.formItemLayout}>
      {getFieldDecorator(item.field, config(item))(convert({ ...item, getFieldDecorator }))}
    </FormItem>
  );

  handleSubmit = (e) => {
    e && typeof e === 'object' && e.preventDefault();

    const { form, fields } = this.props;

    return new Promise((resolve, reject) => {
      form.validateFields((err, values) => {
        if (err) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('请将信息填写完整');
        }
        resolve(dateFormat(fields, values));
      });
    });
  };

  // 重置操作
  onReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const {
      // eslint-disable-next-line object-curly-newline
      fields,
      form,
      mode,
      footer,
      classNames,
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form
        onSubmit={this.handleSubmit}
        layout={mode === 'search' ? 'inline' : 'horizontal'}
        className={classNames}
      >
        {mode !== 'plain' ? (
          fields.map(item => this.renderFormItem(item, getFieldDecorator))
        ) : (
          <>
            {fields.map((item) => (
              <Col
                key={item.key}
                span={12}
              >
                {this.renderFormItem(item, getFieldDecorator)}
              </Col>
            ))}
          </>
        )}

        {/* 非modal模式下，在form表单中显示按钮 */}
        {footer
          && React.cloneElement(footer, {
            onCancel: this.onReset
          })}
      </Form>
    );
  }
}

MyForm.propTypes = {
  form: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  footer: PropTypes.object
};

const HocForm = Form.create()(MyForm);

HocForm.propTypes = {
  fields: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired,
  footer: PropTypes.object
};

export default HocForm;
