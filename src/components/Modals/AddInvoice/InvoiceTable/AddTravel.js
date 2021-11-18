/* eslint-disable eqeqeq */
import React, { PureComponent } from 'react';
import { Divider, Form, Row, Button, Select, Col, Tree, TreeSelect, Tooltip, Popconfirm } from 'antd';
import cs from 'classnames';
import fields from '@/utils/fields';
import style from '../index.scss';
import AddTravelForm from './AddTravelForm';
import { getParams, timeDateStr, dateToStr } from '../../../../utils/common';
import Avatar from '../../../AntdComp/Avatar';

const { aliTraffic } = fields;
const { Option } = Select;
const { TreeNode } = Tree;
const cost = [{
  label: '按分摊计入',
  value: '按分摊计入',
}, {
  label: '均计入申请人',
  value: '均计入申请人',
}];
@Form.create()
class AddTravel extends PureComponent {

  state = {
    subTrip: this.props.hisAliTrip.subTrip || [],
    fellowTravelers: this.props.hisAliTrip.fellowTravelers || [],
    selectKeys: [],
  }

  componentDidMount(){
    this.props.onGetFunc(this.onSubmit);
    this.props.onResetFun(this.onReset);
  }

  onGetTrip = (list) => {
    this.setState({
      subTrip: list,
    });
  }

  onSubmit = async(flag) => {
    const { aliCostAndI: { costArr, invoiceArr } } = this.props;
    const { subTrip } = this.state;
    const { form: { validateFieldsAndScroll } } = this.props;
    const { selectKeys, fellowTravelers } = this.state;
    const newFellow = [];
    fellowTravelers.forEach(it => {
      if (selectKeys.includes(it.key)) {
        newFellow.push(it);
      }
    });
    if (!flag) {
      return new Promise (resolve => {
        validateFieldsAndScroll((err, val) => {
          if (!err) {
            const params = { subTrip, fellowTravelers: newFellow };
            if (val.alitripCostCenterId) {
              const alitripCostCenterJson = costArr.filter(it => it.value == val.alitripCostCenterId);
              Object.assign(params, {
                alitripCostCenterId: val.alitripCostCenterId,
                alitripCostCenterJson: JSON.stringify(alitripCostCenterJson[0]),
              });
            }
            if (val.alitripInvoiceTitleId) {
              const alitripInvoiceTitleJson = invoiceArr.filter(it => it.value == val.alitripInvoiceTitleId);
              Object.assign(params, {
                alitripInvoiceTitleId: val.alitripInvoiceTitleId,
                alitripInvoiceTitleJson: JSON.stringify(alitripInvoiceTitleJson[0]),
              });
            }
            if (val.alitripExpensesOwner) {
              Object.assign(params, {
                alitripExpensesOwner: val.alitripExpensesOwner,
              });
            }
            resolve(params);
          }
        });
      });
    }
      const value = this.props.form.getFieldsValue();
      let objs = { subTrip,
        alitripExpensesOwner: value.alitripExpensesOwner,
        fellowTravelers: newFellow };

      if (value.alitripCostCenterId) {
        const alitripCostCenterJson = costArr.filter(it => it.value == value.alitripCostCenterId);
        objs = {
          ...objs,
          alitripCostCenterId: value.alitripCostCenterId,
          alitripCostCenterJson: JSON.stringify(alitripCostCenterJson[0]),
        };
      }
      if (value.alitripInvoiceTitleId) {
        const alitripInvoiceTitleJson = invoiceArr.filter(it => it.value == value.alitripInvoiceTitleId);
        objs = {
          ...objs,
          alitripInvoiceTitleId: value.alitripInvoiceTitleId,
          alitripInvoiceTitleJson: JSON.stringify(alitripInvoiceTitleJson[0]),
        };
      }
      return new Promise(resolve => {
        resolve(objs);
      });
    // this.onOk();
  }

  onReset = () => {
    this.props.form.resetFields();
    this.setState({
      subTrip: [],
    });
  }

  onDel = (e, index) => {
    e.stopPropagation();
    const { subTrip } = this.state;
    const arr = [...subTrip];
    arr.splice(index, 1);
    console.log('删除一下', arr);
    this.setState({
      subTrip: arr,
    });
  }

  // 循环渲染树结构
  loop = data => data.map(item => {
    const { userInfo } = this.props;
    if (item.children && item.children.length) {
      return (
        <TreeNode
          key={item.key}
          label={item.title}
          value={item.key}
          dataRef={item}
          disabled={userInfo.dingUserId === item.value}
          title={(
            <div>
              {
                item.type ?
                  <Avatar avatar={item.avatar} name={item.title} size={24} />
                  :
                  null
              }
              <span>{item.title}</span>
            </div>
          )}
        >
          {this.loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode
      key={item.key}
      label={item.title}
      value={item.key}
      dataRef={item}
      disabled={userInfo.dingUserId === item.value}
      title={(
        <div className="icons">
          {
            item.type !== 0 &&
            <Avatar avatar={item.avatar} name={item.title} size={24} />
          }
          <span className="m-l-8" style={{verticalAlign: 'middle'}}>{item.title}</span>
        </div>
      )}
    />;
  });

  onChangeNode = (value) => {
    this.setState({
      selectKeys: value,
    });
  }

  getAllChild = (nodes, parent) => {
    let arr = [];
    for(let i=0; i<nodes.length;i++) {
      const item = nodes[i];
      if (nodes[i].type === 0) {
        const result = this.getAllChild(nodes[i].children, nodes[i]);
        if (result.length) {
          arr = [...arr, ...result];
        }
      } else {
        arr.push({
          userName: item.title,
          key: item.key,
          userId: item.value,
          oaUserId: item.oaId,
          pId: parent.key,
          deptId: parent.value,
          deptName: parent.title,
          avatar: item.avatar,
        });
      }
    }
    return arr;
  }

  onSelect = (value, info) => {
    console.log('选中de', info);
    console.log('选中de', value);
    const { dataRef } = info.props;
    const { fellowTravelers } = this.state;
    const newArr = [...fellowTravelers];
    const keys = newArr.map(it => it.key);
    if (dataRef.type === 0) {
      const newArrs = this.getAllChild(dataRef.children, dataRef);
      const keysArr = newArr.filter(it => it.key);
      newArrs.forEach(it => {
        if (!keysArr.includes(it.key)) {
          newArr.push({ ...it });
        }
      });
    } else if (!keys.includes(dataRef.key)) {
        newArr.push({
          key: dataRef.key,
          userId: dataRef.value, // 钉钉userId
          'name': dataRef.title, // 名称
          'userName':dataRef.title, // 名称  兼容userJson字段名称
          'nickname': dataRef.title,
          'deptId': dataRef.deptId, // 钉钉部门id
          'deptName': dataRef.deptName, // 部门名称
          'oaUserId': dataRef.oaId, // oa的用户id
        });
    }

    this.setState({
      fellowTravelers: newArr,
    });
  }

  render () {
    const { aliTripFields, aliTripAuth, form: { getFieldDecorator }, hisAliTrip } = this.props;
    const { aliCostAndI, deptTree } = aliTripFields;
    console.log('阿里商旅', deptTree);
    const { subTrip } = this.state;
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
    return (
      <div className="formItem">
        <Divider type="horizontal" />
        <div style={{paddingTop: '24px'}}>
          <div className={style.header}>
            <div className={style.line} />
            <span>行程</span>
          </div>
        </div>
        {
          subTrip.length === 0 ?
            <div style={{textAlign: 'center'}} className={style.addbtn}>
              <AddTravelForm
                onOk={this.onGetTrip}
                hasFellowTraveler={aliTripAuth.alitripSetting && aliTripAuth.alitripSetting.hasFellowTraveler}
              >
                <Button
                  icon="plus"
                  style={{ width: '231px', marginBottom: '16px' }}
                  key="handle"
                >
                  添加行程
                </Button>
              </AddTravelForm>
            </div>
            :
            <div className={style.travelDetail}>
              <AddTravelForm
                onOk={this.onGetTrip}
                list={subTrip}
                hasFellowTraveler={aliTripAuth.alitripSetting && aliTripAuth.alitripSetting.hasFellowTraveler}
              >
                <div className={style.singleBtn}>
                  <span>+ 添加行程</span>
                </div>
              </AddTravelForm>
              <>
                {
                  subTrip.map((item, index) => (
                    <AddTravelForm
                      onOk={this.onGetTrip}
                      list={subTrip}
                      key={item.key}
                      hasFellowTraveler={aliTripAuth.alitripSetting && aliTripAuth.alitripSetting.hasFellowTraveler}
                    >
                      <div className={style.singleContent} key={item.startDate}>
                        <div className={style.iconImg}>
                          <img
                            src={getParams({res: item.traffic, list: aliTraffic, key: 'label', resultKey: 'icon'})}
                            alt="模式"
                          />
                        </div>
                        <div className="m-t-16">
                          <p className={style.cityContent}>{item.startCity} - {item.endCity}({item.way})</p>
                          <p className="c-black-65 fs-12">
                            {dateToStr(item.startDate, 'YYYY.MM.DD')} {timeDateStr(item.startDate)} - {dateToStr(item.endDate, 'YYYY.MM.DD')} {timeDateStr(item.endDate)}
                          </p>
                        </div>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Popconfirm title="确认删除该行程吗？" onConfirm={e => this.onDel(e, index)}>
                            <i className={cs(style.singleDel, 'iconfont', 'icona-shanchu3x')} />
                          </Popconfirm>
                        </span>
                      </div>
                    </AddTravelForm>
                  ))
                }
              </>
            </div>
        }
        {
          aliTripAuth.alitripSetting && aliTripAuth.alitripSetting.hasFellowTraveler &&
          <Row>
            {/* <EasyForm
              isModal={false}
              fields={aliTripFields}
              ref={ref => { this.easyForm = ref; }}
              mode="plain"
              separate
            /> */}
            <Col span={12}>
              <Form.Item label="成本中心" {...formItemLayout}>
                {
                  getFieldDecorator('alitripCostCenterId', {
                    initialValue: hisAliTrip.alitripCostCenterId ?
                    `${hisAliTrip.alitripCostCenterId}`: undefined,
                    rules: [
                      {
                        required: true,
                        message: '请输入成本中心'
                      }
                    ],
                  })(
                    <Select style={{width: '100%'}} placeholder="请选择">
                      {
                        aliCostAndI.costArr.map(it => (
                          <Option key={`${it.value}`}>{it.label}</Option>
                        ))
                      }
                    </Select>
                  )
                }
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="发票抬头" {...formItemLayout}>
                {
                  getFieldDecorator('alitripInvoiceTitleId', {
                    initialValue: hisAliTrip.alitripInvoiceTitleId ?
                    `${hisAliTrip.alitripInvoiceTitleId}` : undefined,
                    rules: [
                      {
                        required: true,
                        message: '请输入发票抬头'
                      }
                    ],
                  })(
                    <Select style={{width: '100%'}} placeholder="请选择">
                      {
                        aliCostAndI.invoiceArr.map(it => (
                          <Option key={`${it.value}`}>{it.label}</Option>
                        ))
                      }
                    </Select>
                  )
                }
              </Form.Item>
            </Col>
            {
              aliTripAuth.alitripSetting.isEnable &&
              <>
                <Col span={12} className={style.treeSelects}>
                  <Form.Item label="同行人" {...formItemLayout}>
                    {
                      getFieldDecorator('fellowTravelers', {
                        initialValue: hisAliTrip.fellowTravelers ?
                        hisAliTrip.fellowTravelers.map(it => {
                          return it.key || `${it.deptId}${it.userId}`;
                        }) : undefined,
                      })(
                        <TreeSelect
                          treeNodeFilterProp="label"
                          placeholder='请选择'
                          style={{width: '100%'}}
                          dropdownStyle={{height: '300px'}}
                          treeCheckable
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                          showSearch
                          onChange={this.onChangeNode}
                          onSelect={this.onSelect}
                          treeNodeLabelProp="label"
                        >
                          { this.loop(deptTree) }
                        </TreeSelect>
                      )
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={(
                      <span>
                        费用归属
                        <Tooltip title={(
                          <>
                            <p>按分摊计入：商旅订单有除申请人之外的其他同行人，费用归属按照对应承担金额分别统计;</p>
                            <p>均计入申请人：无论是否有同行人(分摊)，该申请单的行程费用均计入申请人及其部门</p>
                          </>
                          )}
                        >
                          <i className="iconfont iconshuomingwenzi m-l-4" style={{ verticalAlign: 'middle' }} />
                        </Tooltip>
                      </span>
                    )}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('alitripExpensesOwner', {
                        initialValue: hisAliTrip.alitripExpensesOwner || '按分摊计入',
                        rules: [
                          {
                            required: true,
                            message: '请输入费用归属'
                          }
                        ],
                      })(
                        <Select style={{width: '100%'}} placeholder="请选择">
                          {
                            cost.map(it => (
                              <Option key={it.value}>{it.label}</Option>
                            ))
                          }
                        </Select>
                      )
                    }
                  </Form.Item>
                </Col>
              </>
            }
          </Row>
        }
      </div>
    );
  }
}

export default AddTravel;
