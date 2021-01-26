import moment from 'moment';

export default {
  range: (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  },
  disabledDate: (current) => {
    // Can not select days before today and today
    return current && current < moment(new Date()).subtract(1, 'day');
  },
  disabledDateTime: () => {
    return {
      disabledHours: () => this.range(0, 24).splice(4, 20),
      disabledMinutes: () => this.range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }
};
