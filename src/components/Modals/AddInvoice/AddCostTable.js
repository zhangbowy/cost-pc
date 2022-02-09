/* eslint-disable no-unused-vars */
/* eslint-disable guard-for-in */
import React, { Component } from 'react';
import { Form, Select, InputNumber, Table, Button, message, Popconfirm } from 'antd';
import { connect } from 'dva';
import cs from 'classnames';
import SelectPeople from '../SelectPeople';
import style from './index.scss';
import { numAdd, numMulti } from '../../../utils/float';
import ExportFile from '../ExportFile';
import { rowSelect, getTimeId } from '../../../utils/common';

const { Option } = Select;
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
      shareAmount: this.props.shareAmount || 0,
      costSum: this.props.costSum,
      currencyId: '-1',
      exchangeRate: '1',
      selectedRowKeys: [],
      selectedRows: [],
    };
    props.onGetForm(this.onGetForm);
  }

  static getDerivedStateFromProps(prevProps, state) {
    if ((prevProps.costDetailShareVOS !== state.costDetailShareVOS)
      || (prevProps.costSum !== state.costSum)
      || (prevProps.currencyId !== state.currencyId)
      || (prevProps.exchangeRate !== state.exchangeRate)) {
      console.log('AddCostTable -> componentDidUpdate -> this.props.costDetailShareVOS', prevProps.costDetailShareVOS);
      // eslint-disable-next-line react/no-did-update-set-state
      return{
        costDetailShareVOS: prevProps.costDetailShareVOS || [],
        shareAmount: prevProps.shareAmount || 0,
        costSum: prevProps.costSum,
        currencyId: prevProps.currencyId || '-1',
        exchangeRate: prevProps.exchangeRate || 1,
        currencySymbol: prevProps.currencySymbol || '',
      };
    }
    return null;
  }

  onAddCost = (obj) => {
    const { costDetailShareVOS } = this.state;
    const { modify } = this.props;
    const details = [...costDetailShareVOS];
    if (modify) {
      message.error('改单不允许更改分摊');
      return;
    }
    let newArr = [...details];
    if (obj.content) {
      newArr = [...details, obj.content];
    }
    const keyArr = newArr.map((it, index) => {
      if (!it.key) {
        return {
          key: `aaa_${index}`,
          ...it,
        };
      }
      return { ...it };
    });
    this.props.onChange('costDetailShareVOS', details);
    this.setState({
      costDetailShareVOS: details,
    });
  }


  onSelectAll = (selected, selectedRows, changeRows) => {
    const result = rowSelect.onSelectAll(this.state, selected, changeRows, 'key');
    const _selectedRows = result.selectedRows;
    const { selectedRowKeys } = result;
    this.setState({
        selectedRowKeys,
        selectedRows: _selectedRows,
    });
  };

  onSelect = (record, selected) => {
    const {
        selectedRows,
        selectedRowKeys,
    } = rowSelect.onSelect(this.state, record, selected, 'key');
    this.setState({
        selectedRowKeys,
        selectedRows,
    });
  };

  onAdd = () => {
    const { costDetailShareVOS } = this.state;
    const { modify } = this.props;
    const { initDep } = this.props;
    const details = [...costDetailShareVOS];
    if (modify) {
      message.error('改单不允许更改分摊');
      return;
    }
    details.push({
      key: `a${getTimeId()}_${costDetailShareVOS.length}`,
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
    const { officeId } = this.props;
    console.log('AddCostTable -> selectPle -> officeId', officeId);
    if (val.users) {
      const params = val.users.length ? { userJson: JSON.stringify(val.users) } : { type: 1 };
      this.props.dispatch({
        type: 'global/users',
        payload: {
          ...params,
          officeId,
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
          dingUserId: val.users.length ? val.users[0].userId : '',
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

  // 删除操作
  onDelete = (key) => {
    const { costDetailShareVOS } = this.state;
    const { modify } = this.props;
    if (modify) return;
    const detail = [...costDetailShareVOS];
    console.log('onDelete -> costDetailShareVOS', costDetailShareVOS);
    // const count = detail.findIndex(it => it.key === key);
    // console.log('onDelete -> count', count);
    // if (count > -1) {
    //   detail.splice(count, 1);
    // }
    const newArr = detail.filter(it => !key.includes(it.key));
    console.log('onDelete -> newArr', newArr);
    let shareMount = 0;
    const amm = this.props.form.getFieldValue('shareAmount');
    console.log('onDelete -> amm', amm);
    // eslint-disable-next-line no-restricted-syntax
    for(const keys in amm) {
      if (!key.includes(keys)) {
        shareMount+=amm[keys];
      }
    }
    this.props.onChange('costDetailShareVOS', newArr || []);
    this.props.onChange('shareAmount', shareMount.toFixed(2));
    this.setState({
      costDetailShareVOS: newArr || [],
      shareAmount: shareMount.toFixed(2),
      selectedRowKeys: [],
      selectedRows: [],
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
              id: item.id || '',
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
              dingUserId: item.loanUserId,
            });
          });
        } else {
          arr = null;
        }
      });
    }
    console.log('测试分摊的数组', arr);
    return arr;
  }

  onAdds = async({ exportList }) => {
    const list = exportList && exportList.length ? exportList : [];
    const arrs = [];
    const { costDetailShareVOS, costSum, shareAmount } = this.state;
    console.log('onAdds -> costSum', costSum);
    const { modify } = this.props;
    const details = [...costDetailShareVOS];
    if (modify) {
      message.error('改单不允许更改分摊');
      return;
    }
    const old = shareAmount ? Number((shareAmount * 100).toFixed(0)) : 0;
    let amount = old;
    list.forEach((it, index) => {
      amount+=it.costAmount;
      console.log('onAdds -> amount', amount);
      arrs.push({
        ...it,
        key: `export_${getTimeId()}_${index}`,
        shareAmount: it.costAmount/100,
        shareScale: ((((it.costAmount/100)/costSum) * 10000).toFixed(0))/100,
        depList: it.deptObject,
        invoiceBaseId: details.invoiceBaseId,
        users: it.userId ? [{ userId: it.userId, name: it.userName, userName: it.userName }] : [],
      });
    });
    console.log(shareAmount, shareAmount*100 + amount);
    const newArr = [...details, ...arrs];
    this.props.onChange('costDetailShareVOS', newArr);
    this.props.onChange('shareAmount', amount/100);
    this.setState({
      costDetailShareVOS: newArr,
      shareAmount: amount/100,
    });
  }

  // 平均分摊
  onPro = () => {
    const { costDetailShareVOS, costSum } = this.state;
    const arr = [];
    let sum = 0;
    let scaleSum = 0;
    const len = costDetailShareVOS.length;
    costDetailShareVOS.forEach((it, index) => {
      let mon = Number(((costSum/(len)) * 100).toFixed(0));
      let scale = Number(((100/len) * 100).toFixed(0));
      if (index === (len-1)) {
        mon = (costSum - sum/100).toFixed(2);
        scale = (100-scaleSum/100).toFixed(2);
      }
      sum+=mon;
      scaleSum+=scale;
      arr.push({
        ...it,
        shareAmount: index === (len-1) ? mon : mon/100,
        shareScale: index === (len-1) ? scale : scale/100,
      });
      this.props.form.setFieldsValue({
        [`shareAmount[${it.key}]`]: index === (len-1) ? mon : mon/100,
        [`shareScale[${it.key}]`]: index === (len-1) ? scale : scale/100,
      });
    });
    console.log('平均分摊', arr);
    console.log('平均分摊', costSum);
    this.props.onChange('costDetailShareVOS', arr);
    this.props.onChange('shareAmount', costSum);
    this.setState({
      costDetailShareVOS: arr,
      shareAmount: costSum,
    });
  }

  render () {
    const {
      form: { getFieldDecorator },
      project,
      usableProject,
      modify,
      expenseId,
      uniqueId,
      officeId
    } = this.props;
    const { costDetailShareVOS, shareAmount, costSum, currencyId,
      currencySymbol, exchangeRate, selectedRowKeys } = this.state;

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
            disabled={modify}
            flag="users"
            multiple={false}
            className={style.selPeople}
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
                initialValue: record.deptId ? `${record.deptId}` : undefined,
                rules:[{ required: true, message: '请选择承担部门' }]
              })(
                <Select
                  disabled={modify}
                  style={{ width: '120px' }}
                  placeholder="请选择"
                  dropdownMatchSelectWidth={false}
                  showSearch
                  optionFilterProp="label"
                >
                  {
                    record.depList && record.depList.map(it => (
                      <Option key={`${it.deptId}`} label={it.name}>{it.name}</Option>
                    ))
                  }
                </Select>
              )
            }
          </Form.Item>
        </Form>
      ),
      width: '150px'
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
        <Popconfirm
          placement="topRight"
          title="确认删除分摊项吗？"
          onConfirm={() => this.onDelete([record.key])}
        >
          <span
            className="deleteColor"
            id={record.id}
          >
            删除
          </span>
        </Popconfirm>
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
                  rules: [{ required: (!!(project.isWrite) && !modify), message: '请选择项目' }]
                })(
                  <Select
                    disabled={modify}
                    style={{ width: '120px' }}
                    placeholder="请选择"
                  >
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
        width: '150px'
      });
    } else if (columns.length > 5) {
      columns.splice(2,1);
    }
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
      columnWidth: '24px'
    };
    return (
      <div style={{paddingTop: '24px'}}>
        <div className={style.header} style={{ display: 'flex', alignItems: 'center' }}>
          <div className={style.line} />
          <span>分摊</span>
          {
            costDetailShareVOS && costDetailShareVOS.length > 0 &&
            <p style={{marginBottom: 0}} className="li-24 c-black-85 fw-500">
              （共{costDetailShareVOS.length}个分摊项，
              总金额：¥{ currencyId && currencyId !== '-1' ?
              `${Number(numMulti(costSum, exchangeRate)).toFixed(2)}(${currencySymbol}${costSum})` : costSum}
              <span className="m-l-8">
                已分摊：¥{ currencyId && currencyId !== '-1' ?
              `${Number(numMulti(Number(shareAmount), exchangeRate)).toFixed(2)}(${currencySymbol}${shareAmount})` : shareAmount}）
              </span>
            </p>
          }
        </div>
        {
          costDetailShareVOS && costDetailShareVOS.length > 0 ?
            <div className="m-b-12">
              <Button className="m-r-8" type="primary" onClick={() => this.onAdd()}>添加分摊</Button>
              <ExportFile
                expenseId={expenseId}
                callback={this.onAdds}
                uniqueId={uniqueId}
                officeId={officeId}
              >
                <Button className="m-r-8" type="default" disabled={!costSum}>批量导入</Button>
              </ExportFile>
              <Button className="m-r-8" type="default" onClick={() => this.onPro()} disabled={!costSum}>平均分摊</Button>
              <Popconfirm
                placement="topRight"
                title="确认删除分摊项吗？"
                onConfirm={() => this.onDelete(selectedRowKeys)}
              >
                <Button
                  disabled={!(selectedRowKeys.length)}
                  className={cs(selectedRowKeys.length && style.delButton, 'm-r-8')}
                >
                  批量删除
                </Button>
              </Popconfirm>
            </div>
            :
            <div style={{textAlign: 'center'}} className={style.addbtn}>
              <Button icon="plus" style={{ width: '231px' }} onClick={() => this.onAdd()}>添加分摊</Button>
            </div>
        }


        {
          costDetailShareVOS && costDetailShareVOS.length > 0 &&
          <div className={style.addTable}>
            <Table
              columns={columns}
              dataSource={costDetailShareVOS}
              pagination={false}
              rowSelection={rowSelection}
              rowKey="key"
            />
          </div>
        }
      </div>

    );
  }
}

export default AddCostTable;
