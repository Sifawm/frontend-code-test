import React from 'react';
import BoxModel from '../../stores/models/Box';
import BoxDraggable from '../../components/BoxDraggable';
import { fireEvent, render } from '@testing-library/react';
import interact from 'interactjs';
import '../../stores/UndoManager';
import { undoManager } from '../../stores/UndoManager';

jest.mock('../../stores/UndoManager', () => {
  return {
    undoManager: {
      startGroup: jest.fn(cb => cb()),
      stopGroup: jest.fn(),
    },
  };
});

describe('BoxDraggable', () => {
  let box;

  beforeEach(() => {
    jest.resetAllMocks();
    box = BoxModel.create({ id: 'box-bowser', width: 200, height: 200, left: 0, top: 0 });
  });

  it('calls select box when click over it', () => {
    box.select = jest.fn();

    const { getByText } = render(
      <BoxDraggable id="box-bowser" box={box}>
        box
      </BoxDraggable>
    );

    fireEvent.click(getByText('box'));

    expect(box.select).toBeCalledWith(false);
  });

  it('calls select multi when click over it with ctrl key pressed', () => {
    box.select = jest.fn();

    const { getByText } = render(
      <BoxDraggable id="box-bowser" box={box}>
        box
      </BoxDraggable>
    );

    fireEvent.click(getByText('box'), { ctrlKey: true });

    expect(box.select).toBeCalledWith(true);
  });

  it('calls unselect when click over it with ctrl key pressed', () => {
    box.unselect = jest.fn();
    box.select = jest.fn();

    const { container } = render(
      <BoxDraggable id="box-bowser" selected={true} box={box}>
        box
      </BoxDraggable>
    );

    fireEvent.click(container.querySelector('#box-bowser'));
    expect(box.unselect).not.toBeCalled();

    fireEvent.click(container.querySelector('#box-bowser'), { ctrlKey: true });
    expect(box.unselect).toBeCalled();
  });

  it('calls move when user drag box', async () => {
    box.move = jest.fn();

    const { container } = render(
      <BoxDraggable id="box-bowser" selected={true} box={box}>
        box
      </BoxDraggable>
    );

    const boxElement = container.querySelector('#box-bowser');

    interact(boxElement).fire({
      type: 'dragstart',
      target: boxElement,
      pageX: 0,
      pageY: 0,
      clientX: 0,
      clientY: 0,
    });

    expect(undoManager.startGroup).toBeCalled();

    interact(boxElement).fire({
      type: 'dragmove',
      target: boxElement,
      pageX: 0,
      pageY: 0,
      clientX: 0,
      clientY: 0,
      dx: 400,
      dy: 200,
    });

    expect(box.move).toBeCalledWith(400, 200);

    interact(boxElement).fire({
      type: 'dragend',
      target: boxElement,
      pageX: 0,
      pageY: 0,
      clientX: 0,
      clientY: 0,
      dx: 400,
      dy: 200,
    });

    expect(undoManager.stopGroup).toBeCalled();
  });
});
