> demo

```jsx
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
  Input,
} from 'antd';
import Pagination from 'components/Pagination';
import AutoTable from 'components/AutoTable';

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
}];

@Form.create()
@connect(({
  loading,
  user,
}) => ({
  loading: loading.effects['user/fetchList'],
  list: user.list,
  query: user.query,
}))
@AutoTable({
  action: 'user/fetchList',
})
class App extends React.Component {
  constructor(props) {
    super(props);
    props.tableInit(this);
  }

  render() {
    const {
      scrollHeight,
      width,
      list,
      query,
      loading,
      onPageChange,
    } = this.props;

    return (
      <Card className="app-table-responsive">
        <Table
          scroll={{
            y: scrollHeight,
            x: width,
          }}
          columns={columns}
          dataSource={list}
          loading={loading}
          pagination={false}
        />
        <Pagination
          dataSize={list.length}
          current={query.pageNum}
          pageSize={query.pageSize}
          onChange={onPageChange}
          showQuickJumper
          showSizeChanger
        />
      </Card>
    );
  }
}

ReactDOM.render(<App/>, mountNode);
```
