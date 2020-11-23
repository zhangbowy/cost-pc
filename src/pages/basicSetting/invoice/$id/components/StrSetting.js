/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import update from 'immutability-helper';
import Left from './Left';
import StrCenter from './Center';
import Right from './Right';
import style from './index.scss';

class StrSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldList: props.fieldList || [],
      selectList: props.selectList || [],
      selectId: props.selectList[0].field || 'costCategory',
    };
  }

  findCard = (id) => {
    const { selectList } = this.state;
    const card = selectList.filter((c) => `${c.field}` === id)[0];
    return {
        card,
        index: selectList.indexOf(card),
    };
  }

  idGenerator = () => {
    let qutient = 10000;
    const chars = '0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz';
    const charArr = chars.split( '' );
    const radix = chars.length;
    const res = [];
    do {
      const mod = qutient % radix;
      qutient = ( qutient - mod ) / radix;
      res.push( charArr[mod] );
    } while ( qutient );
    return `self_${res.join('')}`;

    // const time = timeStampToHex();
    // return `${nodeType}_${time+1}`;

  }

  handleChange = (type, val) => {
    console.log('StrSetting -> handleChange -> val', val);
    this.setState({
      [type]: val,
    });
    // this.props.onChangeData(type, val);
  }

  render () {
    const { fieldList, selectList, selectId } = this.state;
    return (
      <>
        <Left
          fieldList={fieldList}
          selectList={selectList}
          onChange={this.handleChange}
        />
        <div className={style.strCenter}>
          <div className={style.header}>
            <span className="fs-16 c-black-85 fw-500">表单内容</span>
            <div className={style.pro}>
              <span>
                <i className="iconfont iconinfo-cirlce" />
                <span>请拖拽左侧添加控件</span>
              </span>
              <i className="iconfont iconclose" />
            </div>
          </div>
          <StrCenter
            selectList={selectList}
            findCard={this.findCard}
            dragId={selectId}
            onChange={this.handleChange}
          />
        </div>
        <Right selectList={selectList} selectId={selectId} />
      </>
    );
  }
}


export default StrSetting;
