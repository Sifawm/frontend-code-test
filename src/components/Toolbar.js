import { observer } from 'mobx-react';
import React from 'react';
import { useRef } from 'react';
import uuid from 'uuid/v4';
import BoxModel from '../stores/models/Box';

function Toolbar(props) {
  const { selectedBoxes } = props.store;

  const inputColor = useRef(null);

  const addBox = () => {
    const box = BoxModel.create({
      id: uuid(),
      color: inputColor.current.value,
      left: 0,
      top: 0,
    });

    props.store.addBox(box);
  };

  return (
    <div className="toolbar">
      <button onClick={addBox}>Add Box</button>
      <button>Remove Box</button>
      <input ref={inputColor} type="color" aria-label="color-input" />
      <span>{selectedBoxes.length === 0 ? 'No boxes selected' : `${selectedBoxes.length} box(es) selected`}</span>
    </div>
  );
}

export default observer(Toolbar);
