import { Modal } from 'antd';
import React, { PureComponent } from 'react';
// import { debounce } from 'lodash-decorators';

const widthSize = {
  'small': {
    width: '580px',
    height: 370
  },
  'middle': {
    width: '780px',
    height: 505
  },
};
class ModalTemp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isScroll: false,
    };
  }

  handleScroll = (el) => {
    this.setState({
      isScroll: el.scrollTop > 0,
    });
  }

  render() {
    const { children, size, footer } = this.props;
    const { isScroll } = this.state;
    return (
      <Modal
        {...this.props}
        className={isScroll ? 'ant-footer-shadow' : ''}
        closeIcon={(
          <div className="modalIcon">
            <i className="iconfont icona-guanbi3x1" />
          </div>
        )}
        wrapClassName="centerModal"
        width={widthSize[size].width}
        bodyStyle={{
          height: `${widthSize[size].height - (footer ? 110 : 0)}px`,
          padding: '12px 32px 4px 32px',
        }}
      >
        <div
          style={{
            overflowY: 'scroll',
            height: `${widthSize[size].height - (footer ? 96 : 32)}px`,
          }}
          onScroll={({target}) => this.handleScroll(target)}
        >
          {children}
        </div>
      </Modal>
    );
  }
}

export default ModalTemp;
