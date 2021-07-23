import { types } from 'mobx-state-tree';
import BoxModel from './models/Box';

export const MainStore = types
  .model('MainStore', {
    boxes: types.array(BoxModel),
  })
  .actions(self => {
    return {
      addBox(box) {
        self.boxes.push(box);
      },

      unselectAll() {
        for (const box of self.selectedBoxes) {
          box.unselect();
        }
      },
    };
  })
  .views(self => ({
    get selectedBoxes() {
      return self.boxes.filter(box => box.selected);
    },
  }));

const store = MainStore.create();

export default store;
