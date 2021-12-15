/* eslint-disable no-bitwise */
import qs from 'qs';

export const getQuery = (search = window.location.search) => {
  const r = (typeof search === 'string' ? search : search.search) || '';
  const index = r.indexOf('?');
  return qs.parse(~index ? r.slice(index + 1) : r);
};

class Query {
  query = {}

  toString = () => JSON.stringify(this.query)

  valueOf = () => this.query

  setQuery = (search = window.location.search) => {
    const r = (typeof search === 'string' ? search : search.search) || '';
    const index = r.indexOf('?');
    this.query = qs.parse(~index ? r.slice(index + 1) : r);
  }

  getNumber = label => {
    const r = this.query[label];
    return Number.isNaN(r) ? null : r;
  }

  getString = label => this.query[label];

  getBoolean = label => (this.query[label] === 'false' ? false : true || false);

  getDate = date => {
    const d = new Date(date);
    return (
      Object.prototype.toString.call(d) === '[object Date]' &&
      !Number.isNaN(d.getTime())
    ) ? null : d;
  }

  getQuery = () => this.query
}

export default new Query();
