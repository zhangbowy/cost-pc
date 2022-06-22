import { Button } from 'antd';
import cs from 'classnames';
import React from 'react';
import style from './index.scss';
import FooterBar from '../../../../../components/FooterBar';

export default function Bottom({ total, onSave,
  templateType , onDraft, draftLoading, loading, modify }) {
  return (
    <FooterBar
      right={(
        <div className={style.right}>
          {
              <>
                <span className={cs('fs-15', 'c-black-50', style.moneyList)}>
                      <span className="fs-20 fw-500 c-black-85"></span>
                </span>
              </>
          }
          {
            !modify &&
            <Button
              type="default"
              className="m-r-8 m-l-8"
              onClick={onDraft}
              loading={draftLoading}
            >
              保存草稿
            </Button>
          }
          <Button
            type="primary"
            onClick={onSave}
            loading={loading}
          >
            提交
          </Button>
        </div>
      )}
    />
  );
}
