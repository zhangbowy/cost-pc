import React, { Component } from 'react';
import { Input, Icon } from 'antd';
import moment from 'moment';
import styles from './index.scss';

// type IProps = {
//   className?: string;
//   style?: React.CSSProperties;
//   value?: string;
//   defaultValue?: string;
//   startValue?: string;
//   endValue?: string;
//   open?: boolean;
//   disabled?: boolean;
//   onOk?: Function;
//   showOk?: boolean;
//   onChange?: Function;
// };
// type IState = {
//   stateOpen: boolean;
//   year: string;
//   selectTime: string;
//   selectionTime: string;
//   oneDisplay: string;
//   twoDisplay: string;
// };

const quarterData = [{
  value: 'year-01~year-03',
  label: '第一季度'
}, {
  value: 'year-04~year-06',
  label: '第二季度'
}, {
  value: 'year-07~year-09',
  label: '第三季度'
}, {
  value: 'year-10~year-12',
  label: '第四季度'
}];

const _defaultProps = {
  showOk: false, // 是否使用确定按钮，默认不使用
  disabled: false, // 组件是否禁用，默认组件可以使用
  defaultValue: '请选择时间', // 默认日期 or 没有日期时的提示语
  value: '',
  startValue: '1970-1',
  endValue: `${moment().format('YYYY')}-${moment().quarter()}`,
  open: undefined,
  onOk: () => {},
  className: '',
  isClear: false
};

class QuarterPicker extends Component {
  static defaultProps = _defaultProps; // 主要是用 static 关联当前的class Loading

  toggleContainer;

  constructor(props) {
    super(props);
    this.state = {
      stateOpen: false, // 是否展示弹窗
      year: '', // "2020"
      selectTime: `${moment().format('YYYY')}-${moment().quarter()}`, // 选中的时间， "2020-1"， "-1" 代表第一季度
      selectionTime: '', // 点确定后需要返回的时间
      oneDisplay: 'block',
      twoDisplay: 'block',
      value: '',
      isMouse: false
    };
    this.toggleContainer = React.createRef();

  }

  componentDidMount() {
    const { value, open } = this.props;
    let { year } = this.state;
    const { selectTime } = this.state;
    year = value ? value.split('-')[0] : selectTime.split('-')[0];
    this.setState({
      selectTime: value || selectTime,
      selectionTime: value || '',
      year,
      value: (value?value.replace(/\d{4}-/g,'year-'):'')
    });
    // this.idBlock(year);
    if (open === undefined) {
      document.addEventListener('mousedown', this.handleClickOutside);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  // componentWillReceiveProps 被废弃，使用 getDerivedStateFromProps 来取代
  static getDerivedStateFromProps(nextProps, prevState) {
    // 该方法内禁止访问 this
    const { value } = nextProps;
    console.log(nextProps);
    console.log(prevState);
    if (value !== prevState.selectionTime) {
      // 通过对比nextProps和prevState，返回一个用于更新状态的对象
      return {
        selectTime: prevState.selectTime,
        selectionTime: prevState.selectionTime,
        year: prevState.year
      };
    }
    // 不需要更新状态，返回null
    return null;
  }

  onclick = () => {
    // ...
    this.setState(prev => ({
      stateOpen: !prev.stateOpen,
    }));
  }

  handleClickOutside = (ev) => {
    if (!(this && this.toggleContainer && this.toggleContainer.current)) {
      return;
    }
    if (this.state.stateOpen && !this.toggleContainer.current.contains(ev.target)) {
      this.setState({ stateOpen: false });
    }
  };

  // ulliclick = (index) => {
  //   // ...
  // }

  iconLeftClick = () => {
    // ...
    // const year = parseInt(this.state.year);
    const { year } = this.state;
    this.setState({
      year: (parseInt(year,0) - 1).toString()
    });
  }

  iconRightClick = () => {
    // ...
    const { year } = this.state;
    this.setState({
      year: (parseInt(year,0) + 1).toString()
    });
  }

  // idBlock = (year) => {
  //   // ...
  // }

  // okBut = (ev) => {
  //   // ...
  // }

  // textChange = () => {
  //   // ...
  // }

  changeQuarter = (item) => {
    const { year } = this.state;
    const str = item.value.replace(/year/g,year);
    this.setState({
      selectionTime: str,
      stateOpen: false,
      value: item.value,
    });
    if(this.props.onChange){
      this.props.onChange(str);
    }
    // this.props.onChange && this.props.onChange(str);
  }

  clear(){
    const { isMouse, selectionTime } = this.state;
    if(isMouse && selectionTime){
      this.setState({selectionTime: '',value: ''});
      if(this.props.onChange){
        this.props.onChange('');
      }
    }
  }

  render() {
    const { oneDisplay, twoDisplay, year, selectionTime, stateOpen,isMouse,isClear } = this.state;
    const { className, disabled, showOk, open } = this.props;
    let openOnOff = false;
    if (typeof (this.props.open) === 'boolean') {
      openOnOff = !!open;
    } else {
      openOnOff = stateOpen;
    }
    console.log(this.state.value);
    return (
      <div
        className={`${styles.QuarterlyPicker} ${className}`}
        id={styles.QuarterlyPicker}
        style={this.props.style}
        ref={this.toggleContainer}
      >
        <div
          className={styles.begin}
          onMouseEnter={() => this.setState({isMouse: !!isClear})}
          onMouseLeave={() => this.setState({isMouse: false})}
        >
          <Input
            value={selectionTime}
            disabled={disabled}
            placeholder="请选择季度"
            onClick={(ev) => { this.onclick(ev); }}
            onChange={() => { this.textChange(); }}
            suffix={
              <Icon 
                className={`${styles.img} ${(isMouse&&selectionTime)?styles.iconHover:''}`} 
                type={(isMouse&&selectionTime)?'close-circle':'calendar'}  
                theme={(isMouse&&selectionTime)?'filled':''} 
                onClick={() => this.clear()}
              />
            }
          />
        </div>
        <div className={styles.child} style={{ display: openOnOff ? 'block' : 'none' }}>
          {/* <header className="zjl-timehear">
            <span>{selectTime}</span>
          </header> */}
          <div className={styles.con}>
            <ul className={styles.contentOne}>
              <li className={styles.lefticon} onClick={this.iconLeftClick} style={{ display: oneDisplay }}>{'<<'}</li>
              <li className={styles.righticon} onClick={this.iconRightClick} style={{ display: twoDisplay }}>{'>>'}</li>
              <li>{year}</li>
            </ul>
          </div>
          <div className={styles.TimerXhlleft}>
            <ul className={styles.quaterleft}>
              {
                quarterData && quarterData.map(item => {
                  return (
                    <li
                      key={item.value}
                      className={`${styles.quaterleftli} ${this.state.value === item.value ? styles.active : ''}`}
                      onClick={this.changeQuarter.bind(this, item)}
                    >
                      {item.label}
                    </li>
                  );
                })
              }
            </ul>
          </div>
          {
            showOk ?
              <div className={styles.zjlBut}>
                <span onClick={this.okBut}>确定</span>
              </div> : null
          }
        </div>
      </div>
    );
  }
}

export default QuarterPicker;