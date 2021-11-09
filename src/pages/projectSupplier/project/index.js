import React, { Component } from 'react';
import { connect } from 'dva';
import ProjectSupplier from '@/components/ProjectSupplier/index';

@connect(({ global }) => ({
  list: global._projectList
}))
class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      data: []
    };
  }

  componentDidMount() {
    this.countType();
    this.onQuery();
  }

  countType = () => {
    const pathName = this.props.history.location.pathname;
    const type = pathName.split('/').pop();
    this.setState({ type });
  }

  onQuery = (payload = {}) => {
    this.props.dispatch({
      type: 'global/project_list',
      payload
    }).then(() => {
      this.setState({
        data: this.props.list
      });
    });
  }

  render() {
    const { type, data } = this.state;
    return (
      <>
        {type ? <ProjectSupplier type={type} list={data} onQuery={this.onQuery} /> : null }
      </>
    );
  }
}

export default Project;
