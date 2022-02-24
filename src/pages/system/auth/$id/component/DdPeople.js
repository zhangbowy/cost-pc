import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Select } from 'antd';
import { connect } from 'dva';

const { Option, OptGroup } = Select;
@connect(({ loading, costGlobal }) => ({
  loading: loading.effects['costGlobal/list'] || false,
  roleLists: costGlobal.roleLists,
}))
class DdPeople extends PureComponent {
  constructor(props) {
    super(props);
    this.state={
      visible: false,
      value: [],
    };
  }

  onShow = () => {
    this.props.dispatch({
      type: 'costGlobal/roleLists',
      payload: {
        offset: 0,
        size: 100,
      }
    }).then(() => {
      this.setState({
        visible: true,
      });
    });
  }

  onOk = () => {
    const { value } = this.state;
    const { roleId, pageType } = this.props;
    const params = { dingRoleIds: pageType !== 'role'
      ? value.map(it => { return { id: it.key, name: it.label }; })
      : value.map(it => it.id) };
    if (pageType === 'role') {
      Object.assign(params, {
        roleId,
      });
    } else {
      Object.assign(params, {
        list: params.dingRoleIds,
      });
    }
    this.props.dispatch({
      type: pageType === 'role' ? 'setUser/addddRole' : 'auth/addDDRole',
      payload: params,
    }).then(() => {
      this.onCancel();
      this.props.onOk();
    });
    console.log(value);
  }

  onCancel = () => {
    this.setState({
      visible: false,
      value: [],
    });
  }

  handleChange = value => {
    this.setState({
      value,
      // fetching: false,
    });
  };

  render() {
    const { children, roleLists } = this.props;
    const { visible } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          visible={visible}
          title="钉钉角色同步"
          onCancel={this.onCancel}
          onOk={this.onOk}
        >
          <Select
            mode="multiple"
            onChange={this.handleChange}
            style={{ width: '276px' }}
            placeholder="请选择钉钉角色"
            labelInValue
          >
            {
              roleLists.map(it => (
                <OptGroup label={it.name} key={it.groupId}>
                  {
                    it.roles.map(item => (
                      <Option key={item.id}>{item.name}</Option>
                    ))
                  }
                </OptGroup>
              ))
            }
          </Select>
        </Modal>
      </span>
    );
  }
}
DdPeople.propTypes = {
  children: PropTypes.object,
};

export default  DdPeople;
