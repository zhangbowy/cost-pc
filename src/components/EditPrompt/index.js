import { Modal } from 'antd';
import React , { useEffect, useState } from 'react';
// import { history } from 'umi';
import { Prompt } from 'react-router-dom';

export const EditPrompt = (({ history, isModal, onOk }) => {
    console.log('🚀 ~ file: index.js ~ line 8 ~ EditPrompt ~ isModal', isModal);
    const [save, setSave] = useState(isModal);
    const listener = (e) => {
        e.preventDefault();
        // const confirmationMessage = '你确定离开此页面吗?';
        // (e || window.event).returnValue = confirmationMessage;
        // return confirmationMessage;
    };


    useEffect(() => {
        window.addEventListener('beforeunload', listener);
        return () => {
            window.removeEventListener('beforeunload', listener);
        };
    }, []);

    return (
      <Prompt
        when={save}
        message={(location) => {
          if (!save) return true;
          Modal.confirm({
            title: '确定离开当前页面吗？',
            content: '当前编辑的信息尚未保存，离开当前页面将会丢失已填写的内容。',
            okText: '保存',
            cancelText: '离开本页',
            onOk: () => {
              if (onOk) {
                onOk();
              }
            },
            onCancel: () => {
              setSave(false);
              setTimeout(() => {
                history.push(location.pathname);
              });
            }
          });
          return false;
        }}
      />
    );
});
