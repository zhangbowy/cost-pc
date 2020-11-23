import React, { Component } from 'react';
import { Checkbox } from 'antd';
import style from './index.scss';
// import PropTypes from 'prop-types'

const shareList = [{
  key: 'user',
  value: '承担人',
  disabled: true,
  checked: [1, false],
  children: [{
    label: '启用（不可修改）',
    value: 1,
    name: 'status',
  }, {
    label: '必填（不可修改）',
    value: true,
    name: 'isWrite',
  }]
}, {
  key: 'dept',
  value: '承担部门',
  disabled: true,
  checked: [1, true],
  children: [{
    label: '启用（不可修改）',
    value: 1,
    name: 'status',
  }, {
    label: '必填（不可修改）',
    value: true,
    name: 'isWrite',
  }]
}];
class Share extends Component {
  // constructor(props) {
  //   super(props);
  // }

  onChecks = (e, name) => {
    const { shareField } = this.props;
    const newArr = [];
    shareField.forEach(item => {
      if (item.field === 'project') {
        newArr.push({
          ...item,
          [name]: e.target.value,
        });
      } else {
        newArr.push(item);
      }
    });
    this.props.onChangeData('shareField', newArr);
  }

  render() {
    const { shareField } = this.props;
    const arr = shareField.filter(it => it.field === 'project');
    if (shareList.length !== 3) {
      shareList.push({
        key: 'project',
        value: '项目',
        checked: [arr[0].status, arr[0].isWrite],
        children: [{
          label: '启用',
          value: 1,
          name: 'status',
        }, {
          label: '必填',
          value: true,
          name: 'isWrite',
        }]
      });
    }
    return (
      <>
        {
          shareList.map(item => (
            <div key={item.key} style={{display: 'flex'}}>
              <p classlabel={style.checkT}>{item.value}：</p>
              <Checkbox.Group defaultValue={item.checked} disabled={item.disabled}>
                {
                  item.children.map(it => (
                    <Checkbox
                      key={it.value}
                      value={it.value}
                      onClick={e => this.onChecks(e, it.name)}
                      classlabel="m-r-30"
                    >
                      {it.label}
                    </Checkbox>
                  ))
                }
              </Checkbox.Group>
            </div>
          ))
        }
      </>
    );
  }
}

// Share.propTypes = {

// }

export default Share;
