/* eslint-disable react/no-did-update-set-state */
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, Checkbox, Divider, Select, Modal, Button } from 'antd';
import style from './index.scss';
import { dataType, defaultString, changeOrder } from '../../../../../utils/constants';
import { timeStampToHex } from '../../../../../utils/common';

let id = 1000;
@Form.create()
class Right extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      details: this.props.selectList &&
               this.props.selectList.filter(it => it.field === this.props.selectId) ?
               this.props.selectList.filter(it => it.field === this.props.selectId)[0] : {},
      checked: false,
      list: [],
    };
  }

  componentDidUpdate(prevProps){
    const { selectList, selectId } = this.props;
    if (prevProps.selectId !== selectId) {
      let list = [];
      const details = selectList && selectList.filter(it => it.field === selectId) ? selectList.filter(it => it.field === selectId)[0] : {};
      if (details.options) {
        list = details.options.map((it, index) => { return { name: it, id: `aa_${index}` }; });
      }
      this.setState({
        details: selectList && selectList.filter(it => it.field === selectId) ? selectList.filter(it => it.field === selectId)[0] : {},
        list,
      });
    }
  }

  idGenerator = () => {
    let qutient = 10000;
    const chars = '0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz';
    const charArr = chars.split( '' );
    const radix = chars.length;
    const res = [];
    do {
      const mod = qutient % radix;
      qutient = ( qutient - mod ) / radix;
      res.push( charArr[mod] );
    } while ( qutient );
    const time = timeStampToHex();

    return `expand_field_${res.join('')}${time+1}`;
  }

  onChange = (e, key) => {
    const { selectList } = this.props;
    const { details } = this.state;
    const arr = [...selectList];
    const index = arr.findIndex(it => it.field === details.field);
    arr.splice(index, 1, {
      ...details,
      [key]: e && e.length ? e[0] : false,
    });
    this.setState({
      details: {
        ...details,
        [key]: e && e.length ? e[0] : false,
      }
    });
    this.props.onChange(arr);
  }

  onInput = (e, key) => {
    const { selectList } = this.props;
    const { details } = this.state;
    const arr = [...selectList];
    const index = arr.findIndex(it => it.field === details.field);
    arr.splice(index, 1, {
      ...details,
      [key]: e.target.value
    });
    this.setState({
      details: {
        ...details,
        [key]: e.target.value
      }
    });
    this.props.onChange(arr);
  }

  getFormItems = () => {
    const { form } = this.props;
    const { details } = this.state;
    let val = null;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        val = {
          ...details,
          isWrite: !!values.isWrite[details.field].length,
          name: values.name[details.field],
        };
        if (Number(details.fieldType) === 2) {
          const newArr = [];
          if (values.keys) {
            const keys = values.keys.map(it => it.id);
            keys.forEach(it => {
              newArr.push(values[it]);
            });
          }
          Object.assign(val, {
            options: newArr,
          });
        } else if (Number(details.fieldType) === 5) {
          Object.assign(val, {
            dateType: values.dataType[details.field],
          });
        }
      } else {
        val = null;
      }
    });
    console.log('Right -> getFormItems -> val', val);
    return val;
  }

  onChangeMore = (e) => {
    const { details } = this.state;
    const { selectList } = this.props;
    if (e.target.checked) {
      Modal.confirm({
        title: `确认要添加${details.name}到公用库吗`,
        content: (
          <p className="fs-14 c-black-65">
            请确保添加到公用库的字段为通用字段，添加进公库后不可删除。保存后生效。
          </p>
        ),
        onOk: () => {
          const arr = [...selectList];
          const index = arr.findIndex(it => it.field === details.field);
          arr.splice(index, 1, {
            ...details,
            field: this.idGenerator()
          });
          this.setState({
            details: {
              ...details,
              field: this.idGenerator()
            }
          });
          this.props.onChange(arr);
        }
      });
    }
  }

  /**
   * 新增条件
   */
  onAdd = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat([{
      id: ++id,
      name: '',
    }]);
    form.setFieldsValue({
      keys: nextKeys,
    });
    this.setState({
      list: nextKeys,
    });
  }

  /**
   * 删除条件
   * @param { String } 包含k(删除的id值)
   */
  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key.id !== k),
    });
    this.setState({
      list: keys.filter(key => key.id !== k),
    });
  };

  onChangeS = (op) => {
    const { selectList } = this.props;
    const { details } = this.state;
    const arr = [...selectList];
    const index = arr.findIndex(it => it.field === details.field);
    arr.splice(index, 1, {
      ...details,
      dateType: op
    });
    this.setState({
      details: {
        ...details,
        dateType: op
      }
    });
    this.props.onChange(arr);
  }

  render() {
    const { details, list } = this.state;
    const { selectId, type, templateType } = this.props;

    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    console.log('Right -> render -> selectId', selectId);
    // console.log('Right -> render -> selectList', selectList);
    console.log(details);
    getFieldDecorator('keys', { initialValue: list || [] });
    const keys = getFieldValue('keys');
    const formItems = Number(details.fieldType) === 2 ? keys.map(it=> (
      <div className={style.addForm}>
        <Form.Item
          key={it.id}
        >
          {
            getFieldDecorator(`${it.id}`, {
              initialValue:it.name,
              rules: [
                { max: 15, message: '限制15个字' },
                { required: true, message: '请输入' }
              ]
            })(
              <Input placeholder="请输入选项" style={{width: '232px'}} />
            )
          }
        </Form.Item>
        {
          list.length > 2 &&
          <i className="iconfont iconclose" onClick={() => this.remove(it.id)} />
        }
      </div>
    )) : null;
    return (
      <div className={style.strRight}>
        <div className={style.header}>
          <span className="fs-16 c-black-85 fw-500">{details.name}</span>
          {
            details.field.indexOf('self_') === -1 &&
            <span className={style.tags}>{defaultString.includes(details.field) ? '默认字段' : '公用'}</span>
          }
        </div>
        <div className={style.contents}>
          <Form style={{ padding: '0 24px' }} colon={false}>
            <Form.Item label="字段标题">
              {
                getFieldDecorator(`name[${details.field}]`, {
                  initialValue: details.name,
                  rules: [
                    { max: 10, message: '限制10个字' },
                    { required: true, message: '请输入字段标题' }
                  ]
                })(
                  <Input
                    placeholder="请输入"
                    disabled={
                      details.disabled ||
                      (details.field.indexOf('self_') === -1 &&
                      details.field.indexOf('expand_') === -1)
                    }
                    onBlur={e => this.onInput(e, 'name')}
                  />
                )
              }
            </Form.Item>
            {
              details.field.indexOf('expand_') > -1 &&
              <p style={{ marginTop: '-20px', marginBottom: '8px' }}>
                <i className="iconfont iconxinxitishi warn fs-16 m-r-4" style={{verticalAlign: 'middle'}} />
                <span className="fs-12 warn" style={{verticalAlign: 'middle'}}>公用字段标题修改后将应用到所有{type === 'invoice' ? '单据模板' : '费用类别'}</span>
              </p>
            }
            <Form.Item label="默认文案">
              {
                getFieldDecorator(`note[${details.field}]`, {
                  initialValue: details.note || '请输入',
                  rules: [
                    { max: 10, message: '限制10个字' },
                  ]
                })(
                  <Input
                    placeholder="请输入"
                    onBlur={e => this.onInput(e, 'note')}
                  />
                )
              }
            </Form.Item>
            {
              Number(details.fieldType) === 2 && !details.disabled &&
              (details.field && (details.field.indexOf('self_') > -1 || details.field.indexOf('expand_') > -1)) &&
              <div className={style.moveForm}>
                <p>选项</p>
                {formItems}
                <Button
                  icon="plus"
                  style={{marginLeft: '44px', width: '160px'}}
                  type="dashed"
                  className={style.addSelect}
                  onClick={() => this.onAdd()}
                  disabled={list && (list.length > 15 || (list.length === 15))}
                >
                  添加选项
                </Button>
              </div>
            }
            {
              ((details.fieldType === '5') || (details.fieldType === 5)) &&
              (details.field && (details.field.indexOf('self_') > -1 || details.field.indexOf('expand_') > -1)) &&
              <Form.Item label="类型">
                {
                  getFieldDecorator(`dateType[${details.field}]`, {
                    initialValue: details.dateType ? `${details.dateType}` : '1',
                  })(
                    <Select onChange={(options) => this.onChangeS(options)}>
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
            <Form.Item label="校验">
              {
                getFieldDecorator(`isWrite[${details.field}]`, {
                  initialValue: details.isWrite ? [details.isWrite] : [],
                })(
                  <Checkbox.Group
                    style={{ width: '100%' }}
                    disabled={details.disabled}
                    onChange={e => this.onChange(e, 'isWrite')}
                  >
                    <Checkbox value>必填</Checkbox>
                  </Checkbox.Group>
                )
              }
            </Form.Item>
            {
              !changeOrder.includes(details.field) && templateType !== 2 &&
              <Form.Item label="改单">
                {
                  getFieldDecorator(`isModify[${details.field}]`, {
                    initialValue: details.isModify ? [details.isModify] : [],
                  })(
                    <Checkbox.Group
                      style={{ width: '100%' }}
                      disabled={details.disabled}
                      onChange={e => this.onChange(e, 'isModify')}
                    >
                      <Checkbox value>允许发放环节修改</Checkbox>
                    </Checkbox.Group>
                  )
                }
              </Form.Item>
            }
            {
              details.field && (details.field.indexOf('self_') > -1) &&
              <>
                <Divider type="horizontal" />
                <Form.Item label="其他设置">
                  <Checkbox onChange={(e) => this.onChangeMore(e)} checked={this.state.checked}>添加此字段到公用库</Checkbox>
                </Form.Item>
              </>
            }
          </Form>
        </div>
      </div>
    );
  }
}

export default Right;
