> demo

自定义查询方法

```jsx
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
  Input,
  DatePicker,
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
}, {
  title: 'createTime',
  dataIndex: 'createTime',
  key: 'createTime',
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
@AutoTable()
class App extends React.Component {
  constructor(props) {
    super(props);
    props.tableInit(this);
  }

  onQuery = (payload) => {
    const { createTime } = payload;
    // 入职时间
    if (createTime && createTime.length !== 0) {
      Object.assign(payload, {
        startcreateTime: createTime[0].startOf('day').format('X'),
        endcreateTime: createTime[1].endOf('day').format('X'),
      });
      delete payload.createTime;
    }
    this.props.dispatch({
      type: 'user/fetchList',
      payload,
    });
  };

  render() {
    const {
      scrollHeight,
      width,
      list,
      query,
      loading,
      onPageChange,
      onReset,
      onSearch,
    } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Card className="app-table-responsive">
        <Form
          className="app-searchForm"
          layout="inline"
          onSubmit={onSearch}
        >
          <Form.Item label="入职时间">
            {getFieldDecorator('createTime')(
              <DatePicker.RangePicker format="YYYY-MM-DD" />
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={loading}
            >
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              style={{ marginLeft: 8 }}
              disabled={loading}
              onClick={onReset}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
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
