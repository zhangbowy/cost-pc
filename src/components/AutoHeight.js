/**
 * 查询表格纵向高度自适应
 * 需配合组件Card及样式app-TableList
 *
 * @param {String} [offset=60] - 偏差值【通常为表头或分页的高度】
 * @example
 * @autoHeight()
 * export default class Example extends React.PureComponent {
 *   render() {
 *     return (
 *       <Card className="app-TableList">
 *         <Table
 *           bordered
 *           scroll={{ y: this.props.scrollHeight}}
 *           columns={columns}
 *           dataSource={dataSource}
 *           pagination={false}
 *         />
 *       </Card>
 *     );
 *   }
 * }
 *
 * @date 2018/08/27
 */
import React from 'react';
import Debounce from 'lodash-decorators/debounce';

const getTableHeight = (offset = 60) => {
    let scrollHeight = 0;
    const table = document.querySelector('.ant-table-wrapper');
    if (table) {
        scrollHeight = table.offsetHeight - offset;
    }
    return scrollHeight;
};

export default function (offset) {
    return function autoHeight(WrappedComponent) {
        return class extends React.Component {
            state = {
                scrollHeight: 0,
            };

            componentDidMount() {
                window.addEventListener('resize', this.resize);
                const height = getTableHeight(offset);
                if (height) {
                    this.setState({
                        scrollHeight: height,
                    });
                }
            }

            componentWillUnmount() {
                window.removeEventListener('resize', this.resize);
            }

            @Debounce(400)
            resize = () => {
                const height = getTableHeight(offset);
                if (height) {
                    this.setState({
                        scrollHeight: height,
                    });
                }
            };

            render() {
                return <WrappedComponent {...this.props} scrollHeight={this.state.scrollHeight} />;
            }
        };
    };
}
