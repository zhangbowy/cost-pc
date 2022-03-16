import { Modal } from 'antd';
import React, { PureComponent } from 'react';
// import { debounce } from 'lodash-decorators';

const widthSize = {
  'small': {
    width: '580px',
    height: 370
  },
  'default': {
    width: '780px',
    height: 538
  },
  'big': {
    width: '980px',
    height: 618
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
    const { children, size, footer, newBodyStyle } = this.props;
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
          maxHeight: `${widthSize[size].height - (footer ? 40 : 0)}px`,
          padding: '24px 0px 0px 32px',
          ...newBodyStyle,
        }}
      >
        <div
          style={{
            overflowY: 'scroll',
            height: `${widthSize[size].height - (footer ? 64 : 0)}px`
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
