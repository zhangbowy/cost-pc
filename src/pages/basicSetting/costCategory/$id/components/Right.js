/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-did-update-set-state */
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, Checkbox, Divider, Select, Modal, Button, Tooltip, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import style from './index.scss';
import { dataType, defaultString, changeOrder, dragDisabled } from '../../../../../utils/constants';
import { timeStampToHex, intToChinese } from '../../../../../utils/common';
import ThirdSet from './RightCheck/ThirdSet';
import { aliTrip, aliTripStr, aliTripHasTrip } from './ItemTypes';

let id = 1000;
const disabledDefault = ['costCategory', 3, 10];
@Form.create()
class Right extends PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props.selectList);
    console.log(this.props.selectId);
    this.state = {
      details: this.props.selectList &&
               (this.props.selectList.findIndex(it => it.field === this.props.selectId) > -1) ?
               this.props.selectList.filter(it => it.field === this.props.selectId)[0] : {},
      checked: false,
      list: [],
    };
  }

  componentDidUpdate(prevProps){
    const { selectList, selectId } = this.props;
    // this.props.form.resetFields();
    if (prevProps.selectId !== selectId) {
      let list = [];
      const indexs = selectList && selectList.findIndex(it => it.field === selectId);
      let details = {};
      if (indexs > -1) {
        details = selectList[indexs];
      } else {
        const arr = selectList.filter(it => Number(it.fieldType) === 3)[0].expandFieldVos;
        const i = arr.findIndex(it => it.field === selectId);
        details = arr[i];
      }
      if (details.options) {
        list = details.options.map((it, index) => { return { name: it, id: `aa_${timeStampToHex()+index}` }; });
      } else {
        this.props.form.setFieldsValue({
          keys: []
        });
      }
      console.log('details', details);
      this.setState({
        details,
        list: [...list],
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
    const arr = this.onChangeChild(selectList, details.field, {
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
    console.log('Right -> onInput -> selectList', selectList);
    const { details } = this.state;
    const arr = this.onChangeChild(selectList, details.field, {
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
        };
        if (Number(details.fieldType) !== 9) {
          Object.assign(val, {
            isWrite: !!values.isWrite[details.field].length,
            name: values.name[details.field],
          });
        }
        if (Number(details.fieldType) === 2 || Number(details.fieldType) === 8) {
          const newArr = [];
          if (values.keys) {
            const keys = values.keys.map(it => it.id);
            keys.forEach(it => {
              newArr.push(values[it]);
            });
          }
          Object.assign(val, {
            options: [...new Set(newArr)],
          });
        } else if (Number(details.fieldType) === 5) {
          Object.assign(val, {
            dateType: values.dataType[details.field],
          });
        }
        this.props.form.resetFields();
        // this.setState({
        //   list: [],
        // });
      } else {
        val = null;
      }
    });
    return val;
  }

  onChangeMore = (e) => {
    const { details } = this.state;
    const { selectList, changeDragId } = this.props;
    if (e.target.checked) {
      Modal.confirm({
        title: `???????????????${details.name}???????????????`,
        content: (
          <p className="fs-14 c-black-65">
            ?????????????????????????????????????????????????????????????????????????????????????????????????????????
          </p>
        ),
        onOk: () => {
          const newField = this.idGenerator();
          const items = this.getFormItems();
          console.log('Right -> onChangeMore -> items', items);
          const arr = this.onChangeChild(selectList, details.field, {
            ...details,
            ...items,
            field: newField
          });
          this.setState({
            details: {
              ...details,
              ...items,
              field: newField
            },
          });
          this.props.onChange(arr);
          changeDragId(newField);
        }
      });
    }
  }

  /**
   * ????????????
   */
  onAdd = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');

    const nextKeys = keys.concat([{
      id: ++id,
      name: `??????${intToChinese(keys.length+1)}`,
    }]);
    form.setFieldsValue({
      keys: nextKeys,
    });
    this.setState({
      list: nextKeys,
    });
  }

  /**
   * ????????????
   * @param { String } ??????k(?????????id???)
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
    const arr = this.onChangeChild(selectList, details.field, {
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

  onChangeChild = (oldList, field, newVal) => {
    const arr = [...oldList];
    const i = oldList.findIndex(it => it.field === field);
    if (i > -1) {
      arr.splice(i, 1, {...newVal});
    } else {
      const lI = oldList.findIndex(it => Number(it.fieldType) === 3);
      const expand = oldList[lI].expandFieldVos;
      const nI = expand.findIndex(it => it.field === field);
      expand.splice(nI, 1, {
        ...newVal,
      });
      arr.splice(lI, 1, {
        ...arr[lI],
        expandFieldVos: expand,
      });
    }
    return arr;
  }

  onChangeThird = (e, key) => {
    const auths = localStorage.getItem('isAlitripAuth');
    if (auths && auths  === '0') {
      message.error('???????????????????????????????????????');
      return;
    }
    const { selectList } = this.props;
    const { details } = this.state;
    let expands = [...aliTrip];
    const obj = {
      ...details,
      alitripSetting: {
        ...details.alitripSetting,
        [key]: e.target.checked,
      }
    };
    if (obj.alitripSetting.hasFellowTraveler) {
      expands = [...expands, ...aliTripStr];
    } else if (obj.alitripSetting.isEnable) {
      expands = [...expands, ...aliTripHasTrip];
    }
    console.log('??????????????????', obj.alitripSetting.isEnable);
    if (!obj.alitripSetting.isEnable) {
      Object.assign(obj, {
        alitripSetting: {
          ...obj.alitripSetting,
          hasFellowTraveler: false,
        }
      });
    }
    Object.assign(obj, {
      expandFieldVos: expands,
    });
    const arr = this.onChangeChild(selectList, details.field, obj);
    this.setState({
      details: obj,
    });
    this.props.onChange(arr);
  }

  render() {
    const { details, list } = this.state;
    const { type, templateType, isModifyInvoice, operateType } = this.props;
    console.log('Right -> render -> isModifyInvoice', isModifyInvoice);

    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    getFieldDecorator('keys', { initialValue: list || [] });
    const keys = getFieldValue('keys');

    const formItems = (Number(details.fieldType) === 2
    || Number(details.fieldType) === 8) ? keys.map(it=> (
      <div className={style.addForm} key={it.id}>
        <Form.Item
          key={it.id}
        >
          {
            getFieldDecorator(`${it.id}`, {
              initialValue: it.name,
              rules: [
                { max: 15, message: '??????15??????' },
                { required: true, message: '?????????' }
              ]
            })(
              <Input placeholder="???????????????" style={{width: '232px'}} />
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
          {
            dragDisabled.includes(details.field) ?
              <span className="fs-16 c-black-85 fw-500">
                ????????????
                <Tooltip title="???????????????????????????????????????=??????*??????">
                  <i className="iconfont iconIcon-yuangongshouce m-l-8" />
                </Tooltip>
              </span>
              :
              <span className="fs-16 c-black-85 fw-500">{details.name}</span>
          }
          {
            details.field.indexOf('self_') === -1 && !dragDisabled.includes(details.field) &&
            <span className={style.tags}>{defaultString.includes(details.field) ? '????????????' : '??????'}</span>
          }
        </div>
        <div className={style.contents}>
          <Form style={{ padding: '0 24px' }} colon={false}>
            {
              details.field === 'detail_money' &&
              <Form.Item label="????????????">
                {
                  getFieldDecorator('name[detail_sale]', {
                    initialValue: '??????',
                    rules: [
                      { max: 10, message: '??????10??????' },
                      { required: true, message: '?????????????????????', type: 'string' }
                    ]
                  })(
                    <Input
                      placeholder="?????????"
                      disabled
                      onBlur={e => this.onInput(e, 'name')}
                    />
                  )
                }
              </Form.Item>
            }
            {
              details.field === 'detail_money' &&
              <Form.Item label="????????????">
                {
                  getFieldDecorator('name[detail_account]', {
                    initialValue: '??????',
                    rules: [
                      { max: 10, message: '??????10??????' },
                      { required: true, message: '?????????????????????', type: 'string' }
                    ]
                  })(
                    <Input
                      placeholder="?????????"
                      disabled
                      onBlur={e => this.onInput(e, 'name')}
                    />
                  )
                }
              </Form.Item>
            }
            {
              Number(details.fieldType) === 9 ?
                <Form.Item label="????????????">
                  {
                    getFieldDecorator(`note[${details.field}]`, {
                      initialValue: details.note || '?????????',
                      rules: [
                        { max: 30, message: '??????30??????' },
                      ]
                    })(
                      <TextArea
                        style={{ height: '80px' }}
                        onBlur={e => this.onInput(e, 'note')}
                        placeholder="?????????????????????"
                      />
                    )
                  }
                </Form.Item>
                :
                <Form.Item label="????????????">
                  {
                    getFieldDecorator(`name[${details.field}]`, {
                      initialValue: details.name,
                      rules: [
                        { max: 10, message: '??????10??????' },
                        { required: true, message: '?????????????????????', type: 'string' }
                      ]
                    })(
                      <Input
                        placeholder="?????????"
                        disabled={
                          details.disabled ||
                          ((details.field.indexOf('self_') === -1 &&
                          details.field.indexOf('expand_') === -1) ||
                          dragDisabled.includes(details.field))
                          || disabledDefault.includes(Number(details.fieldType))
                        }
                        onBlur={e => this.onInput(e, 'name')}
                      />
                    )
                  }
                </Form.Item>
            }
            {
              details.field.indexOf('expand_') > -1 &&
              <p style={{ marginTop: '-20px', marginBottom: '8px' }}>
                <i className="iconfont iconxinxitishi warn fs-16 m-r-4" style={{verticalAlign: 'middle'}} />
                <span className="fs-12 warn" style={{verticalAlign: 'middle'}}>?????????????????????????????????????????????{type === 'invoice' ? '????????????' : '????????????'}</span>
              </p>
            }
            {
              Number(details.fieldType) !== 3 && Number(details.fieldType) !== 9 &&
              !disabledDefault.includes(details.field) && Number(details.fieldType) !== 10 &&
              <Form.Item label="????????????">
                {
                  getFieldDecorator(`note[${details.field}]`, {
                    initialValue: details.note || '?????????',
                    rules: [
                      { max: 10, message: '??????10??????' },
                    ]
                  })(
                    <Input
                      placeholder="?????????"
                      onBlur={e => this.onInput(e, 'note')}
                    />
                  )
                }
              </Form.Item>
            }
            {
              (Number(details.fieldType) === 2 || Number(details.fieldType) === 8) &&
               !details.disabled &&
              (details.field && (details.field.indexOf('self_') > -1 || details.field.indexOf('expand_') > -1)) &&
              <div className={style.moveForm}>
                <p>??????</p>
                {formItems}
                <Button
                  icon="plus"
                  style={{marginLeft: '44px', width: '160px'}}
                  type="dashed"
                  className={style.addSelect}
                  onClick={() => this.onAdd()}
                >
                  ????????????
                </Button>
              </div>
            }
            {
              ((details.fieldType === '5') || (details.fieldType === 5)) &&
              ((details.field && (details.field.indexOf('self_') > -1 || details.field.indexOf('expand_') > -1))
              || details.field === 'happenTime') &&
              <Form.Item label="??????">
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
            {
              Number(details.fieldType) !== 9 &&
              <Form.Item label="??????">
                {
                  getFieldDecorator(`isWrite[${details.field}]`, {
                    initialValue: details.isWrite ? [details.isWrite] : [],
                  })(
                    <Checkbox.Group
                      style={{ width: '100%' }}
                      disabled={details.disabled ||
                      dragDisabled.includes(details.field) ||
                      (Number(details.fieldType) === 10)}
                      onChange={e => this.onChange(e, 'isWrite')}
                    >
                      <Checkbox value>??????</Checkbox>
                    </Checkbox.Group>
                  )
                }
              </Form.Item>
            }
            {
              templateType !== 2 && templateType !== 3 &&
               isModifyInvoice &&
               Number(details.fieldType) !== 10 &&
              Number(details.fieldType) !== 9 &&
                <Form.Item
                  label={(
                    <>
                      <span className="m-r-8">??????</span>
                      {
                        changeOrder.includes(details.field) &&
                        <Tooltip placement="bottomLeft" title="???????????????????????????">
                          <i className="iconfont iconIcon-yuangongshouce" />
                        </Tooltip>
                      }
                    </>
                  )}
                >
                  {
                    getFieldDecorator(`isModify[${details.field}]`, {
                      initialValue: details.isModify ? [details.isModify] :
                        operateType === 'add' ? [(details.field === 'amount') || (details.field === 'loanSum')] : [],
                    })(
                      <Checkbox.Group
                        style={{ width: '100%' }}
                        disabled={changeOrder.includes(details.field)}
                        onChange={e => this.onChange(e, 'isModify')}
                      >
                        <Checkbox value>????????????????????????</Checkbox>
                      </Checkbox.Group>
                    )
                  }
                </Form.Item>
            }
            {
              Number(details.fieldType) === 10 &&
              <ThirdSet onChange={this.onChangeThird} aliTripSetting={details.alitripSetting || {}} />
            }
            {
              details.field && (details.field.indexOf('self_') > -1) && !details.parentId &&
              Number(details.fieldType) !== 10 &&
              <>
                <Divider type="horizontal" />
                <Form.Item label="????????????">
                  <Checkbox
                    onChange={(e) => this.onChangeMore(e)}
                    checked={this.state.checked}
                  >
                    ???????????????????????????
                  </Checkbox>
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
