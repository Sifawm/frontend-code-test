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
});
