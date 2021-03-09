import React, { PureComponent } from 'react';
import { Form, Select, Divider, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import fields from '@/utils/fields';
import lists from './list';
import style from './submitReport.scss';
import TempTable from './TempTable';
import { dateToTime } from '../../../../utils/util';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TreeNode } = TreeSelect;
@Form.create()
class SubmitReport extends PureComponent {

  state = {
    isShow: false,
  }

  onChange = value => {
    const { chart, submitTime } = this.props;
    if (value === '-1') {
      this.setState({
        isShow: true,
      });
    } else {
      chart({
        url: 'submitReport',
        payload: this.setVal({
          ...submitTime,
          ...dateToTime(value),
        })
      }, () => {
        this.props.onChangeData('submitTime', {
          ...submitTime,
          ...dateToTime(value),
          type: value
        });
        this.setState({
          isShow: false,
        });
      });
    }
  }

  setVal = ({ type, startTime, endTime, deptIds }) => {
    let dateType = 0;
    if (type.indexOf('q') > -1) {
      dateType = 1;
    } else if (type.indexOf('y') > -1) {
      dateType = 2;
    }
    const obj = {
      dateType,
      startTime,
      endTime,
    };
    if (deptIds) {
      Object.assign(obj, { deptIds });
    }
    return obj;
  }

  onChangeDate = (date, dateString) => {
    const { chart, submitTime } = this.props;
    chart({
      url: 'submitReport',
      payload: this.setVal({
        startTime: dateString.length ? moment(`${dateString[0]} 00:00:01`).format('x') : '',
        endTime: dateString.length ? moment(`${dateString[1]} 23:59:59`).format('x') : '',
      })
    }, () => {
      this.props.onChangeData('submitTime', {
        ...submitTime,
        startTime: dateString.length ?
          moment(`${dateString[0]} 00:00:01`).format('x') : '',
        endTime: dateString.length ?
          moment(`${dateString[1]} 23:59:59`).format('x') : '',
      });
    });
  }

  treeNodeRender = (treeNode) => {
    if(!treeNode || !treeNode.length){
      return;
    }
      return treeNode.map((v) => {
        return (
          <TreeNode
            value={v.deptId}
            title={(
              <span className="c-black-85" style={{color: 'rgba(0,0,0,0.85)!important'}}>{v.deptName}</span>
            )}
            key={v.deptId}
            searchs={v.deptName}
            disabled
          >
            {v.children && this.treeNodeChildRender(v.children, v.deptName)}
          </TreeNode>
        );
      });
    }

  treeNodeChildRender = (list, titles) => {
    return list.map(it => (
      <TreeNode
        key={it.deptId}
        value={it.deptId}
        name={it.deptName}
        searchs={titles}
        title={(
          <div className={style.treeOption}>
            {it.deptName}
          </div>
        )}
      />
    ));
  }

  onChangePro = val => {
    const { chart, submitTime } = this.props;
    chart({
      url: 'submitReport',
      payload: this.setVal({
        ...submitTime,
        deptIds: val,
      })
    }, () => {
      this.props.onChangeData('submitTime', {
        ...submitTime,
        deptIds: val,
      });
    });
  }

  render () {
    const { dateType } = fields;
    const { list } = lists;
    const { submitReport, reportChange,
      submitTime,
      submitReportDetail, reportPage,
      deptTree,
      reportTotal,
      loanSumVo,
      form: { getFieldDecorator } } = this.props;
    const { isShow } = this.state;
    return (
      <div className={style.submit}>
        <div className={style.top}>
          <p>支出简报</p>
          <Form layout="inline">
            <Form.Item>
              {
                getFieldDecorator('time', {
                  initialValue: '0_m'
                })(
                  <Select style={{ width: '88px' }} onChange={this.onChange}>
                    {
                      dateType.map(it => (
                        <Option key={it.key}>{it.value}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
            <Form.Item>
              <TreeSelect
                placeholder="请选择"
                style={{width: '200px'}}
                treeDefaultExpandAll
                dropdownStyle={{height: '300px'}}
                onChange={(val) => this.onChangePro(val)}
                treeNodeLabelProp="name"
                getPopupContainer={triggerNode => triggerNode.parentNode}
                showSearch
              >
                {this.treeNodeRender(deptTree)}
              </TreeSelect>
            </Form.Item>
            {
              isShow &&
              <Form.Item>
                <RangePicker
                  style={{ width: '136px' }}
                  onChange={this.onChangeDate}
                />
              </Form.Item>
            }
          </Form>
        </div>
        <div className={style.bottom}>
          {
            list.map((it, index)=> (
              <React.Fragment key={it.key}>
                <TempTable
                  loanList={submitReportDetail}
                  reportChange={reportChange}
                  reportType={it.key}
                  submitTime={submitTime}
                  page={reportPage}
                  total={reportTotal}
                  loanSumVo={loanSumVo}
                >
                  <>
                    <div className={style.content}>
                      <p className="c-black-45">{it.value}金额</p>
                      <p className="c-black-85 fs-30">
                        ¥{submitReport[it.id] ? submitReport[it.id]/100 : 0}
                      </p>
                    </div>
                    {
                      ((list.length - 1) !== index) &&
                      <Divider
                        type="vertical"
                        style={{
                          color: '##e9e9e9',
                          height: '56px',
                          margin: '0 8px 0 13px'
                        }}
                      />
                    }
                  </>
                </TempTable>
              </React.Fragment>
            ))
          }

        </div>
      </div>
    );
  }
}

export default SubmitReport;

