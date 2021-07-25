import React from 'react';
import BoxModel from '../../stores/models/Box';
import BoxDraggable from '../../components/BoxDraggable';
import { fireEvent, render } from '@testing-library/react';

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
});
