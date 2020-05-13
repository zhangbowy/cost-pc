class Cookie {
  // 设置cookie 默认两小时过期
  static set (name, value, hours = 2, path) {
    if (typeof value !== 'string') {
      // eslint-disable-next-line no-param-reassign
      value = JSON.stringify(value);
    }
    const _name = escape(name);
    const _value = escape(value);
    const expires = new Date();
    expires.setTime(expires.getTime() + hours * 3600000);
    // eslint-disable-next-line no-param-reassign
    path = path === '' ? '' : `;path=${  path}`;
    const _expires = (typeof hours) === 'string' ? '' : `;expires=${  expires.toUTCString()}`;
    // eslint-disable-next-line prefer-template
    document.cookie = _name + '=' + _value + _expires + path;
  }

  // 获取cookie值
  static get (name) {
    let _name = escape(name);
    // 读cookie属性，这将返回文档的所有cookie
    const allcookies = document.cookie;
    // 查找名为name的cookie的开始位置
    _name += '=';
    const pos = allcookies.indexOf(_name);
    // 如果找到了具有该名字的cookie，那么提取并使用它的值
    if (pos !== -1) {                   // 如果pos值为-1则说明搜索"version="失败
      const start = pos + _name.length;         // cookie值开始的位置
      let end = allcookies.indexOf(';', start);    // 从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
      if (end === -1) end = allcookies.length;    // 如果end值为-1说明cookie列表里只有一个cookie
      const value = unescape(allcookies.substring(start, end)); // 提取cookie的值对它解码
      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
    }
    else return ''; // 搜索失败，返回空字符串
  }

  // 删除cookie
  static remove (name, path) {
    const _name = escape(name);
    const expires = new Date(0);
    // eslint-disable-next-line no-param-reassign
    path = path === '' ? '' : `;path=${  path}`;
    document.cookie = `${_name  }=;expires=${  expires.toUTCString()  }${path}`;
  }
};

export default Cookie;
