/* eslint-disable no-nested-ternary */
import React from 'react';
import cs from 'classnames';
import style from './index.scss';
import { arrayGroup } from '../../../../../../utils/common';
import zdx from '../../../../../../assets/img/zdx.png';
// import PropTypes from 'prop-types';

const pdf = {
  0: 'pdf4',
  1: 'pdf5',
  2: 'pdfb5',
};
const tempObj = {
  0: '报销',
  1: '借款',
  2: '申请',
  3: '提交',
  20: '收款单'
};
function Right({ templateType, templatePdfVo, corpName,
  isRelationLoan, invoiceName, categoryStatus, notes, supplier, isProject, isOpenProject }) {
  const list = templatePdfVo.templatePdfExpandVos || [];
  const one = list.filter(it => it.fieldType === 1) || [];
console.log('🚀 ~ file: Right.js ~ line 20 ~ templatePdfVo', templatePdfVo);
  const two = list.filter(it => it.fieldType !== 1 && Number(it.fieldType) !== 3);
  const twos = arrayGroup(two, 2);
  console.log('🚀 ~ file: Right.js ~ line 27 ~ twos', twos);
  const lists = list.filter(it => Number(it.fieldType) === 3);
  if (isProject && templatePdfVo.isProject) {
    twos.push([{ field: 'project', name: '项目' }]);
  }
  return (
    <div style={{ background: '#fff', position: 'relative' }} className={style[pdf[templatePdfVo.paperType]]}>
      <img src={zdx} alt='装订线' className={style.zdx} />
      <h1 className={style.header}>{invoiceName}</h1>
      {
        templatePdfVo.isCompanyName &&
        <h1 className={style.company}>{corpName}</h1>
      }
      <div>
        <div className={cs(style['cont-info'])}>
          <div className={style['cont-info-fields']}>
            <div className={style['cont-info-line']}>
              <div className={cs(style['cont-cell'], style['cont-line-r'])}>
                <div className={style['cont-cell-label']}>
                  { templateType !== 20 ? tempObj[templateType] : '' }
                  单号
                </div>
              </div>
              <div className={style['cont-cell']} style={{ flex: 2 }}>
                <div className={style['cont-cell-label']}>事由</div>
              </div>
            </div>
            <div className={style['cont-info-line']}>
              <div className={cs(style['cont-cell'], style['cont-line-r'])}>
                <div className={style['cont-cell-label']}>
                  { templateType !== 20 ? `${tempObj[templateType]}人` : '业务员' }
                </div>
              </div>
              {
                !!(Number(templatePdfVo.paperType)) && templateType !== 2 &&
                <div className={cs(style['cont-cell'], style['cont-line-r'])}>
                  <div className={style['cont-cell-label']}>
                    { templateType === 1 && '借款部门' }
                    { (templateType === 2 || templateType === 3) && '申请部门' }
                  </div>
                </div>
              }
              {
                (templateType === 2 || (!Number(templatePdfVo.paperType) && templateType === 1)) &&
                <div className={cs(style['cont-cell'], style['cont-line-r'])}>
                  <div className={style['cont-cell-label']}>
                    { templateType === 1 && '借款部门' }
                    { (templateType === 2 || templateType === 3) && '申请部门' }
                  </div>
                </div>
              }
              <div className={style['cont-cell']}>
                <div className={style['cont-cell-label']}>
                  { templateType === 0 && '提交' }
                  { templateType === 1 && '借款' }
                  { (templateType === 2 || templateType === 3) && '申请' }
                  日期
                </div>
              </div>
            </div>
            {
              templateType !== 2 && templateType !== 20 &&
              <div className={style['cont-info-line']}>
                <div className={style['cont-cell']}>
                  <div className={style['cont-cell-label']}>{supplier && supplier.length ? '供应商账户' : '收款账户'}</div>
                </div>
              </div>
            }
            {
              templateType === 2 && supplier && supplier.length > 0 &&
              <div className={style['cont-info-line']}>
                <div className={style['cont-cell']}>
                  <div className={style['cont-cell-label']}>供应商账户</div>
                </div>
              </div>
            }
            {
              templateType === 2 &&
              <div className={style['cont-info-line']}>
                <div className={style['cont-cell']}>
                  <div className={style['cont-cell-label']}>申请金额(元)</div>
                </div>
              </div>
            }
          </div>
          {
            templatePdfVo.isQrCode && templateType !== 20 &&
              <div className={style['cont-info-qr']}>
                <span>二维码</span>
              </div>
          }
        </div>
        {
          templateType === 1 &&
          <div className={cs(style['cont-info-line'], style['cont-line-l'])}>
            <div className={cs(style['cont-cell'], style['cont-line-r'])}>
              <div className={cs(style['cont-cell-label'])}>借款金额(大写)</div>
            </div>
          </div>
        }
        {
          notes && notes.length > 0 &&
          <div className={cs(style['cont-info-line'], style['cont-line-l'])}>
            <div className={cs(style['cont-cell'], style['cont-line-r'])}>
              <div className={cs(style['cont-cell-label'])}>单据备注</div>
            </div>
          </div>
        }
        {
          twos && twos.length > 0 &&
          twos.map(it => (
            <div
              className={cs(style['cont-info-line'], style['cont-line-l'], style['cont-line-r'])}
              key={it}
            >
              {
                it.map(item => (
                  <div className={cs(style['cont-cell'], style['cont-line-r'])} key={item.field}>
                    <div className={cs(style['cont-cell-label'], 'sub-color')}>{item.name}</div>
                  </div>
                ))
              }
            </div>
          ))
        }
        {
          one && one.length > 0 &&
          one.map(it => (
            <div className={cs(style['cont-info-line'], style['cont-line-l'])} key={it.field}>
              <div className={cs(style['cont-cell'], style['cont-line-r'])}>
                <div className={cs(style['cont-cell-label'], 'sub-color')}>{it.name}</div>
              </div>
            </div>
          ))
        }
        {
          (!templateType ||
            templateType === 3 ||
            templateType === 20 ||
          (templateType === 2 && !!Number(categoryStatus))) &&
          <div className={style.contents}>
            {/* {
              !Number(templatePdfVo.paperType) &&
              <div className={style.title}>支出明细</div>
            } */}
            <table>
              <tr>
                {
                  (Number(templateType) === 0 ||
                  Number(templateType) === 3) &&
                  <th>{templateType === 20 ? '业务员/部门' : '承担人/部门'}</th>
                }
                {
                  isOpenProject && templatePdfVo.isProject &&
                  <th>项目</th>
                }
                <th>{templateType === 20 ? '收入' : '支出'}类别</th>
                <th>备注</th>
                <th>发生日期</th>
                <th>金额</th>
              </tr>
              <tr>
                <td
                  colSpan={
                    ((Number(templateType) === 0 ||
                      (Number(templateType) === 3)) && isProject && templatePdfVo.isProject) ? '6'
                      : ((Number(templateType) === 0 ||
                      (Number(templateType) === 3)) || (isProject && templatePdfVo.isProject)) ? 5 : '4'
}
                />
              </tr>
            </table>
            <table style={{ borderTop: 'none' }}>
              {
                isRelationLoan ?
                  <tr>
                    <td className={style['cont-line-r']}>报销金额（元）</td>
                    <td className={style['cont-line-r']}>核销金额（元）</td>
                    <td>收款金额（元）</td>
                  </tr>
                  :
                  <tr>
                    <td className={style['cont-line-r']} colSpan="3">{tempObj[templateType]}金额（元）</td>
                  </tr>
              }
            </table>
          </div>
        }
        {
          lists && lists.length > 0 &&
          <div className={style.contents}>
            {/* {
              !Number(templatePdfVo.paperType) &&
              <div className={style.title}>明细</div>
            } */}
            <table>
              <tr>
                {
                  lists[0].expandFieldVos && lists[0].expandFieldVos.map(it => (
                    <th key={it.field}>{it.name}</th>
                  ))
                }
              </tr>
              <tr>
                <td colSpan={lists[0].expandFieldVos && lists[0].expandFieldVos.length} />
              </tr>
            </table>
          </div>
        }
        {
          !templateType && templatePdfVo.isAssessRecord &&
          <div className={style.contents}>
            {/* {
              !Number(templatePdfVo.paperType) &&
              <div className={style.title}>核销记录</div>
            } */}
            <table>
              <tr>
                <th>借款单号</th>
                <th>事由</th>
                <th>金额</th>
              </tr>
              <tr>
                <td colSpan="3" />
              </tr>
              <tr>
                <td colSpan="3">核销总金额（大写）</td>
              </tr>
            </table>
          </div>
        }
        {
          templateType !== 2 && templatePdfVo.isApplicationRecord &&
          <div className={style.contents}>
            {/* {
              !Number(templatePdfVo.paperType) &&
              <div className={style.title}>申请单</div>
            } */}
            <table>
              <tr>
                <th>申请单号</th>
                <th>事由</th>
                <th>申请金额</th>
              </tr>
              <tr>
                <td colSpan="3" />
              </tr>
            </table>
          </div>
        }
        <div className={style.contents}>
          {/* {
            !Number(templatePdfVo.paperType) &&
            <div className={style.title}>审批流程</div>
          } */}
          {
            Number(templatePdfVo.paperType) ?
              <table>
                <tr>
                  <td colSpan="2">审批人</td>
                </tr>
                <tr>
                  <td className={style['cont-line-r']}>复核</td>
                  <td>出纳</td>
                </tr>
              </table>
              :
              <table style={{border: 'none'}}>
                <tr style={{border: 'none'}}>
                  <td style={{border: 'none'}}>审批人：</td>
                  <td style={{border: 'none'}}>出纳：</td>
                </tr>
              </table>
          }

        </div>
      </div>
    </div>
  );
}

Right.propTypes = {

};

export default Right;

