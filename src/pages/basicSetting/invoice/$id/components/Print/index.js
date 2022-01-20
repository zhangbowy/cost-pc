import React from 'react';
// import PropTypes from 'prop-types';
import Left from './Left';
import Right from './Right';
import style from './index.scss';

function index({ templatePdfVo, selectList, templateType, onChange,
  isRelationLoan, corpName, invoiceName, categoryStatus, isOpenProject }) {
  console.log('🚀 ~ file: index.js ~ line 9 ~ isOpenProject', isOpenProject);
  const expandList = selectList.filter(it => it.field.indexOf('expand') > -1) || [];
  const isProject = selectList.findIndex(it => it.field === 'project') > -1;
  return (
    <>
      <Left
        expandList={expandList}
        templatePdfVo={templatePdfVo}
        onChange={onChange}
        templateType={templateType}
        isProject={isOpenProject || isProject}
      />
      <div className={style.rightContainer}>
        <div className={style.rights}>
          <Right
            templateType={templateType}
            templatePdfVo={templatePdfVo}
            isRelationLoan={isRelationLoan}
            corpName={corpName}
            invoiceName={invoiceName}
            isProject={isProject}
            isOpenProject={isOpenProject}
            categoryStatus={categoryStatus}
            notes={selectList.filter(it => it.field === 'note')}
            supplier={selectList.filter(it => it.field === 'supplier')}
          />
        </div>
      </div>
    </>
  );
}

// index.propTypes = {

// };

export default index;

