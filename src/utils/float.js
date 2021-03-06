/* eslint-disable no-restricted-properties */
/**
* 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
*
* @param num1加数1 | num2加数2
*/
export const numAdd = (num1, num2) => {
    let baseNum = 0;
    let baseNum1;
    let baseNum2;
    try {
      if (num1.toString().split('.')[1]) {
        baseNum1 = num1.toString().split('.')[1].length;
      } else {
        baseNum1 = 0;
      }
    } catch (e) {
    baseNum1 = 0;
    }
    try {
      if (num2.toString().split('.')[1]) {
        baseNum2 = num2.toString().split('.')[1].length;
      } else {
        baseNum2 = 0;
      }
    } catch (e) {
    baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    return (num1 * baseNum + num2 * baseNum) / baseNum;
};

/**
* 减法运算，避免数据相减小数点后产生多位数和计算精度损失。
*
* @param num1被减数 | num2减数
*/
export const numSub = (num1, num2) => {
  let baseNum = 0;
  let baseNum1;
  let baseNum2;
  let precision = 0;// 精度
  try {
    if (num1.toString().split('.')[1]) {
      baseNum1 = num1.toString().split('.')[1].length;
    } else {
      baseNum1 = 0;
    }
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    if (num2.toString().split('.')[1]) {
      baseNum2 = num2.toString().split('.')[1].length;
    } else {
      baseNum2 = 0;
    }
  } catch (e) {
  baseNum2 = 0;
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
  precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
  return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};

/**
* 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
*
* @param num1被乘数 | num2乘数
*/
export const numMulti = (num1, num2) => {
  let baseNum = 0;
  try {
    if (num1.toString().split('.')[1]) {
      baseNum += num1.toString().split('.')[1].length;
    }
  } catch (e) { console.log(e); }
  try {
    if (num2.toString().split('.')[1]) {
      baseNum += num2.toString().split('.')[1].length;
    }
  } catch (e) { console.log(e); }
  return Number(num1.toString().replace('.', ''))
  * Number(num2.toString().replace('.', '')) / Math.pow(10, baseNum);
};

/**
* 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
*
* @param num1被除数 | num2除数
*/
// export const numDiv = (num1, num2) => {
//   var baseNum1 = 0, baseNum2 = 0;
//   var baseNum3, baseNum4;
//   try {
//   baseNum1 = num1.toString().split(".")[1].length;
//   } catch (e) {
//   baseNum1 = 0;
//   }
//   try {
//   baseNum2 = num2.toString().split(".")[1].length;
//   } catch (e) {
//   baseNum2 = 0;
//   }
//   with(Math) {
//     baseNum3 = Number(num1.toString().replace(".", ""));
//     baseNum4 = Number(num2.toString().replace(".", ""));
//     return (baseNum3 / baseNum4) * pow(10, baseNum2 - baseNum1);
//   }
// };
