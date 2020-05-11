const menuData = [
  {
    id: 'workbench',
    name: '工作台',
    icon: 'table',
    path: 'workbench',
  },
  {
    id: 'basicSetting',
    name: '基础设置',
    icon: 'table',
    path: 'basicSetting',
    children: [{
      id: 'basicSetting_costCategory',
      name: '费用类别',
      path: 'costCategory',
    }],
  }
];
// 菜单访问路径解析
function formatter(data, parentPath = '/') {
  return data.map(item => {
    const path = parentPath + item.path;
    const result = {
      ...item,
      path,
    };
    if (item.children && item.children.length > 0) {
      result.children = formatter(item.children, `${path}/`);
    }
    return result;
  });
}

export default formatter(menuData);
