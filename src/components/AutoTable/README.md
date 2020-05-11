> 通用表格

表格高度可根据窗口自适应【建议配合组件Card及样式app-table-responsive】

## 使用场景
表格高度需自适应，表格通用方法无需二次开发

## API

### AutoTable(options)

使用方式如下：

```jsx
class Example extends React.Component {}

export default AutoTable({})(Example);
```

`options` 的配置项如下：

| Name | Description | Type | Default |
| :--- | :--- | :--- | :--- | :--- |
| offset | 偏差值【通常为表头或分页的高度】 | number | 60 |
| tableRoot | 表格容器节点 | string | .ant-table-wrapper |
| action | redux方法 | string |
| fetchPayload | 通用请求参数 | object |

经过 `AutoTable` 包装的组件将会自带属性如下：

| Name | Description | Type |
| --- | --- | --- | --- | --- |
| scrollHeight | 表格滚动高度 | number  |
| width | 表格宽度 | number |
| resize | 表格高度重置 | function |
| tableInit | 表格初始化 | function |
| onQuery | 查询【可自定义】 | function |
| onPageChange | 分页回调 | function |
| onSearch | 搜索 | function |
| onReset | 重置搜索条件 | function |
| onFresh | 刷新 | function |

## Usage

```jsx
import { Table } from 'antd';
import TableBtn from 'components/AutoTable';

@Form.create()
@AutoTable({
  action: 'list/fetch',
})
class App extends React.Component {
  constructor(props) {
    super(props);
    props.tableInit(this);
  }

  render() {
    return (
      <Card className="app-table-responsive">
        <Table
          bordered
          scroll={{
            y: this.props.scrollHeight,
            x: this.props.width,
          }}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={false}
         />
      </Card>
    );
  }
}

ReactDOM.render(<App/>, mountNode);
```
