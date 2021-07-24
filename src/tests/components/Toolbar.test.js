import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Toolbar from '../../components/Toolbar';
import { MainStore } from '../../stores/MainStore';

describe('Toolbar', () => {
  let store;
  beforeEach(() => {
    jest.resetAllMocks();
    store = MainStore.create();
  });

  it('calls addBox when the user clicks button', () => {
    store.addBox = jest.fn();
    const { getByText } = render(<Toolbar store={store} />);

    fireEvent.click(getByText('Add Box'));

    expect(store.addBox).toBeCalled();
  });

  it('calls addBox with correct color', () => {
    store.addBox = jest.fn();
    const { getByText, getByLabelText } = render(<Toolbar store={store} />);

    const colorInput = getByLabelText('color-input');

    fireEvent.input(colorInput, { target: { value: '#00ff00' } });
    fireEvent.click(getByText('Add Box'));

    expect(store.addBox).toBeCalledWith(expect.objectContaining({ color: '#00ff00' }));

    fireEvent.input(colorInput, { target: { value: '#0000ff' } });
    fireEvent.click(getByText('Add Box'));

    expect(store.addBox).toBeCalledWith(expect.objectContaining({ color: '#0000ff' }));
  });

  it('show amount of selected boxes', () => {
    jest.spyOn(store, 'selectedBoxes', 'get').mockReturnValue([]);

    const { rerender } = render(<Toolbar store={store} />);

    let text = screen.getByText('No boxes selected');
    expect(text).toBeDefined();

    MainStore.selectedBoxes = [1, 2, 3];
    rerender(<Toolbar store={MainStore} />);

    text = screen.getByText('3 box(es) selected');
    expect(text).toBeDefined();
  });

  it('calls removeSelected when user clicks remove box button', () => {
    store.removeSelected = jest.fn();

    const { getByText } = render(<Toolbar store={store} />);

    fireEvent.click(getByText('Remove Box'));

    expect(store.removeSelected).toBeCalled();
  });
});
