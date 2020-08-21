// 时间格式化
const getDateUtil = (nDate = (new Date()), _fmt = 'yyyy-MM-dd hh:mm:ss') => {
    const _sDate = new Date(nDate);
    const sDate = Number.isNaN(_sDate) ? new Date() : _sDate;
    let fmt = Number.isNaN(_sDate) ? nDate : _fmt;
    const dateObj = {
      'M+': sDate.getMonth() + 1,
      'd+': sDate.getDate(),
      'h+': sDate.getHours(),
      'm+': sDate.getMinutes(),
      's+': sDate.getSeconds(),
      'q+': Math.floor((sDate.getMonth() + 3) / 3),
      'S': sDate.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (`${sDate.getFullYear()  }`)
        .substr(4 - RegExp.$1.length));
    }
    // for (const s of dateObj) {
    //   // if(dateObj.hasOwnProperty(s)) {
    //     if (new RegExp(`(${  s  })`).test(fmt)) {
    //       fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
    //         ? (dateObj[s])
    //         : ((`00${  dateObj[s]}`).substr((`${  dateObj[s]}`).length)));
    //     }
    //   // }
    // }
    Object.keys(dateObj).forEach((s) => {
      if (new RegExp(`(${  s  })`).test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
          ? (dateObj[s])
          : ((`00${  dateObj[s]}`).substr((`${  dateObj[s]}`).length)));
      }
    });
    return fmt;
  };

  export default getDateUtil;