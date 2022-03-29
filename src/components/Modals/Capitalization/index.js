import React from 'react';
import style from './index.scss';

// 金额转中文大写
export default function Capitalization(props) {
const changeToCapitalization = (val) => {
    if(!val) return; 
    // 转成数字型
    let newVal=Number(val);
    // 开始转换
    let unit = '京亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分'; let str = '';
    newVal += '00';
    const p = newVal.indexOf('.');
    if (p >= 0)
    newVal = newVal.substring(0, p) + newVal.substr(p+1, 2);
    unit = unit.substr(unit.length - newVal.length);
    for (let i=0; i < newVal.length; i++)
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(newVal.charAt(i)) + unit.charAt(i);
    // 去掉多余的字，并返回最终结果
        return str.replace(/零(仟|佰|拾|角)/g, '零')
                  .replace(/(零)+/g, '零')
                  .replace(/零(兆|万|亿|元)/g, '$1')
                  .replace(/(兆|亿)万/g, '$1')
                  .replace(/(京|兆)亿/g, '$1')
                  .replace(/(京)兆/g, '$1')
                  .replace(/(京|兆|亿|仟|佰|拾)(万?)(.)仟/g, '$1$2$3仟')
                  .replace(/(亿)万|壹(拾)/g, '$1$2')
                  .replace(/^元零?|零分/g, '')
                  .replace(/(元|角)$/g, '$1');
    };
    return (
      <span className={style.capitalization}>{changeToCapitalization(props.isMoney)}</span>
    );
}
