import React, { Component } from 'react';
import { Form, Select, Checkbox, Divider } from 'antd';
import CheckboxGroup from 'antd/lib/checkbox/Group';
import style from './index.scss';

const printType = [{
  key: '2',
  value: 'B5横版打印'
}, {
  key: '1',
  value: 'A5横版打印'
}, {
  key: '0',
  value: 'A4竖版打印'
}];
const basicSet = {
  0: [{
    key: 'isQrCode',
    value: '单据详情二维码',
  }, {
    key: 'isAssessRecord',
    value: '核销借款记录',
  }, {
    key: 'isApplicationRecord',
    value: '关联申请单记录',
  }],
  1: [{
    key: 'isQrCode',
    value: '单据详情二维码',
  }, {
    key: 'isApplicationRecord',
    value: '关联申请单记录',
  }],
  2: [{
    key: 'isQrCode',
    value: '单据详情二维码',
  }],
  3: [{
    key: 'isQrCode',
    value: '单据详情二维码',
  },],
  20: []
};
@Form.create()
class Left extends Component {

  constructor(props){
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  onChange = (e, key) => {
    const obj = { ...this.props.templatePdfVo };
    Object.assign(obj, {
      [key]: e.target.checked,
    });
    this.props.onChange('templatePdfVo', obj);
  }

  onChanges = op => {
    console.log('Left -> op', op);
    const obj = { ...this.props.templatePdfVo };
    Object.assign(obj, {
      paperType: op,
    });
    this.props.onChange('templatePdfVo', obj);
  }

  onChangeBasic = checkValues => {
    console.log('Left -> checkValues', checkValues);
    const { expandList } = this.props;
    const templatePdfExpandVos = expandList.filter(it => checkValues.includes(it.field)) || [];
    const obj = { ...this.props.templatePdfVo };
    Object.assign(obj, {
      templatePdfExpandVos,
    });
    this.props.onChange('templatePdfVo', obj);
  }



  render () {
    const {
      expandList,
      templatePdfVo,
      templateType,
      isProject,
    } = this.props;
    let lists = basicSet[templateType];
    if (isProject) {
      if (lists.findIndex(it => it.key === 'isProject') === -1) {
        lists.push({ key: 'isProject', value: '项目信息' });
      }
    } else {
      lists = lists.filter(it => it.key !== 'isProject');
    }
    return (
      <div className={style.left}>
        <Form style={{ padding: '1px 0px' }}>
          <Form.Item label="打印模板" colon={false} style={{ marginBottom: '10px' }}>
            <Select onChange={e => this.onChanges(e)} value={templatePdfVo.paperType || templatePdfVo.paperType === 0 ? `${templatePdfVo.paperType}` : '2'}>
              {
                printType.map(it => (
                  <Select.Option key={it.key}>{it.value}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          {
            lists.length &&
            <Form.Item label="基础设置" colon={false}>
              <div className={style.checkbox}>
                {
                  lists.map(it => (
                    <Checkbox
                      key={it.key}
                      checked={templatePdfVo[it.key]}
                      onChange={e => this.onChange(e, it.key)}
                    >
                      {it.value}
                    </Checkbox>
                  ))
                }
              </div>
            </Form.Item>
          }
          <Divider type="horizontal" style={{ marginTop: '14px', marginBottom: '5px' }} />
          {
            expandList && expandList.length > 0 &&
            <Form.Item label="可配置字段" colon={false}>
              <CheckboxGroup
                className={style.checkbox}
                onChange={this.onChangeBasic}
                value={templatePdfVo.templatePdfExpandVos ? templatePdfVo.templatePdfExpandVos.map(it => it.field) : []}
              >
                {
                  expandList.map(it => (
                    <Checkbox key={it.field} value={it.field}>{it.name}</Checkbox>
                  ))
                }
              </CheckboxGroup>
            </Form.Item>
          }
          {
            expandList && expandList.length > 0 &&
            <Divider type="horizontal" style={{ marginTop: '14px', marginBottom: '5px' }} />
          }
          <Form.Item label="公司名称" colon={false}>
            <Checkbox
              checked={templatePdfVo.isCompanyName}
              onChange={e => this.onChange(e, 'isCompanyName')}
            >
              打印
            </Checkbox>
          </Form.Item>
          <Divider type="horizontal" style={{ marginTop: '14px', marginBottom: '5px' }} />
          <Form.Item label="图片" colon={false}>
            <Checkbox
              checked={templatePdfVo.isImage}
              onChange={e => this.onChange(e, 'isImage')}
            >
              打印
            </Checkbox>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Left;
