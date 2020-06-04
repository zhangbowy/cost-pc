import React from 'react';
import { Modal } from 'antd';
import Sort from '../../../../components/Sort';


export default class SortModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  show = () => {
    this.setState({
      visible: true,
    });
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { children } = this.props;
    const { visible } = this.state;
    return (
      <span onClick={() => this.show()}>
        <span>{ children }</span>
        <Modal
          title="费用类型排序"
          visible={visible}
          onCancel={() => this.onCancel()}
        >
          <Sort
            treeList={[{
              id: '12',
              name: '测试',
              sort: 1,
            }]}
          />
        </Modal>
      </span>
    );
  }
}

