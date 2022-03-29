import React, { useImperativeHandle, useRef } from 'react';
// import PropTypes from 'prop-types';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import StrSetting from './StrSetting';
import PreviewBox from './PreviewBox';

function DragContent({ fieldList,
  selectList, onChangeData,
  spacialCenter,
  isModifyInvoice, title, middleRef, type, selectId, templateType }) {
    const childRef = useRef();
    useImperativeHandle(middleRef, () => ({
      getRightParams: () => {
        console.log('走到这里了吗');
        return childRef.current.getRightParams();
      }
    }));

  return (
    <DndProvider backend={HTML5Backend}>
      <PreviewBox />
      <StrSetting
        fieldList={fieldList}
        selectList={selectList}
        onChangeData={onChangeData}
        selectId={selectId}
        type={type}
        isModifyInvoice={isModifyInvoice}
        operateType={title}
        childRef={childRef}
        templateType={templateType}
        spacialCenter={spacialCenter}
      />
    </DndProvider>
  );
}

DragContent.propTypes = {

};

export default DragContent;

