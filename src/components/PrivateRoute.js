import React from 'react';
import PropTypes from 'prop-types';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import Exception from '@/components/Exception';
import { authCheck } from '@/utils/authority';
import { urlToList } from '@/utils/common';

const filterMenu = (menu, path) => {
  let result = null;
  const find = (data) => {
    return data.find((item) => {
      if (item.path === path) {
        result = item;
        return true;
      }
      if (item.children && item.children.length > 0) {
        return find(item.children);
      }
      return false;
    });
  };
  find(menu);
  return result;
};

@withRouter
@connect(({ session }) => ({
  menus: session.menus,
}))
class App extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    route: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    menus: PropTypes.array,
  };

  state = {
    crumbDone: false, // 面包屑处理标识
  };

  componentDidMount() {
    const {
      route,
      dispatch,
    } = this.props;

    dispatch({
      type: 'global/save',
      payload: {
        menuKey: route.menuKey,
      },
    });
    if (route.crumbDefined) {
      // 自定义面包屑
      this.setState({
        crumbDone: true,
      });
    } else {
      // 根据url解析生成面包屑
      this.setBreadcrumbByUrl();
    }
  }

  componentDidUpdate() {
    const { crumbDone } = this.state;
    if (!crumbDone) {
      this.setBreadcrumbByUrl();
    }
  }

  // 根据url解析生成面包屑
  setBreadcrumbByUrl = () => {
    const {
      menus,
      dispatch,
      route,
    } = this.props;

    if (menus.length !== 0) {
      const { location: { pathname } } = this.props;
      const path = route.menuKey || pathname;
      const pathSnippets = urlToList(path);
      const breadcrumbs = [];
      pathSnippets.forEach((item, index) => {
        const result = filterMenu(menus, item);
        if (result) {
          if (
            index === 0 // 排除第一级
            || index === pathSnippets.length - 1 // 排除最后一级
            || (result.children && result.children.length > 0) // 排除目录菜单
          ) {
            breadcrumbs.push({
              name: result.name,
            });
          } else {
            breadcrumbs.push({
              path: result.path,
              name: result.name,
            });
          }
        }
      });

      dispatch({
        type: 'global/changeBreadcrumb',
        payload: breadcrumbs,
      });
      this.setState({
        crumbDone: true,
      });
    }
  };


  render() {
    const { route, children } = this.props;
    if (route.auth && !authCheck(route.auth)) {
      return <Exception type="403" />;
    }

    return children;
  }
}

export default App;
