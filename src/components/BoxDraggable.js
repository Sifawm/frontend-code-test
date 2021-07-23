import React from 'react';
import { observer } from 'mobx-react';

function BoxDraggable(props) {
  const { box } = props;

  const onSelect = event => {
    const multiple = event.ctrlKey;

    if (multiple && props.selected) {
      box.unselect();
    } else {
      box.select(multiple);
    }
  };

  return (
    <div
      id={props.id}
      className="box"
      style={{
        backgroundColor: props.color,
        width: props.width,
        height: props.height,
        transform: `translate(${props.left}px, ${props.top}px)`,
        outline: props.selected ? 'blue solid 3px' : 0,
      }}
      onClick={onSelect}
    >
      {props.children}
    </div>
  );
}

export default observer(BoxDraggable);
