/*
 * @Author: HLM
 * @Description: session config
 * @Date: 2019-04-22 18:12:31
 */
function isObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
class Session {
  static get (key) {
    if (key) {
      const _val = sessionStorage.getItem(key);
      try {
        const Sval = JSON.parse(_val);
        return Sval;
      } catch (error) {
        return _val;
      }
    }
  }

  static set (key, val) {
    try {
      if (val) {
        if (isObject(val)) {
          sessionStorage.setItem(key, JSON.stringify(val));
          return;
        }
        sessionStorage.setItem(key, val);
      }

    } catch (error) {
      console.error(error);
    }
  }

  static remove (key) {
    try {
      if (key && typeof key === 'string') {
        sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default Session;
