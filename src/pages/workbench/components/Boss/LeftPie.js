/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import style from './leftPie.scss';
import PieChart from './PieChart';

const btn = [{
  key: '0',
  data: 'appDeptStatisticReturnVo',
  value: '部门',
  linkKey: '1',
  idKey: 'deptVos',
}, {
  key: '1',
  data: 'appCategoryStatisticReturnVo',
  value: '类别',
  linkKey: '2',
  idKey: 'categoryIds',
}, {
  key: '2',
  data: 'appProjectStatisticReturnVo',
  value: '项目',
  linkKey: '3',
  idKey: 'projectIds',
}];
class LeftPie extends PureComponent {

  state = {
    current: '0',
    data: [],
  }

  componentDidUpdate(prev) {
    if (prev.data !== this.props.data) {
      this.setState({
        data: this.props.data,
      });
    }
  }


  onChange = (e) => {
    console.log(e);
    this.setState({
      current: e,
    });
  }

  onLink = (obj) => {
    console.log(obj);
    const { submitTime } = this.props;
    const { current } = this.state;
    if (obj) {
      const params = {
        valueStr: obj.dimensionName,
        idKey: btn[current].idKey,
        value: { [btn[current].idKey]: Number(current) === 0 ?
          [{ deptId: obj.dimensionId, deptName: obj.dimensionName, name: obj.dimensionName }] : [obj.dimensionId] }
      };
      localStorage.removeItem('defaultLocal');
      localStorage.setItem('defaultLocal', JSON.stringify(params));
    }
    localStorage.removeItem('submitTime');
    localStorage.setItem('submitTime', JSON.stringify(submitTime));
    localStorage.removeItem('linkType');
    localStorage.setItem('linkType', btn[current].linkKey);
    this.props.history.push('/statistics/overview');
  }

  render () {
    const { loading } = this.props;
    const {  current, data } = this.state;
    return (
      <div className={style.left}>
        <div className={style.leftTop}>
          <div className={style.title}>
            {
              btn.map(it => (
                <p
                  className={current === it.key ? style.active : ''}
                  key={it.key}
                  onClick={() => this.onChange(it.key)}
                >
                  {it.value}支出
                </p>
              ))
            }
          </div>
        </div>
        <Spin spinning={loading}>
          <PieChart
            data={data[btn[current].data] && data[btn[current].data].totalSum ? data[btn[current].data].appDimensionStatisticListReturnVos : []}
            total={data[btn[current].data] && data[btn[current].data].totalSum ? data[btn[current].data].totalSum : 0}
            current={current}
            title={btn[current].value}
            onLink={this.onLink}
          />
        </Spin>
      </div>
    );
  }
}

LeftPie.propTypes = {

};

export default LeftPie;


