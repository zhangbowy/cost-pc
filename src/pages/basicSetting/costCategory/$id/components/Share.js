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
      const obj = {};
      if (name === 'status') {
        console.log(e.target.value);
        obj[name] = e.target.checked ? 1 : 0;
      } else if (name === 'isWrite') {
        obj[name] = e.target.checked;
      }
      if (item.field === 'project') {
        newArr.push({
          ...item,
          ...obj
        });
      } else {
        newArr.push(item);
      }
    });
    console.log('Share -> onChecks -> newArr', newArr);
    this.props.onChangeData('shareField', newArr);
  }

  render() {
    const { shareField } = this.props;
    const arr = shareField.filter(it => it.field === 'project');
    const indexs = shareField.findIndex(it => it.field === 'project');
    if (shareList.length !== 3) {
      shareList.push({
        key: 'project',
        value: '项目',
        checked: [arr[0].status ? 1 : 0, arr[0].isWrite],
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
    } else {
      shareList.splice(indexs, 1, {
        key: 'project',
        value: '项目',
        checked: [arr[0].status ? 1 : 0, arr[0].isWrite],
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
      <div style={{marginTop: '32px'}}>
        {
          shareList.map(item => (
            <div key={item.key} style={{display: 'flex'}}>
              <p className={style.checkT}>{item.value}：</p>
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
      </div>
    );
  }
}

// Share.propTypes = {

// }

export default Share;
