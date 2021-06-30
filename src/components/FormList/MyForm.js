import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col } from 'antd';
import { convert, config, dateFormat } from './_utils';

const FormItem = Form.Item;

@Form.create()
class MyForm extends PureComponent {
  renderFormItem = (item, getFieldDecorator) => (
    <FormItem key={item.label} label={item.label} {...item.fItemProps}>
      {getFieldDecorator(item.field, config(item))(convert(item))}
    </FormItem>
  );

  handleSubmit = (e) => {
    if (e && typeof e === 'object') {
      e.preventDefault();
    }

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
      formProps,
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form
        onSubmit={this.handleSubmit}
        {...formProps}
        layout={mode === 'search' ? 'inline' : 'horizontal'}
      >
        {mode !== 'plain' ? (
          fields.map(item => this.renderFormItem(item, getFieldDecorator))
        ) : (
          <Row type="flex" gutter={30}>
            {fields.map((item) => (
              <Col
                key={item.id}
                xs={24}
                sm={item.separate ? 24 : 8}
                xl={item.separate ? 24 : 6}
              >
                {this.renderFormItem(item, getFieldDecorator)}
              </Col>
            ))}
          </Row>
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
  fields: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired,
  footer: PropTypes.object,
  formProps: PropTypes.object,
};

export default MyForm;
