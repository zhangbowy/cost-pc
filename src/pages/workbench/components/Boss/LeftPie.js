/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { Radio, Spin } from 'antd';
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
      current: e.target.value,
    });
  }

  onLink = (obj) => {
    console.log(obj);

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

    localStorage.removeItem('linkType');
    localStorage.setItem('linkType', btn[current].linkKey);
    this.props.history.push('/statistics/overview');
  }

  render () {
    const { loading, flagMenu } = this.props;
    const {  current, data } = this.state;

    return (
      <div className={style.left}>
        <div className={style.leftTop}>
          <p className="fs-16 c-black-85 fw-500">支出分析</p>
          <Radio.Group value={current} onChange={e => this.onChange(e)}>
            {
              btn.map(it => (
                <Radio.Button key={it.key} value={it.key}>按{it.value}</Radio.Button>
              ))
            }
          </Radio.Group>
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
        {
          flagMenu &&
          <div className={style.link} onClick={() => this.onLink()}>
            <span className="fs-12">查看{btn[current].value}分析</span>
          </div>
        }
      </div>
    );
  }
}

LeftPie.propTypes = {

};

export default LeftPie;


