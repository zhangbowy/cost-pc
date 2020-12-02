import React, { Component } from 'react';
import styles from './index.scss';

class Modal extends Component{
  constructor(props){
    super(props);
    this.state = {
      // message:'1'
    };
  }

  render(){
    const { visible } = this.props;
    console.log(visible);
    return (
      <div className={styles.ModalBox} style={{display: visible?'block':'none'}} >
        <div className={styles.Modal} style={{position:'fiexd'}}>
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default Modal;