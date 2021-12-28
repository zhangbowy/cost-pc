import { Button, Divider } from 'antd';
import cs from 'classnames';
import React from 'react';
import style from './index.scss';
import FooterBar from '../../../../components/FooterBar';
import { numSub } from '../../../../utils/float';

export default function Bottom({ total, onSave, onCancel, templateType, djDetail, assessSum }) {
  return (
    <FooterBar
      left={(
        <Button type="default" className="m-r-8" onClick={() => onCancel()}>取消</Button>
      )}
      right={(
        <div className={style.right}>
          {
            templateType ?
              <>
                <span className={cs('fs-15', 'c-black-50', style.moneyList)}>
                  报销金额：<span className="fs-20 fw-500 c-black-85">¥{total}</span>
                </span>
                {
                  djDetail.isRelationLoan &&
                  <>
                    <Divider type="vertical" />
                    <span className={cs('fs-15', 'c-black-50', style.moneyList)}>
                      核销金额：<span className="fs-20 fw-500 c-black-85">¥{assessSum}</span>
                    </span>
                    <Divider type="vertical" />
                    <span className={cs('fs-15', 'c-black-50', style.moneyList)}>
                      收款金额：
                      <span className="fs-20 fw-500 c-black-85">
                        ¥{total-assessSum > 0 ? (numSub(total,assessSum)) : 0}
                      </span>
                    </span>
                  </>
                }
              </>
            :
              <span className={cs('fs-15', 'c-black-50', style.moneyList)}>
                合计：¥<span className="fs-20 fw-500 c-black-85">{total}</span>
              </span>
          }
          <Button
            type="default"
            className="m-r-8 m-l-8"
            onClick={() => onSave('up')}
          >
            保存
          </Button>
          <Button
            type="primary"
            onClick={() => onSave('up')}
          >
            确定
          </Button>
        </div>
      )}
    />
  );
}
