export default {
  namespace: 'global',
  state: {
    breadcrumbs: [], // 面包屑
    menuKey: '', // 导航选中标识
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeBreadcrumb(state, { payload }) {
      return {
        ...state,
        breadcrumbs: payload,
      };
    },
  },
};
