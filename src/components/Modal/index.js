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
    
    return (
      <div className={styles.ModalBox} />
    );
  }
}

export default Modal;