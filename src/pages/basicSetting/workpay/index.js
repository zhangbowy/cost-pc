
import React, { useEffect, useState } from 'react';
import { Tooltip, Button, message,Steps,Upload } from 'antd';
import { connect } from 'dva';
import constants from '@/utils/constants';
import getDateUtil from '@/utils/tool';
import QRCode from 'qrcode.react';
import style from './index.scss';
import Lines from '../../../components/StyleCom/Lines';


function Controller(props) {

  const {
    APP_API,
  } = constants;
  const { dispatch, userInfo } = props;
  const [ visible, setVisible ] = useState(false);
  const [ importInfo, setImportInfo ] = useState([]);
  const [ status, setStatus ] = useState(false);
  const [ current, setCurrent ] = useState(1);
  const [ authUrl,setAuthurl ] = useState('');
  const [ failFileId, setFailFileId] = useState('');
  const [ failNum, setFailNum] = useState(0);
  const [ successNum, setSuccessNum] = useState(0);
  
  const { Step } = Steps;
  const propsUpload = {
    name: 'file',
    showUploadList: { showPreviewIcon: true, showRemoveIcon: false, showDownloadIcon: false },
    action: `${APP_API}/cost/workPay/import/userInfoExcel?token=${localStorage.getItem('token')}`,
    beforeUpload: (file) => {
      if(file.name.indexOf('.xlsx') === file.name.length-5){
        return true;
      }
        message.error('只能上传xlsx格式的文件!');
        return false;
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        if(info.fileList.length){
          info.fileList.splice(0,1);
        }
      }
      if (info.file.status === 'done') {
        dispatch({
          type: 'controller/getImportInfo',
          payload: {
            companyId: userInfo.companyId,
          },
          callback: (res) => {
            if(res !== 1){
              setImportInfo(true);
            }
          }
        });
        if(info.file.response && info.file.response.result){
          const data = info.file.response.result;
          setFailFileId(data.failFileId);
          setFailNum(data.failNum);
          setSuccessNum(data.successNum);
          message.success(`成功导入${data.successNum}条，失败${data.failNum}条`);
          dispatch({
            type: 'controller/getImportInfo',
            payload: {
              companyId: userInfo.companyId,
            },
            callback: (res) => {
              console.log('getImportInfo',res);
              setImportInfo(res);
            }
          });
        }else{
          message.error(info.file.response.message);
        }
      } else if (info.file.status === 'error') {
        if(info.file.response && info.file.response.result){
          message.error(info.file.response.result.message);
        }else{
          message.error('导入失败');
        }
      }
    },
  };
  const getText = () => {
    if(importInfo.lastImportTime){
      return `${getDateUtil(importInfo.lastImportTime,'yyyy-MM-dd hh:mm') 
      }，累计导入人数：${  importInfo.importNum  }人` +
      `，开通人数：${  importInfo.openNum  }人`;
    }
      return '无';
    
  };
  const next = () => {
    dispatch({
      type: 'controller/getCompanyAuthResult',
      payload: {
        companyId: userInfo.companyId,
      },
      callback: (res) => {
        if(res.isAuthor === 1){
          // setVisible(true)
          setCurrent(current + 1);
        }else{
          message.error('请先授权');
        }
      }
    });
  };
  const accomplish = () => {
    if(importInfo.importNum){
      dispatch({
        type: 'controller/complete',
        payload: {
          companyId: userInfo.companyId,
        },
      }).then(()=>{
        setVisible(true);
      });
    }else{
      message.error('请导入员工信息');
    }
  };
  const steps = [
    {
      title: '支付宝线下签约',
      content: <div />,
      status: 'process',
      description: (
        <span
          style={{color:'#00C795',fontSize:'12px',cursor:'pointer'}} 
          onClick={() => {window.open('https://www.yuque.com/docs/share/09880e09-a80a-410a-86c6-7a7c7f31dc9a?#');}}
        >
          如何签约？
        </span>
      )
    },
    {
      title: '企业账号授权',
      status: 'process',
      content: (
        <div>
          <p className={style.testMessage}>
            <span className={style.btn}>i</span>
            <span style={{fontWeight:'400'}}>如您已线下签约花呗工作花，请使用</span>
            <span style={{fontWeight:'650'}}>企业支付宝账号</span>
            <span style={{fontWeight:'400'}}>扫码授权</span>
          </p>
          <div style={{textAlign:'center',marginTop:'50px'}}>
            <span style={{display:'inline-block',padding:'22px',borderRadius:'2px',boxShadow: '0px 0px 6px 0px rgba(29, 17, 86, 0.12)'}} >
              <QRCode value={authUrl} size={130} />,
            </span>
          </div>
          <div style={{textAlign:'center',marginTop:'33px'}}>
            <Button type="primary" onClick={() => next()} >下一步</Button>
          </div>
        </div>
      ),
      description: <span style={{fontSize:'12px',color:'rgba(0,0,0,0.36)'}}>使用企业已签约支付宝授权</span>
    },
    {
      title: '录入员工信息',
      content: (
        <div>
          <p className={style.testMessage}>
            <span className={style.btn}>i</span>
            <span style={{fontWeight:'650'}}>请确保正确的员工信息</span>
            <span style={{fontWeight:'400'}}>信息准确性将影响花呗提额额度</span>
          </p>
          <p className={style.contentItem}>批量导入员工信息，请先
            <a
              href={`${APP_API}/cost/export/userInfo/template?token=${localStorage.getItem('token')}`}
              style={{color:'#00C795'}}
            >下载模板
            </a>
          </p>
          <div className={style.contentItem}>
            <Upload {...propsUpload}>
              <Button>批量导入</Button>
            </Upload>
          </div>
          <p className={style.contentItem} style={{color:'rgba(0,0,0,0.45)'}}>上次时间：
            { getText() }
          </p>
          <p className={style.contentItem} style={{marginTop:'100px',textAlign:'center',marginBottom:'50px'}}>
            <Button type="primary" onClick={() => accomplish()}>完成</Button>
          </p>
        </div>
      ),
      description: <span style={{fontSize:'12px',color:'rgba(0,0,0,0.36)'}}>支持批量录入</span>
    },
  ];

  const loadData = () => {
    dispatch({
      type: 'controller/getAuthUrl',
      payload: {
        companyId: userInfo.companyId,
      },
      callback: (res) => {
        console.log('getAuthUrl',res);
        if(res){
          setAuthurl(res);
        }
      }
    });
    dispatch({
      type: 'controller/getCompanyAuthResult',
      payload: {
        companyId: userInfo.companyId,
      },
      callback: (res) => {
        console.log('getCompanyAuthResult',res);
        if(res.isAuthor === 1){
          setStatus(true);
          setCurrent(current + 1);
        }else{
          setStatus(false);
        }
        if(res.isComplete === 1){
          setVisible(true);
        }
      }
    });
    dispatch({
      type: 'controller/getImportInfo',
      payload: {
        companyId: userInfo.companyId,
      },
      callback: (res) => {
        console.log('getImportInfo',res);
        setImportInfo(res);
      }
    });
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTextTit = () => {
    if(visible){
      return '您的企业已成功开通花呗工作花，请及时告知员工到鑫支出开通该业务，即刻享受花呗提额';
    }
      return '如您已线下签约花呗工作花，请及时扫码授权，并录入员工信息，员工方可正常开通使用';
    
  };

  return (
    <div style={{minHeight:'100%'}}>
      <div className={style.app_header}>
        <p className="c-black-85 fs-20 fw-600 m-b-8">花呗工作花</p>
        <p className="c-black-45 fs-14" style={{marginBottom: 0}}>{getTextTit()}</p>
      </div>
      <div className="content-dt" style={{overflowY:'auto',padding: visible?'24px 32px':'24px 10%',minHeight: 'calc(100% - 120px)' }} >
        <>
          <div className={visible?style.hide:''}>
            <Steps current={current} >
              {steps.map(item => (
                <Step status={item.status} key={item.title} title={item.title} description={item.description} size='small' />
            ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>
          </div>
        </>
        <>
          <div className={visible?'':style.hide}>
            <Lines name={`企业支付宝授权${status?'【授权中】':'【已停止授权】'}`} style={{margin:'20px 0 18px'}}>
              <Tooltip title="若要停止授权，请登录企业支付宝操作" className={status?'':style.hide} >
                <i className="iconfont iconIcon-yuangongshouce fs-14 c-black-45 m-l-8" />
              </Tooltip>
            </Lines>
            <div style={{marginTop:'18px'}}>
              <span style={{display:'inline-block',padding:'22px',borderRadius:'2px',boxShadow: '0px 0px 6px 0px rgba(29, 17, 86, 0.12)'}} >
                <QRCode value={authUrl} size={130} />,
              </span>
            </div>
            <div style={{height:'1px',background:'rgba(233,233,233,1)',margin:'66px auto 25px'}} />
            <Lines name="批量导入员工信息">
              <span className="fs-14 c-black-45 fw-400">（请确保导入正确的员工信息，信息准确性将影响花呗提额额度）</span>
            </Lines>
            <p className={style.contentItem} style={{marginLeft:0,marginTop:'7px'}} >批量导入员工信息，请先
              <a
                href={`${APP_API}/cost/export/userInfo/template?token=${localStorage.getItem('token')}`}
                style={{color:'#00C795'}}
              >下载模板
              </a>
            </p>
            <p className={`${style.testMessageRed} ${failFileId?'':style.hide}`} style={{marginLeft:0,marginTop:0,marginBottom:'16px'}}>
              <span className={style.btn}>x</span>
              <span style={{fontWeight:'400'}}>成功导入 { successNum }条，失败 { failNum }条&nbsp;&nbsp;&nbsp;</span>
              <a
                href={`${APP_API}/cost/export/userInfo/failData?failFileId=${failFileId}&token=${localStorage.getItem('token')}`}
                style={{color:'#00C795'}}
              >导出失败数据
              </a>
            </p>
            <div className={style.contentItem} style={{marginLeft:0,marginTop:0}} >
              <Upload {...propsUpload}>
                <Button>批量导入</Button>
              </Upload>
            </div>
            <p className={style.contentItem} style={{marginLeft:0,color:'rgba(0,0,0,0.45)'}}>
              上次时间：{ getText() }
            </p>
          </div>
        </>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    removeDataTime: state.controller.removeDataTime,
    userInfo: state.session.userInfo,
    synCompanyTime: state.controller.synCompanyTime,
    queryUsers: state.controller.queryUsers,
    modifyGrant: state.controller.modifyGrant,
    getCompanyAuthResult : state.controller.getCompanyAuthResult,
    getAuthUrl: state.controller.getAuthUrl
  };
};
export default connect(mapStateToProps)(Controller);

