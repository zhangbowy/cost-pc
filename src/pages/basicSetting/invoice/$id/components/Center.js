/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-find-dom-node */
import React, { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import Templates from './templates';
// import PropTypes from 'prop-types'
import style from './index.scss';

function StrCenter({ selectList, findCard, dragId, onChange }) {


  const [, drop] = useDrop({
    accept: 'box',
  });
  const moveCard = useCallback((dragIndex, hoverIndex) => {
      /**
       * 1、如果此时拖拽的组件是 Box 组件，则 dragIndex 为 undefined，则此时修改，则此时修改 cardList 中的占位元素的位置即可
       * 2、如果此时拖拽的组件是 Card 组件，则 dragIndex 不为 undefined，此时替换 dragIndex 和 hoverIndex 位置的元素即可
       */
      if (dragIndex === undefined) {
        const lessIndex = selectList.findIndex((item) => item.id === -1);
        const datas = selectList.filter((item) => item.id === -1)[0];
        onChange('selectList', update(selectList, {
            $splice: [[lessIndex, 1], [hoverIndex, 0, { isSelect: 'true', ...datas, id: -1}]],
        }));
      } else {
        const dragCard = selectList[dragIndex];
        onChange('selectList', update(selectList, {
            $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
        }));
      }
      // eslint-disable-next-line
  }, [selectList]);
  return (
    <div className={style.contents} ref={drop}>
      {
        selectList.map((item, index) =>(
          <Templates
            key={item.field}
            {...item}
            moveCard={moveCard}
            findCard={findCard}
            dragId={dragId}
            onChange={onChange}
            index={index}
          />
        ))
      }
    </div>
  );
}

// const spec = {
// 	drop : () => ({ name: 'box' })
// };

// const collect = (connect) => ({
// 	// 这里返回一个对象，会将对象的属性都赋到组件的 props 中去。这些属性需要自己定义。
// 	connectDropTarget: connect.dropTarget()
// });
// @DropTarget('box', spec, collect)
// class StrCenter extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       selectList: this.props.selectList,
//     };
//   }

//   componentDidUpdate(prevProps) {
//     if (prevProps.selectList !== this.props.selectList) {
//       this.setState({
//         selectList: this.props.selectList,
//       });
//     }
//   }

//   moveCard = (dragIndex, hoverIndex) => {
//     /**
//      * 1、如果此时拖拽的组件是 Box 组件，则 dragIndex 为 undefined，则此时修改，则此时修改 cardList 中的占位元素的位置即可
//      * 2、如果此时拖拽的组件是 Card 组件，则 dragIndex 不为 undefined，此时替换 dragIndex 和 hoverIndex 位置的元素即可
//      */
//     const { onChange } = this.props;
//     const { selectList } = this.state;
//     const newArr = this.state.selectList;
//     if (dragIndex === undefined) {
//       const lessIndex = newArr.findIndex((item) => item.id === -1);
//       const datas = newArr.filter((item) => item.id === -1)[0];
//       onChange('selectList', update(newArr, {
//           $splice: [[lessIndex, 1], [hoverIndex, 0, { isSelect: 'true', ...datas, id: -1}]],
//       }));
//       this.setState(update(selectList, {
//         $splice: [[lessIndex, 1], [hoverIndex, 0, { isSelect: 'true', ...datas, id: -1}]],
//       }));
//     } else {
//       const dragCard = newArr[dragIndex];
//       onChange('selectList', update(newArr, {
//           $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
//       }));
//       this.setState(update(selectList, {
//         $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
//     }));
//     }
//   }

//   render() {
//     const { selectList } = this.state;
//     const { dragId, onChange } = this.props;
//     return (
//       <div className={style.contents}>
//         {
//           selectList.map((item, index) =>(
//             <Templates
//               key={item.field}
//               id={`${item.field}`}
//               name={item.name}
//               isWrite={item.isWrite}
//               moveCard={this.moveCard}
//               findCard={(val) => this.props.findCard(val)}
//               dragId={dragId}
//               onClick={onChange}
//               index={index}
//             />
//           ))
//         }
//       </div>
//     );
//   }
// }

export default StrCenter;

