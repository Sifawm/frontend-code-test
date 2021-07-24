import { observer } from 'mobx-react';
import React from 'react';
import { useRef } from 'react';
import uuid from 'uuid/v4';
import BoxModel from '../stores/models/Box';

function Toolbar(props) {
  const { selectedBoxes, removeSelected, changeColor } = props.store;
  const { canUndo, undo, canRedo, redo } = props.undoManager;

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

  const onChangeColor = event => {
    changeColor(event.target.value);
  };

  const startChangeColor = event => {
    props.undoManager.startGroup(() => {
      onChangeColor(event);
    });
  };

  const endChangeColor = event => {
    props.undoManager.stopGroup();
  };

  return (
    <div className="toolbar">
      <button onClick={addBox}>Add Box</button>
      <button onClick={removeSelected}>Remove Box</button>
      <input
        ref={inputColor}
        type="color"
        aria-label="color-input"
        onChange={onChangeColor}
        onFocus={startChangeColor}
        onBlur={endChangeColor}
      />
      <span>{selectedBoxes.length === 0 ? 'No boxes selected' : `${selectedBoxes.length} box(es) selected`}</span>
      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <button onClick={redo} disabled={!canRedo}>
        Redo
      </button>
    </div>
  );
}

export default observer(Toolbar);
