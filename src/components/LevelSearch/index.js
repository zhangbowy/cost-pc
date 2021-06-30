// import React, { Component } from 'react';
// import { Form, Popover, Divider } from 'antd';
// import style from './index.scss';
// import FormList from '../FormList';
// import FormSearch from '../../pages/statistics/overview/components/Search/FormSearch';

// @Form.create()
// class LevelSearch extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//     };
//   }

//   onShow = () => {

//   }

//   onSubmit = () => {

//   }

//   selectPle = (res, name, dep) => {
//     this.setState({
//       [`${name}VOS`]: res.users || [],
//       [`${dep}VOS`]: res.depts || [],
//     });
//   }

//   onReset = () => {
//     this.props.form.resetFields();
//   }

//   onCancel = () => {
//     this.onReset();
//   }

//   render() {
//     const {
//       children,
//       fields,
//     } = this.props;
//     return (
//       <span>
//         <Popover
//           trigger="click"
//           title={null}
//           placement="bottomRight"
//           overlayClassName={style.popover}
//           getPopupContainer={triggerNode => triggerNode.parentNode}
//           content={(
//             <>
//               <div className={style.formCnt}>
//                 <FormSearch
//                   fields={fields}
//                 />
//               </div>
//               <Divider type="horizontal" style={{ margin: 0 }} />
//               <div className={style.delBtn} onClick={() => this.onCancel()}>
//                 <i className="iconfont iconshanchu" />
//                 <span>清除所有筛选条件</span>
//               </div>
//             </>
//           )}
//         >
//           <span>{children}</span>
//         </Popover>
//       </span>
//     );
//   }
// }

// export default LevelSearch;
