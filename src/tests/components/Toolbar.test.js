import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Toolbar from '../../components/Toolbar';
import { MainStore } from '../../stores/MainStore';
import { UndoManager } from 'mst-middlewares';

describe('Toolbar', () => {
  let store;
  let undoManager;
  beforeEach(() => {
    jest.resetAllMocks();
    store = MainStore.create();
    undoManager = UndoManager.create({}, { targetStore: store });
  });

  it('calls addBox when the user clicks button', () => {
    store.addBox = jest.fn();
    const { getByText } = render(<Toolbar store={store} undoManager={undoManager} />);

    fireEvent.click(getByText('Add Box'));

    expect(store.addBox).toBeCalled();
  });

  it('calls addBox with correct color', () => {
    store.addBox = jest.fn();
    const { getByText, getByLabelText } = render(<Toolbar store={store} undoManager={undoManager} />);

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

    const { rerender } = render(<Toolbar store={store} undoManager={undoManager} />);

    let text = screen.getByText('No boxes selected');
    expect(text).toBeDefined();

    MainStore.selectedBoxes = [1, 2, 3];
    rerender(<Toolbar store={MainStore} undoManager={undoManager} />);

    text = screen.getByText('3 box(es) selected');
    expect(text).toBeDefined();
  });

  it('calls removeSelected when user clicks remove box button', () => {
    store.removeSelected = jest.fn();

    const { getByText } = render(<Toolbar store={store} undoManager={undoManager} />);

    fireEvent.click(getByText('Remove Box'));

    expect(store.removeSelected).toBeCalled();
  });

  it('calls changeColor when set a color with the input', () => {
    store.changeColor = jest.fn();

    const { getByLabelText } = render(<Toolbar store={store} undoManager={undoManager} />);

    fireEvent.input(getByLabelText('color-input'), { target: { value: '#0000ff' } });

    expect(store.changeColor).toBeCalledWith('#0000ff');
  });

  it('calls changeColor without undo-redo capabilities', () => {
    const startGroup = jest.spyOn(undoManager, 'startGroup');
    const endGroup = jest.spyOn(undoManager, 'stopGroup');

    const { getByLabelText } = render(<Toolbar store={store} undoManager={undoManager} />);

    fireEvent.focus(getByLabelText('color-input'));

    expect(startGroup).toBeCalled();

    fireEvent.blur(getByLabelText('color-input'));

    expect(endGroup).toBeCalled();
  });

  it('disable undo button when cant undo', () => {
    jest.spyOn(undoManager, 'canUndo', 'get').mockReturnValue(false);

    const { getByText } = render(<Toolbar store={store} undoManager={undoManager} />);

    expect(getByText('Undo')).toBeDisabled();
  });

  it('enable undo button when can undo', () => {
    jest.spyOn(undoManager, 'canUndo', 'get').mockReturnValue(true);

    const { getByText } = render(<Toolbar store={store} undoManager={undoManager} />);

    expect(getByText('Undo')).toBeEnabled();
  });

  it('calls undo when click over Undo button', () => {
    jest.spyOn(undoManager, 'canUndo', 'get').mockReturnValue(true);
    undoManager.undo = jest.fn();

    const { getByText } = render(<Toolbar store={store} undoManager={undoManager} />);

    fireEvent.click(getByText('Undo'));

    expect(undoManager.undo).toBeCalled();
  });

  it('disable redo button when cant redo', () => {
    jest.spyOn(undoManager, 'canRedo', 'get').mockReturnValue(false);

    const { getByText } = render(<Toolbar store={store} undoManager={undoManager} />);

    expect(getByText('Redo')).toBeDisabled();
  });

  it('enable redo button when can redo', () => {
    jest.spyOn(undoManager, 'canRedo', 'get').mockReturnValue(true);

    const { getByText } = render(<Toolbar store={store} undoManager={undoManager} />);

    expect(getByText('Redo')).toBeEnabled();
  });

  it('calls redo when click over Redo button', () => {
    jest.spyOn(undoManager, 'canRedo', 'get').mockReturnValue(true);
    undoManager.redo = jest.fn();

    const { getByText } = render(<Toolbar store={store} undoManager={undoManager} />);

    fireEvent.click(getByText('Redo'));

    expect(undoManager.redo).toBeCalled();
  });
});
