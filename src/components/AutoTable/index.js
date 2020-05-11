/**
 * 查询表格纵向高度自适应
 * 建议配合组件Card及样式app-table-responsive
 *
 * @param {number} [offset=60] - 偏差值【通常为表头或分页的高度】
 * @param {string} [tableRoot='.ant-table-wrapper'] - 表格容器节点
 * @param {string} action - auction of redux
 * @param {object} [fetchPayload] - 通用请求参数
 * @description 为组件添加属性：scrollHeight, width, resize, tableInit, onQuery, onPageChange, onSearch, onReset, onFresh
 *
 * @author Tan Wei <tanwei@jimistore.com>
 */
import React from 'react';
import PropTypes from 'prop-types';
import Debounce from 'lodash-decorators/debounce';
import constants from '@/utils/constants';

// 事件监听
const eventUtil = {
  addHandler(target, type, handler, useCapture = false) {
    if (target.addEventListener) {
      // DOM2.0
      target.addEventListener(type, handler, useCapture);
    } else if (target.attachEvent) {
      // IE5+
      target.attachEvent(`on${type}`, handler);
    } else {
      // DOM 0
      target[`on${type}`] = handler;
    }
  },
  removeHandler(target, type, handler, useCapture = false) {
    if (target.removeEventListener) {
      // DOM2.0
      target.removeEventListener(type, handler, useCapture);
    } else if (target.detachEvent) {
      // IE5+
      target.detachEvent(`on${type}`, handler);
    } else {
      // DOM 0
      target[`on${type}`] = null;
    }
  },
};

export default function ({
  offset = 60,
  tableRoot = '.ant-table-wrapper',
  action,
  fetchPayload,
} = {}) {
  return function autoTable(WrappedComponent) {
    return class extends React.Component {
      static propTypes = {
        form: PropTypes.object,
        dispatch: PropTypes.func,
        loading: PropTypes.bool,
        query: PropTypes.object,
      };

      state = {
        height: 0, // 表格纵向高度
        width: 0, // 表格横向宽度
      };

      componentDidMount() {
        eventUtil.addHandler(window, 'resize', this.resize);
        this.setTableProp();
      }

      componentWillUnmount() {
        eventUtil.removeHandler(window, 'resize', this.resize);
      }

      @Debounce(400)
      resize = () => {
        this.setTableProp();
      };

      // 设置表格属性
      setTableProp = () => {
        const table = document.querySelector(tableRoot);
        if (table) {
          this.setState({
            height: table.offsetHeight - offset,
            width: table.offsetWidth,
          });
        }
      };

      // 查询
      onQuery = (payload) => {
        if (typeof this.wrappedInstance.onQuery === 'undefined') {
          this.props.dispatch({
            type: action,
            payload: {
              ...fetchPayload,
              ...payload,
            },
          });
        } else {
          this.wrappedInstance.onQuery(payload);
        }
      };

      // 分页回调
      onPageChange = (pageNum, pageSize) => {
        this.props.form.validateFields((_, values) => {
          this.onQuery({
            ...values,
            pageNum,
            pageSize,
          });
        });
      };

      // 搜索
      onSearch = (e) => {
        e.preventDefault();
        const {
          form,
          query,
          loading,
        } = this.props;
        if (loading) {
          return;
        }

        form.validateFields((_, values) => {
          this.onQuery({
            ...values,
            pageNum: 1,
            pageSize: query.pageSize,
          });
        });
      };

      // 重置搜索条件
      onReset = () => {
        const { form } = this.props;
        form.resetFields();
        form.validateFields((_, values) => {
          this.onQuery({
            ...values,
            pageNum: 1,
            pageSize: constants.PAGE_SIZE,
          });
        });
      };

      // 刷新
      onFresh = () => {
        const {
          form,
          query,
        } = this.props;
        form.validateFields((_, values) => {
          this.onQuery({
            ...values,
            pageNum: query.pageNum,
            pageSize: query.pageSize,
          });
        });
      };

      render() {
        return (
          <WrappedComponent
            {...this.props}
            scrollHeight={this.state.height}
            width={this.state.width}
            resize={this.resize}
            // ref={(node) => { this.wrappedInstance = node; }}
            tableInit={(childCp) => { this.wrappedInstance = childCp; }}
            onQuery={this.onQuery}
            onPageChange={this.onPageChange}
            onSearch={this.onSearch}
            onReset={this.onReset}
            onFresh={this.onFresh}
          />
        );
      }
    };
  };
}
