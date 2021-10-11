import React, { PureComponent } from 'react';
import { Modal, Popover } from 'antd';
import Search from 'antd/lib/input/Search';
import Lines from '@/components/StyleCom/Lines';
import style from './index.scss';

class EditCity extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  onShow = () => {
    this.setState({
      visible: true
    });
  }

  render() {
    const { children } = this.props;
    const { visible } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="编辑城市"
          visible={visible}
          bodyStyle={{
            height: '491px',
            padding: '0 24px'
          }}
          width="780px"
        >
          <div className={style.addCity}>
            <Lines name="一线城市（4个）" />
            <div className={style.cities}>
              <Popover
                trigger="click"
                overlayClassName={style.popStyle}
                icon={false}
                visible
                title={null}
                content={(
                  <div className={style.popoverCity}>
                    <div className={style.search}>
                      <div className={style.inputs}>
                        <div className={style.inputValue}>
                          <div className={style.cityName}>
                            <span>北京</span>
                            <i className="iconfont iconclose" />
                          </div>
                        </div>
                        <Search placeholder="搜素城市名称" style={{ width: '340px' }} />
                      </div>
                    </div>
                    <div className={style.menu}>
                      <span className={style.hover}>热门城市</span>
                      <span className={style.listMenu}>ABCDE</span>
                      <span className={style.listMenu}>FGHJ</span>
                      <span className={style.listMenu}>KLMNP</span>
                      <span className={style.listMenu}>QRSTW</span>
                      <span className={style.listMenu}>XYZ</span>
                    </div>
                    <div className={style.cityList}>
                      <span className={style.cityNames}>北京</span>
                    </div>
                  </div>
                )}
                onConfirm={this.confirm}
                okText="确定"
                cancelText="取消"
                onCancel={() => this.onCancel()}
              >
                <div className={style.add}>
                  <span className="fs-14 c-black-45 m-r-8">+</span>
                  <span className="fs-14 c-black-45">添加</span>
                </div>
              </Popover>
              <div className={style.city}>
                <span className="fs-14">杭州</span>
              </div>
            </div>
          </div>
          <div className={style.addCity}>
            <Lines name="一线城市（4个）" />
            <div className={style.cities}>
              <div className={style.add}>
                <span className="fs-14 c-black-45 m-r-8">+</span>
                <span className="fs-14 c-black-45">添加</span>
              </div>
              <div className={style.city}>
                <span className="fs-14">杭州</span>
              </div>
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}

export default EditCity;
