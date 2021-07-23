import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Toolbar from '../components/Toolbar';
import MainStore from '../stores/MainStore';
import store from '../stores/MainStore';

jest.mock('../stores/MainStore');

describe('Toolbar', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls addBox when the user clicks button', () => {
    const { getByText } = render(<Toolbar store={MainStore} />);

    fireEvent.click(getByText('Add Box'));

    expect(store.addBox).toBeCalled();
  });

  it('calls addBox with correct color', () => {
    const { getByText, getByLabelText } = render(<Toolbar store={MainStore} />);

    const colorInput = getByLabelText('color-input');

    fireEvent.input(colorInput, { target: { value: '#00ff00' } });
    fireEvent.click(getByText('Add Box'));

    expect(store.addBox).toBeCalledWith(expect.objectContaining({ color: '#00ff00' }));

    fireEvent.input(colorInput, { target: { value: '#0000ff' } });
    fireEvent.click(getByText('Add Box'));

    expect(store.addBox).toBeCalledWith(expect.objectContaining({ color: '#0000ff' }));
  });
});
