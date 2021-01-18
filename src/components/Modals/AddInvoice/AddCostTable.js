/* eslint-disable no-unused-vars */
/* eslint-disable guard-for-in */
import React, { Component } from 'react';
import { Form, Select, InputNumber, Table, Button } from 'antd';
import { connect } from 'dva';
import SelectPeople from '../SelectPeople';
import style from './index.scss';
import { numAdd, numMulti } from '../../../utils/float';

const Option = {Select};
@Form.create()
@connect(({ global }) => ({
  expenseList: global.expenseList,
  deptInfo: global.deptInfo,
  userId: global.userId,
  usableProject: global.usableProject,
  lbDetail: global.lbDetail,
  currencyList: global.currencyList,
  currencyShow: global.currencyShow,
}))
class AddCostTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      costDetailShareVOS: this.props.costDetailShareVOS,
      shareAmount: this.props.shareAmount,
      costSum: this.props.costSum,
      initDep: this.props.initDep,
      currencyId: '-1',
      exchangeRate: '1',
    };
    props.onGetForm(this.onGetForm);
  }

  componentDidUpdate(prevProps){
    if ((prevProps.costDetailShareVOS !== this.props.costDetailShareVOS)
      || (prevProps.costSum !== this.props.costSum)
      || (prevProps.currencyId !== this.props.currencyId)
      || (prevProps.exchangeRate !== this.props.exchangeRate)) {
      console.log('AddCostTable -> componentDidUpdate -> this.props.costDetailShareVOS', this.props.costDetailShareVOS);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        costDetailShareVOS: this.props.costDetailShareVOS || [],
        shareAmount: this.props.shareAmount,
        costSum: this.props.costSum,
        initDep: this.props.initDep,
        currencyId: this.props.currencyId || '-1',
        exchangeRate: this.props.exchangeRate || 1,
        currencySymbol: this.props.currencySymbol || '',
      });
    }
  }

  onAdd = () => {
    const { costDetailShareVOS } = this.state;
    const { initDep } = this.state;
    const details = [...costDetailShareVOS];
    console.log('initDep', initDep);
    details.push({
      key: `a${costDetailShareVOS.length}`,
      shareAmount: 0,
      shareScale: 0,
      deptName: '',
      deptId: '',
      depList: initDep,
      invoiceBaseId: details.invoiceBaseId,
      users: [],
    });
    this.props.onChange('costDetailShareVOS', details);
    this.setState({
      costDetailShareVOS: details,
    });
  }

  //  选择承担人
  selectPle = (val, index, key) => {
    const detail = this.state.costDetailShareVOS;
    if (val.users) {
      const params = val.users.length ? { userJson: JSON.stringify(val.users) } : { type: 1 };
      this.props.dispatch({
        type: 'global/users',
        payload: {
          ...params,
        }
      }).then(() => {
        const { deptInfo, userId } = this.props;
        detail.splice(index, 1, {
          ...detail[index],
          users: val.users,
          depList: deptInfo,
          userName: val.users.length ? val.users[0].userName : '',
          userId,
          loanUserId: val.users.length ? val.users[0].userId : '',
          deptId: ''
        });
        if (deptInfo && deptInfo.length === 1) {
          this.props.form.setFieldsValue({
            [`deptId[${key}]`]: `${deptInfo[0].deptId}`,
          });
        } else {
          this.props.form.setFieldsValue({
            [`deptId[${key}]`]: '',
          });
        }
        this.props.onChange('costDetailShareVOS', detail);
        this.setState({
          costDetailShareVOS: detail,
        });

      });
    }
  }

  onInputAmount = (val, key) => {
    const { costSum } = this.state;
    const amm = this.props.form.getFieldValue('shareAmount');
    let amount = 0;
    if (Object.keys(amm)) {
      Object.keys(amm).forEach(it => {
        if (it !== key) {
          amount=numAdd(amm[it], amount);
        }
      });
    }
    amount = numAdd(val, amount);
    this.props.onChange('shareAmount', amount.toFixed(2));
    this.setState({
      shareAmount: amount.toFixed(2),
    });
    if (costSum && (val || val === 0)) {
      const scale = ((val / costSum) * 100).toFixed(2);
      this.props.form.setFieldsValue({
        [`shareScale[${key}]`]: scale,
      });
    }
  }

  onInputScale = (val, key) => {
    const { costSum } = this.state;
    if(!/((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/.test(val)) {
      return;
    }
    if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(val)) {
      return;
    }
    if (val > 100000000 || val === 100000000) {
      return;
    }
    if (val < 0) {
      return;
    }
    if (costSum && (val || val === 0)) {
      // const amounts = ((val * costSum * 10000).toFixed(0) / 100);
      const amounts = (numMulti(val, costSum)/100).toFixed(2);
      this.props.form.setFieldsValue({
        [`shareAmount[${key}]`]: amounts,
      });
      const amm = this.props.form.getFieldValue('shareAmount');
      let amount = 0;
      if (Object.keys(amm)) {
        Object.keys(amm).forEach(it => {
          if (it !== key) {
            amount= numAdd(amm[it], amount);
          }
        });
      }
      amount=numAdd(amounts, amount);
      this.props.onChange('shareAmount', amount.toFixed(2));
      this.setState({
        shareAmount: amount.toFixed(2),
      });
    }
  }

  onDelete = (key) => {
    const { costDetailShareVOS } = this.state;
    const detail = [...costDetailShareVOS];
    console.log('onDelete -> costDetailShareVOS', costDetailShareVOS);
    const count = detail.findIndex(it => it.key === key);
    console.log('onDelete -> count', count);
    if (count > -1) {
      detail.splice(count, 1);
    }
    let shareMount = 0;
    const amm = this.props.form.getFieldValue('shareAmount');
    // eslint-disable-next-line no-restricted-syntax
    for(const keys in amm) {
      if (keys !== key) {
        shareMount+=amm[keys];
      }
    }
    this.props.onChange('costDetailShareVOS', detail);
    this.props.onChange('shareAmount', shareMount.toFixed(2));
    this.setState({
      costDetailShareVOS: detail,
      shareAmount: shareMount.toFixed(2),
    });
  }

  check = (rule, value, callback) => {
    if (value) {
      if(!/((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/.test(value)) {
        callback('请输入正确的金额');
      }
      callback();
    } else {
      callback();
    }
  }

  checkSale = (rule, value, callback) => {
    if (value) {
      if(!/((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/.test(value)) {
        callback('请输入正确的比例');
      }
      if(value > 100) {
        callback('承担比例不超过100');
      }
      callback();
    } else {
      callback();
    }
  }

  onGetForm = (type, details, vals) => {
    let arr = null;
    if (type === 'setScale') {
      const amm = this.props.form.getFieldValue('shareAmount');
      details.forEach(it => {
        if (amm[it.key]) {
          this.props.form.setFieldsValue({
            [`shareScale[${it.key}]`]: ((amm[it.key]/vals) * 100).toFixed(2),
          });
        }
      });
    }
    const { costDetailShareVOS } = this.state;

    if (type === 'submit') {
      this.props.form.validateFieldsAndScroll((err, val) => {
        if (!err) {
          arr = [];
          const { usableProject, invoiceId } = this.props;
          costDetailShareVOS.forEach(item => {
            // eslint-disable-next-line eqeqeq
            const deptList = item.depList.filter(it => it.deptId == val.deptId[item.key]);
            const projectName = val.projectId && val.projectId[item.key] ?
                usableProject.filter(it => it.id === val.projectId[item.key])[0].name : '';
            arr.push({
              key: item.key,
              shareAmount: val.shareAmount[item.key],
              shareScale: val.shareScale[item.key],
              deptId: val.deptId[item.key],
              projectId: val.projectId && val.projectId[item.key] ? val.projectId[item.key] : '',
              projectName,
              userId: item.userId,
              deptName: deptList ? deptList[0].name : '',
              userName: item.userName,
              userJson: item.users,
              users: item.users,
              invoiceBaseId: invoiceId,
              depList: item.depList,
              loanUserId: item.loanUserId,
            });
          });
        } else {
          arr = null;
        }
      });
    }
    return arr;
  }

  render () {
    const {
      form: { getFieldDecorator },
      project,
      usableProject,
    } = this.props;
    const { costDetailShareVOS, shareAmount, costSum, currencyId, currencySymbol, exchangeRate } = this.state;
    const columns = [{
      title: '承担人员',
      dataIndex: 'userId',
      render: (_, record, index) => (
        <div>
          <SelectPeople
            users={record.users}
            placeholder='请选择'
            onSelectPeople={(val) => this.selectPle(val, index, record.key)}
            invalid={false}
            disabled={false}
            flag="users"
            multiple={false}
          />
        </div>
      )
    }, {
      title: '承担部门',
      dataIndex: 'deptId',
      render: (_, record) => (
        <Form>
          <Form.Item>
            {
              getFieldDecorator(`deptId[${record.key}]`, {
                initialValue: record.deptId ? `${record.deptId}` : '',
                rules:[{ required: true, message: '请选择承担部门' }]
              })(
                <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                  {
                    record.depList && record.depList.map(it => (
                      <Option key={`${it.deptId}`}>{it.name}</Option>
                    ))
                  }
                </Select>
              )
            }
          </Form.Item>
        </Form>
      ),
      width: '200px'
    }, {
      title: '承担金额(元)',
      dataIndex: 'shareAmount',
      className: 'moneyCol',
      render: (_, record) => (
        <Form>
          <Form.Item>
            {
              getFieldDecorator(`shareAmount[${record.key}]`, {
                initialValue: record.shareAmount,
                rules:[{ validator: this.check }]
              })(
                <InputNumber
                  placeholder="请输入"
                  onChange={(val) => this.onInputAmount(val, record.key)}
                />
              )
            }
          </Form.Item>
        </Form>
      )
    }, {
      title: '承担比例(%)',
      dataIndex: 'shareScale',
      render: (_, record) => (
        <Form>
          <Form.Item>
            {
              getFieldDecorator(`shareScale[${record.key}]`, {
                initialValue: record.shareScale,
                rules: [{ validator: this.checkSale }]
              })(
                <InputNumber
                  placeholder="请输入"
                  onChange={(val) => this.onInputScale(val, record.key)}
                />
              )
            }
          </Form.Item>
        </Form>
      )
    }, {
      title: '操作',
      dataIndex: 'ope',
      render: (_, record, index) => (
        <span className="deleteColor" onClick={() => this.onDelete(record.key,index)} id={record.id}>删除</span>
      ),
      width: '70px'
    }];
    if (project.status) {
      columns.splice(2, 0, {
        title: '项目',
        dataIndex: 'projectId',
        render: (_, record) => (
          <Form>
            <Form.Item>
              {
                getFieldDecorator(`projectId[${record.key}]`, {
                  initialValue: record.projectId,
                  rules: [{ required: !!(project.isWrite), message: '请选择项目' }]
                })(
                  <Select>
                    {
                      usableProject.map(it => (
                        <Option key={it.id}>{it.name}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
          </Form>
        ),
        width: '180px'
      });
    } else if (columns.length > 5) {
      columns.splice(2,1);
    }
    return (
      <div style={{paddingTop: '24px'}}>
        <div className={style.header}>
          <div className={style.line} />
          <span>分摊</span>
        </div>
        <div style={{textAlign: 'center'}} className={style.addbtn}>
          <Button icon="plus" style={{ width: '231px' }} onClick={() => this.onAdd()}>添加分摊</Button>
        </div>
        {
          costDetailShareVOS && costDetailShareVOS.length > 0 &&
          <p style={{marginBottom: 0}} className="m-b-8 li-24 c-black-85 fw-500">
            ¥{ currencyId && currencyId !== '-1' ? `${Number(numMulti(costSum, exchangeRate)).toFixed(2)}(${currencySymbol}${costSum})` : costSum}  已分摊：¥{ currencyId && currencyId !== '-1' ? `${Number(numMulti(Number(shareAmount), exchangeRate)).toFixed(2)}(${currencySymbol}${shareAmount})` : shareAmount}
          </p>
        }
        {
          costDetailShareVOS && costDetailShareVOS.length > 0 &&
          <div className={style.addTable}>
            <Table
              columns={columns}
              dataSource={costDetailShareVOS}
              pagination={false}
              rowKey="key"
            />
          </div>
        }
      </div>

    );
  }
}

export default AddCostTable;
