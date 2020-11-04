import React from 'react';
import style from './index.scss';

class SubHeader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  link = () => {
    const { title } = this.props;
    if (title) {
      this.props.history.push('/system/auth');
    } else {
      this.props.history.push('/system/auth');
    }
  }

  render() {
    const { content, sub, title } = this.props;
    return (
      <div className={style.subHeader}>
        {
          sub &&
          <p className="fs-14 m-b-16">
            <span className="sub-color cur-p" onClick={() => this.link()}>{title || '角色管理'}</span>
            <span className="m-l-8">/</span>
            <span className="m-l-8">设置人员</span>
          </p>
        }
        <p className="fs-20 m-b-8 fw-500 c-black-85">{content.roleName}</p>
        <p>{content.note}</p>
      </div>
    );
  }
}

export default SubHeader;
