import React from 'react';
// import PropTypes from 'prop-types';
import Left from './Left';
import Right from './Right';
import style from './index.scss';

function index({ templatePdfVo, selectList, templateType, onChange, invoiceName, corpName }) {
  const expandList = selectList.filter(it => it.field.indexOf('expand') > -1) || [];
  console.log(templatePdfVo);
  return (
    <>
      <Left
        expandList={expandList}
        templatePdfVo={templatePdfVo}
        onChange={onChange}
        templateType={templateType}
      />
      <div className={style.rightContainer}>
        <div className={style.rights}>
          <Right
            templateType={templateType}
            templatePdfVo={templatePdfVo}
            invoiceName={invoiceName}
            corpName={corpName}
          />
        </div>
      </div>
    </>
  );
}

// index.propTypes = {

// };

export default index;

