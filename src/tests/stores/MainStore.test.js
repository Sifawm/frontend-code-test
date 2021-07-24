import { applySnapshot } from 'mobx-state-tree';

import MainStore from '../../stores/MainStore';
import BoxModel from '../../stores/models/Box';

describe('MainStore', () => {
  beforeEach(() => {
    applySnapshot(MainStore, {});
  });

  it('should add a box', () => {
    expect(MainStore.boxes.length).toEqual(0);

    const box = BoxModel.create({ id: 'first' });
    MainStore.addBox(box);

    expect(MainStore.boxes.length).toEqual(1);
    expect(MainStore.boxes[0].id).toEqual('first');
  });

  describe('with boxes', () => {
    beforeEach(() => {
      Array(3)
        .fill(0)
        .forEach((_, i, arr) => {
          const box = BoxModel.create({
            id: `box-${i}`,
            selected: i !== arr.length - 1,
          });

          box.setColor = jest.fn();
          box.unselect = jest.fn();
          box.move = jest.fn();

          MainStore.addBox(box);
        });
    });

    it('should unselect all boxes', () => {
      MainStore.unselectAll();

      expect(MainStore.boxes[2].unselect).not.toBeCalled();
      MainStore.boxes.filter(box => box.selected).forEach(box => expect(box.unselect).toBeCalled());
    });

    it('should return all selected boxes', () => {
      expect(MainStore.selectedBoxes.length).toEqual(2);
      MainStore.selectedBoxes.forEach(box => expect(box.selected).toBeTruthy());
    });

    it('should remove selected boxes', () => {
      expect(MainStore.boxes.length).toEqual(3);

      MainStore.removeSelected();

      expect(MainStore.boxes.length).toEqual(1);
      expect(MainStore.boxes[0].id).toEqual('box-2');
    });
  });
});
