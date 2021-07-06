import React, { PureComponent } from 'react';
import { Divider, Popover } from 'antd';
import cs from 'classnames';
import update from 'immutability-helper';
import style from './index.scss';
import FormStyle from './FormStyle';

class SearchBanner extends PureComponent {

  onDel = i => {
    const { list, onChange } = this.props;
    onChange(update(list, {
      $splice: [[i,1, {
        ...list[i],
        value: null,
        valueStr: null
      }]]
    }));
  }

  render () {
    const { list } = this.props;
    const showStr = list.filter(it => it.valueStr);
    return (
      <div className={style.search}>
        <div className={style.top}>
          <FormStyle type="out" fields={list} onChangeSearch={this.props.onChange} />
          {
            list.length > 5 &&
              <div className="head_rf">
                <Popover
                  trigger="click"
                  title={null}
                  placement="bottomRight"
                  overlayClassName={style.popover}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  content={(
                    <>
                      <div className={style.formCnt}>
                        <FormStyle
                          fields={list}
                          onChangeSearch={this.props.onChange}
                        />
                      </div>
                      <Divider type="horizontal" style={{ margin: 0 }} />
                      <div className={style.delBtn} onClick={() => this.onCancel()}>
                        <i className="iconfont iconshanchu" />
                        <span>清除所有筛选条件</span>
                      </div>
                    </>
                  )}
                >
                  <span className={style.searchLevel}>
                    <i className="iconfont iconshaixuan" />
                    <span className="fs-16">高级筛选</span>
                  </span>
                </Popover>
              </div>
          }
        </div>
        {
          showStr && (showStr.length > 0) &&
          <div className={style.showInfo}>
            {
              list.map((it, index) => {
                return (
                  <>
                    {
                      it.valueStr &&
                      <div className={style.showLabel} key={it.id}>
                        <span>{it.label}：{it.valueStr}</span>
                        <i className="iconfont iconclose" onClick={() => this.onDel(index)} />
                      </div>
                    }
                  </>
                );
              })
            }
            <span
              className={cs('fs-14','sub-color','m-l-8', style.del)}
            >
              清除条件
            </span>
          </div>
        }
      </div>
    );
  }
}

export default SearchBanner;
