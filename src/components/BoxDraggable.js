import React, { useEffect, useRef } from 'react';
import interact from 'interactjs';
import { observer } from 'mobx-react';

function BoxDraggable(props) {
  const { box } = props;

  const ref = useRef(null);
  const interactable = useRef(null);
  const isDragging = useRef(null);

  useEffect(() => {
    interactable.current = interact(ref.current).draggable({
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          elementRect: { left: 0, right: 1, top: 0, bottom: 1 },
        }),
      ],
      listeners: {
        start() {
          console.log('entra');
          isDragging.current = true;
        },

        move(event) {
          const x = event.dx;
          const y = event.dy;

          box.move(x, y);
        },
      },
    });
  });

  const onSelect = event => {
    if (!isDragging.current) {
      const multiple = event.ctrlKey;
      if (multiple && props.selected) {
        box.unselect();
      } else {
        box.select(multiple);
      }
    } else {
      isDragging.current = false;
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
      ref={ref}
    >
      {props.children}
    </div>
  );
}

export default observer(BoxDraggable);
