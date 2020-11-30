import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

export default class YearPicker extends Component {
  state =  {
    isopen: false,
    time: moment(this.props.defaultValue)||null
  }

  handlePanelChange = (value) => {  
    this.setState({      
      time: value,      
      isopen: false    
    }); 
    if(this.props.onChange){
      this.props.onChange(value._d.getFullYear());
    } 
  } 
 
  handleOpenChange = (status) => {    
    // console.log(status)    
    if(status){      
      this.setState({isopen: true});    
    } else {      
      this.setState({isopen: false});    
    } 
  }  

  clearValue = () => {    
    this.setState({      
        time: null    
    });  
  }
  
  render() {
    console.log(6666,moment(this.props.defaultValue));
    return (
      <span>
        <DatePicker               
          value={this.state.time}               
          open={this.state.isopen}
          allowClear={false}
          mode="year"               
          placeholder='请选择年份'  
          format="YYYY"              
          onOpenChange={this.handleOpenChange}              
          onPanelChange={this.handlePanelChange}              
          onChange={this.clearValue}
          // disabledDate={this.props.disabledDate}  
          // disabledDate={(current) => {return current && current > moment().endOf('day');}}
        />        
      </span>
    );
  }  
}