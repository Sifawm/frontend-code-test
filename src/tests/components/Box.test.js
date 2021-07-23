import React from 'react';
import BoxModel from '../../stores/models/Box';
import BoxDraggable from '../../components/BoxDraggable';
import { fireEvent, render } from '@testing-library/react';

describe('Box', () => {
  let box;

  beforeEach(() => {
    jest.resetAllMocks();
    box = BoxModel.create({ id: 'box-bowser' });
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

    const { getByText } = render(
      <BoxDraggable id="box-bowser" selected={true} box={box}>
        box
      </BoxDraggable>
    );

    fireEvent.click(getByText('box'));
    expect(box.unselect).not.toBeCalled();

    fireEvent.click(getByText('box'), { ctrlKey: true });
    expect(box.unselect).toBeCalled();
  });
});
