import * as mobxStateTree from 'mobx-state-tree';
import BoxModel from '../../../stores/models/Box';

describe('BoxModel', () => {
  let box;

  beforeEach(() => {
    box = BoxModel.create({ id: 'box-bowser' });
  });

  it('should create box with default values', () => {
    expect(box).toEqual({
      id: 'box-bowser',
      width: 200,
      height: 100,
      color: '#FFF000',
      left: 200,
      top: 100,
      selected: false,
    });
  });

  describe('select', () => {
    const parentStore = { unselectAll: jest.fn() };

    beforeEach(() => {
      jest.spyOn(mobxStateTree, 'hasParent').mockReturnValue(true);
      jest.spyOn(mobxStateTree, 'getParent').mockReturnValue(parentStore);
    });

    it('should select current box without unselect all', () => {
      box.select(true);

      expect(box.selected).toBeTruthy();
      expect(parentStore.unselectAll).not.toBeCalled();
    });

    it('should select current box and unselect rest boxes', () => {
      box.select();

      expect(box.selected).toBeTruthy();
      expect(parentStore.unselectAll).toBeCalled();
    });
  });
});
