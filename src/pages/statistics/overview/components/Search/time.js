import getDateUtil from '@/utils/tool';

const getMaxDay = (year,month) => {
  const temp = new Date(year,month,'0');
  return temp.getDate();
};
const time =  getDateUtil(new Date().getTime()).split('-');
export const startDate = `${time[0]}-${time[1]}-01 00:00:01`;
export const endDate = `${time[0]}-${time[1]}-${getMaxDay(time[0],time[1])} 23:59:59`;

export const defaultMonth = () => {
  return {
    startTime: new Date(startDate).getTime(),
    endTime: new Date(endDate).getTime(),
    valueStr: `${time[0]}-${time[1]}`,
  };
};


export const getQuarter = (date,isValue) => {
  console.log('date', date);
  if(isValue){
    const start = `${date.split('~')[0]  }-01 00:00:01`;
    const end =  date.split('~')[1] + ((date.split('~')[1].split('-')[1]==='06'||date.split('~')[1].split('-')[1]==='09')?'-30 23:59:59':'-31 23:59:59');
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    return {
      startTime,
      endTime,
      valueStr: date,
    };
  }
  const year = date.getFullYear();
  const month = date.getMonth()+1;
  if(month <= 3){
    return `${year}-01~${year}-03`;
  }if(month <= 6){
    return `${year}-04~${year}-06`;
  }if(month <= 9){
    return `${year}-07~${year}-09`;
  }
    return `${year}-10~${year}-12`;
};

export const  yearChange = (str) => {
  const strs = str || time[0];
  const start = `${strs}-01-01 00:00:01`;
  const end = `${strs}-12-31 23:59:59`;
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  return {
    startTime,
    endTime,
    valueStr: strs,
  };
};

export const monthChage = (str) =>{
  console.log('月份', str);
  const start = `${str}-01 00:00:01`;
  const end = `${str}-${ getMaxDay(str.split('-')[0],str.split('-')[1]) } 23:59:59`;
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  return {
    startTime,
    endTime,
    valueStr: str
  };
};
