import React from 'react';
import { Modal, Form, Input, Select, Button, message, Switch, Checkbox, Cascader } from 'antd';
import { connect } from 'dva';
import TextArea from 'antd/lib/input/TextArea';
import { formItemLayout, accountType, defaultTitle, bankList } from '@/utils/constants';
import UploadImg from '@/components/UploadImg';
import treeConvert from '@/utils/treeConvert';
import { compare } from '../../../../utils/common';

const labelInfo = {
  type: '账户类型',
  name: '收款人名称',
  account: '银行卡号',
  note: '备注',
  defaultStatus: '启用',
  status: '启用',
  bankNameBranch: '开户支行',
  awAreas: '开户省市',
  imgUrl: '收款码'
};
const {Option} = Select;
@Form.create()
@connect(({ loading, session, receiptAcc, costGlobal }) => ({
  userInfo: session.userInfo,
  loading: loading.effects['receiptAcc/add'] || loading.effects['receiptAcc/edit'] || false,
  detail: receiptAcc.detail,
  areaCode: costGlobal.areaCode,
}))
class AddAccount extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: '0',
      visible: false,
      imgUrl: [],
      isShowInput: false,
    };
  }

  onShow = () => {
    const { record } = this.props;
    let type = '0';
    this.props.dispatch({
      type: 'costGlobal/area',
      payload: {}
    }).then(() => {
      const { areaCode } = this.props;
      console.log('AddAccount -> onShow -> areaCode', areaCode);
      const treeList = treeConvert({
        rootId: 0,
        pId: 'pid',
        name: 'areaName',
        id: 'areaCode',
        tName: 'label',
        tId: 'value'
      }, areaCode);
    if (record) {
      ({ type } = record);
      this.props.dispatch({
        type: 'receiptAcc/detail',
        payload: {
          id: record.id
        }
      }).then(() => {
        const { detail } = this.props;
        const isInput = detail.bankName && (
          bankList.findIndex(it => it === detail.bankName) === -1 ||
          detail.bankName === '其他银行'
        );
        this.setState({
          visible: true,
          type,
          imgUrl: detail.qrUrl ? [{ imgUrl: detail.qrUrl }] : [],
          isShowInput: isInput,
          data: {
            ...detail,
            awAreas: detail.awAreas ?
              detail.awAreas.sort(compare('level')).map(it => it.areaCode) : undefined,
            bankName: isInput ? '其他银行' : detail.bankName,
            bankName1: isInput && detail.bankName !== '其他银行' ? detail.bankName : ''
          },
          treeList
        });
      });
    } else {
      this.setState({
        visible: true,
        type,
        treeList
      });
    }
  });
  }

  onChangeAccount = (val) => {
    this.props.form.setFieldsValue({
      bankName1: '',
    });
    this.setState({
      isShowInput: val === '其他银行',
    });
  }

  onRest = () => {
    this.props.form.resetFields();
    this.setState({
      type: '0',
      imgUrl: [],
      isShowInput: false,
    });
  }

  handleOk = (e) => {
    e.preventDefault();
    const {
      dispatch,
      form,
      onOk,
      detail,
      userInfo,
      title,
      areaCode
    } = this.props;
    const { imgUrl } = this.state;
    form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const payload = {
          ...value,
          companyId: userInfo.companyId || '',
          type: Number(value.type),
          status: value.status ? 1 : 0,
          awAreas: value.awAreas ?
            value.awAreas.map(it => {
              const items = areaCode.filter(item => item.areaCode === it)[0];
              return { ...items };
            }) : [],
        };
        if ((Number(value.type) === 1 || Number(value.type) === 3)) {
          Object.assign(payload, {
            qrUrl: imgUrl.length ? imgUrl[0].imgUrl : '',
          });
        }
        let action = 'receiptAcc/add';
        if (title === 'edit') {
          action = 'receiptAcc/edit';
          Object.assign(payload, {
            id: detail.id,
          });
        }

        dispatch({
          type: action,
          payload: {
            ...payload,
            bankName: payload.bankName === '其他银行' ? value.bankName1 : payload.bankName,
          },
        }).then(() => {
          message.success('操作成功');
          this.setState({
            visible: false,
          });
          this.onRest();
          onOk();
        });
      }
    });
  }

  onChange = (value) => {
    this.setState({
      type: value,
      isShowInput: false,
    }, () => {
      if (Number(value) === 0) {
        console.log('走了吗');
        this.props.form.setFieldsValue({
          bankName: null,
        });
      }
    });
  }

  onChangeImg = val => {
    this.setState({
      imgUrl: val,
    });
  }

  render() {
    const {
      children,
      form: { getFieldDecorator },
      title,
      userInfo,
    } = this.props;
    const {
      type,
      visible,
      loading,
      data,
      treeList,
      imgUrl,
      isShowInput,
    } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{ children }</span>
        <Modal
          title={title && `${defaultTitle[title]}收款账户`}
          visible={visible}
          bodyStyle={{height: '400px', overflowY: 'scroll'}}
          onCancel={() => {
            this.onRest();
            this.setState({ visible: false });
          }}
          maskClosable={false}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                this.onRest();
                this.setState({ visible: false });
              }}
            >
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.handleOk}
              loading={loading}
            >
              保存
            </Button>
          ]}
        >
          <Form {...formItemLayout} className="formItem">
            <Form.Item label={labelInfo.type}>
              {
                getFieldDecorator('type', {
                  initialValue: Number(type),
                })(
                  <Select
                    onChange={this.onChange}
                  >
                    {
                      accountType.map(item => (
                        <Option key={item.key} value={item.key}>{item.value}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
            <Form.Item label={labelInfo.name}>
              {
                getFieldDecorator('name', {
                  initialValue: data && data.name,
                  rules: [
                    { required: true, message: '请输入名称' },
                    { max: 20, message: '不超过20个字' }
                  ]
                })(
                  <Input placeholder={Number(type) === 1 ? '请输入与账号匹配的已实名姓名' : '请输入'} />
                )
              }
            </Form.Item>
            {
              Number(type) !== 2 && Number(type) !==4 &&
              <Form.Item label={Number(type) === 0 ? labelInfo.account : '账号'}>
                {
                  getFieldDecorator('account', {
                    initialValue: data && data.account,
                    rules: [{ required: (Number(type) !== 2 && Number(type) !== 4), message: `请输入${Number(type) === 0 ? labelInfo.account : '账号'}` }]
                  })(
                    <Input placeholder="请输入" />
                  )
                }
              </Form.Item>
            }
            {
              Number(type) === 0 &&
              <Form.Item label="开户行">
                {
                  getFieldDecorator('bankName', {
                    initialValue: data && data.bankName,
                    rules: [
                      {
                        required: !!(Number(type) === 0),
                        message: '请选择开户行'
                      }
                    ]
                  })(
                    <Select
                      showSearch
                      placeholder="请选择"
                      onChange={this.onChangeAccount}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {
                        bankList.map((it) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <Option key={it} value={it}>{it}</Option>
                        ))
                      }
                    </Select>
                  )
                }
              </Form.Item>
            }
            {
              isShowInput && Number(type) === 0 &&
              <Form.Item label='开户行名称'>
                {
                  getFieldDecorator('bankName1', {
                    initialValue: data && data.bankName1,
                    rules: [{
                      required: !!(Number(type) === 0),
                      message: '请输入开户行'
                    }]
                  })(
                    <Input placeholder="请输入开户行" />
                  )
                }
              </Form.Item>
            }
            {
              Number(type) === 0 &&
              <Form.Item label={labelInfo.awAreas}>
                {
                  getFieldDecorator('awAreas', {
                    initialValue: (data && data.awAreas) || [],
                    rules: [{
                      required: !!(Number(type) === 0),
                      message: `请选择${labelInfo.awAreas}`
                    }]
                  })(
                    <Cascader
                      options={treeList}
                      placeholder={`请选择${labelInfo.awAreas}`}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    />
                  )
                }
              </Form.Item>
            }
            {
              Number(type) === 0 &&
              <Form.Item label={labelInfo.bankNameBranch}>
                {
                  getFieldDecorator('bankNameBranch', {
                    initialValue: data && data.bankNameBranch,
                    rules:[{
                      required: !!(Number(type) === 0),
                      message: `请输入${labelInfo.bankNameBranch}`
                    }]
                  })(
                    <Input placeholder={`请输入${labelInfo.bankNameBranch}`} />
                  )
                }
              </Form.Item>
            }
            <Form.Item label={labelInfo.note}>
              {
                getFieldDecorator('note', {
                  initialValue: data && data.note,
                })(
                  <TextArea placeholder="请输入" />
                )
              }
            </Form.Item>
            {
              (Number(type) === 1 || Number(type) === 3) &&
              <Form.Item
                label={labelInfo.imgUrl}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('img', {
                    initialValue: imgUrl.length ? imgUrl : null,
                  })(
                    <UploadImg
                      onChange={(val) => this.onChangeImg(val)}
                      imgUrl={imgUrl}
                      userInfo={userInfo}
                      maxLen={1}
                    />
                  )
                }
              </Form.Item>
            }
            <Form.Item label={labelInfo.status}>
              <div>
                {
                  getFieldDecorator('status', {
                    initialValue: !!((data && data.status === 1)) || (title === 'add'),
                    valuePropName: 'checked'
                  })(
                    <Switch />
                  )
                }
              </div>
              {
                getFieldDecorator('isDefault', {
                  initialValue: data && data.isDefault,
                  valuePropName: 'checked'
                })(
                  <Checkbox>设为默认</Checkbox>
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default AddAccount;
