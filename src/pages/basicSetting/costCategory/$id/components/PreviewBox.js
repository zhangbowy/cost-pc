import React from 'react';
import { useDragLayer } from 'react-dnd';
// import BoxDragPreview from './BoxDragPreview';
import Templates from './Templates';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '400px',
  height: '119px',
};
function getItemStyles(initialOffset, currentOffset) {
  console.log('getItemStyles -> isDragging');
  if (!initialOffset || !currentOffset) {
    console.log('getItemStyles -> currentOffset', currentOffset);
    console.log('getItemStyles -> initialOffset', initialOffset);
    return {
      display: 'none',
    };
  }
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform
  };
}
function PreviewBox() {
  const { item, initialOffset, currentOffset, isDragging } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
  }));
  function renderItem() {
    return (<Templates {...item} />);
  }
  if (!isDragging) {
    return null;
  }
  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset, item)}>
        {renderItem()}
      </div>
    </div>
  );
}

export default PreviewBox;
