import React from 'react';
import style from './index.scss';

// 金额转中文大写
export default function Capitalization(props) {
    const changeToCapitalization = (val) => {
        // 先过滤掉当金额大于1时，首位数为0的情况：
        let newVal;
        if (Number(val) > 1 && Number(val[0]) === 0) {
            newVal = val.slice(1, val.length);
        } else {
            newVal = val;
        }
        // 进行转化
        let unit = '千百拾亿千百拾万千百拾元角分';
        let str = '';
        newVal += '00';
        const p = newVal.indexOf('.');
        if (p >= 0)
        newVal = newVal.substring(0, p) + newVal.substr(p + 1, 2);
        unit = unit.substr(unit.length - newVal.length);
        for (let i = 0; i < newVal.length; i++)
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(newVal.charAt(i)) + unit.charAt(i);
        const capitalization = str.replace(/零(千|百|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(万|亿|元)/g, '$1').replace(/(亿)万|壹(拾)/g, '$1$2').replace(/^元零?|零分/g, '').replace(/元$/g, '元');
        return capitalization;
    };
    return (
      <span className={style.capitalization}>{changeToCapitalization(props.isMoney)}</span>
    );
}
