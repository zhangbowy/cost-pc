/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-named-as-default */
import React, { Component } from 'react';
import cs from 'classnames';
// import treeConvert from '@/utils/treeConvert';
import style from './index.scss';
// import ChildNodes from './ChildNodes';

const list = [{
  value: '父节点1',
  key: 'first',
  level: 1,
  children: [{
    key: 'first-1',
    value: '子节点',
    level: 2
  }, {
    key: 'first-2',
    value: '子节点2',
    level: 2
  }, {
    key: 'first-3',
    value: '子节点3',
    level: 2
  }]
}, {
  value: '父节点2',
  key: 'second',
  level: 1,
  children: [{
    key: 'second-1',
    value: '子节点',
    level: 2
  }, {
    key: 'second-2',
    value: '子节点2',
    level: 2
  }]
}, {
  value: '父节点3',
  key: 'third',
  level: 1,
  children: [{
    level: 2,
    key: 'third-1',
    value: '子节点'
  }]
}];
class Sort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeList: list || []
    };
  }

  each = (arr, len, id) => {
    console.log(`id${id}`);
    for(let i=0;i<arr.length; i+=1) {
      const item = arr[i];
      if (arr[i].key === id) {
        arr[i].children = this.changeArrIndex(item.children, len-1, len);
        console.log(arr);
        // setTreeList(arr);
        return arr;
      }
      if (item.children) {
        this.each(item.children, len, id);
      }
    }
    // arr.forEach(item => {

    // });
  };

  handleClick = (e) => {
    console.log(e);
    // 这是点击➡️ 时调用的方法
    // 如果当前这个➡️ 没有旋转，那就设置旋转，视觉效果
    e.target.style.transform = e.target.style.transform === 'rotate(-90deg)' ? 'rotate(0deg)' : 'rotate(-90deg)';
    for(const item in e.target.parentNode.parentNode.parentNode.parentNode.childNodes){
        // 点击的时候设置当前层级的子元素素隐藏
        // 操作了DOM,我很难受
        if(item > 0){
            e.target.parentNode.parentNode.parentNode.parentNode.childNodes[item].style.display = e.target.parentNode.parentNode.parentNode.parentNode.childNodes[item].style.display === 'none' ? 'block' : 'none';
        }
    }
  };

  changeArrIndex = (arr,startIndex,endIndex) => {
    arr[startIndex] = arr.splice(endIndex,1,arr[startIndex])[0];
    return arr;
  };

  upStep = (index, level, parentId) => {
    console.log(parentId);
    const { treeList } = this.state;
    const lists = [...treeList];
    if (level === 1) {
      this.setState({
        treeList: this.changeArrIndex(lists, index-1, index),
      });
    } else {
      this.setState({
        treeList: this.each(list, index, parentId) || []
      });
    }
  };

  tree = (child, parentId) => {
    let treeItem;
    // 如果有子元素
    if(child){
        // 子元素是数组的形式，把所有的子元素循环出来
        treeItem = child.map((item, index) => {
            // 同理，设置样式
            // parseInt(item.level.slice(5), 10)
            const itemStyle = {
                paddingLeft: `${20*(item.level -1)}px`
            };
            console.log(item.key);
            return  (
              <ul key={item.key}>
                <li className={item.level} style={itemStyle}>
                  <div className={style.sorts}>
                    <div className={style.cnt}>
                      { item.children &&
                      <i
                        onClick={e => this.handleClick(e)}
                        style={{display: 'inline-block'}}
                        className="iconfont icondown"
                      /> }
                      <span>{item.value}</span>
                    </div>
                    <div className={cs(style.op, 'font-color')}>
                      <span
                        className={(index > 0) ? cs(style.op, 'sub-color') : ''}
                        onClick={() => this.upStep(index, item.level, parentId)}
                      >
                        向上
                      </span>
                      <span className="border-color">｜</span>
                      <span className={(index !== (child.length-1)) ? 'sub-color' : ''}>向下</span>
                    </div>
                  </div>
                </li>
                {/* 如果当前子元素还有子元素，就递归使用tree方法，把当前子元素的子元素渲染出来 */}
                {this.tree(item.children, item.key)}
              </ul>
            );
        });
    }
    return treeItem;
  };

  treeItemGroup = (itemGroup, index) => {
    const { treeList } = this.state;
    const itemGroupItem = [];
    // parseInt(itemGroup.level.slice(5), 10)
    const itemStyle = {
      paddingLeft: `${20*(itemGroup.level -1)}px`,
    };
    console.log(itemGroup.key);
    itemGroupItem.push(
      <ul key={itemGroup.key} >
        <li key={itemGroup.key} style={itemStyle}>
          <div className={style.sorts} key={itemGroup.key}>
            <div className={style.cnt}>
              { itemGroup.children && <i className="iconfont icondown" style={{display: 'inline-block'}} onClick={e => this.handleClick(e)} /> }
              <span>{itemGroup.value}</span>
            </div>
            <div className={cs(style.op, 'font-color')}>
              <span
                onClick={() => this.upStep(index, itemGroup.level, itemGroup.key)}
                className={(index > 0) ? cs(style.up, 'sub-color') : ''}
              >
                向上
              </span>
              <span className="border-color">｜</span>
              <span className={(index !== (treeList.length-1)) ? 'sub-color' : ''}>向下</span>
            </div>
          </div>
        </li>
        {this.tree(itemGroup.children, itemGroup.key)}
      </ul>
    );
    return itemGroupItem;
  };

  render() {
    const { treeList } = this.state;
    return (
      <>
        {
          treeList.map((item, index) => (
            this.treeItemGroup(item, index)
          ))
        }
      </>
    );
  }
}

export default Sort;
// const Sort =  (props) => {
//   console.log(props);
//   const [treeList, setTreeList] = useState(list);

//   const changeArrIndex = (arr,startIndex,endIndex) => {
//       arr[startIndex] = arr.splice(endIndex,1,arr[startIndex])[0];
//       return arr;
//   };
//   const each = (arr, len, id) => {
//     console.log(`id${id}`);
//     for(let i=0;i<arr.length; i+=1) {
//       const item = arr[i];
//       if (arr[i].key === id) {
//         arr[i].children = changeArrIndex(item.children, len-1, len);
//         console.log(arr);
//         // setTreeList(arr);
//         return arr;
//       }
//       if (item.children) {
//         each(item.children, len, id);
//       }
//     }
//     // arr.forEach(item => {

//     // });
//   };
//   const upStep = (index, level, parentId) => {
//     console.log(parentId);
//     const lists = [...treeList];
//     if (level === 1) {
//       setTreeList(changeArrIndex(lists, index-1, index));
//     } else {
//       console.log(each(list, index, parentId));
//       setTreeList(each(list, index, parentId) || []);
//     }
//   };
//   // const treeList = props.list || list;
//   const handleClick = (e) => {
//     console.log(e);
//     // 这是点击➡️ 时调用的方法
//     // 如果当前这个➡️ 没有旋转，那就设置旋转，视觉效果
//     e.target.style.transform = e.target.style.transform === 'rotate(-90deg)' ? 'rotate(0deg)' : 'rotate(-90deg)';
//     for(const item in e.target.parentNode.parentNode.parentNode.parentNode.childNodes){
//         // 点击的时候设置当前层级的子元素素隐藏
//         // 操作了DOM,我很难受
//         if(item > 0){
//             e.target.parentNode.parentNode.parentNode.parentNode.childNodes[item].style.display = e.target.parentNode.parentNode.parentNode.parentNode.childNodes[item].style.display === 'none' ? 'block' : 'none';
//         }
//     }
//   };

//   const tree = (child, parentId) => {
//     let treeItem;
//     // 如果有子元素
//     if(child){
//         // 子元素是数组的形式，把所有的子元素循环出来
//         treeItem = child.map((item, index) => {
//             // 同理，设置样式
//             // parseInt(item.level.slice(5), 10)
//             const itemStyle = {
//                 paddingLeft: `${20*(item.level -1)}px`
//             };
//             console.log(item.key);
//             return  (
//               <ul key={item.key}>
//                 <li className={item.level} style={itemStyle}>
//                   <div className={style.sorts}>
//                     <div className={style.cnt}>
//                       { item.children &&
//                       <i
//                         onClick={e => handleClick(e)}
//                         style={{display: 'inline-block'}}
//                         className="iconfont icondown"
//                       /> }
//                       <span>{item.value}</span>
//                     </div>
//                     <div className={cs(style.op, 'font-color')}>
//                       <span
//                         className={(index > 0) ? cs(style.op, 'sub-color') : ''}
//                         onClick={() => upStep(index, item.level, parentId)}
//                       >
//                         向上
//                       </span>
//                       <span className="border-color">｜</span>
//                       <span className={(index !== (child.length-1)) ? 'sub-color' : ''}>向下</span>
//                     </div>
//                   </div>
//                 </li>
//                 {/* 如果当前子元素还有子元素，就递归使用tree方法，把当前子元素的子元素渲染出来 */}
//                 {tree(item.children, item.key)}
//               </ul>
//             );
//         });
//     }
//     return treeItem;
//   };
//   const treeItemGroup = (itemGroup, index) => {
//     const itemGroupItem = [];
//     // parseInt(itemGroup.level.slice(5), 10)
//     const itemStyle = {
//       paddingLeft: `${20*(itemGroup.level -1)}px`,
//     };
//     console.log(itemGroup.key);
//     itemGroupItem.push(
//       <ul key={itemGroup.key} >
//         <li key={itemGroup.key} style={itemStyle}>
//           <div className={style.sorts} key={itemGroup.key}>
//             <div className={style.cnt}>
//               { itemGroup.children && <i className="iconfont icondown" style={{display: 'inline-block'}} onClick={e => handleClick(e)} /> }
//               <span>{itemGroup.value}</span>
//             </div>
//             <div className={cs(style.op, 'font-color')}>
//               <span
//                 onClick={() => upStep(index, itemGroup.level, itemGroup.key)}
//                 className={(index > 0) ? cs(style.up, 'sub-color') : ''}
//               >
//                 向上
//               </span>
//               <span className="border-color">｜</span>
//               <span className={(index !== (treeList.length-1)) ? 'sub-color' : ''}>向下</span>
//             </div>
//           </div>
//         </li>
//         {tree(itemGroup.children, itemGroup.key)}
//       </ul>
//     );
//     return itemGroupItem;
//   };

//   return (
//     <>
//       {
//         treeList.map((item, index) => (
//           treeItemGroup(item, index)
//         ))
//       }
//     </>
//   );
// };

// export default Sort;
