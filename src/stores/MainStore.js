import { types } from 'mobx-state-tree';
import { UndoManager } from 'mst-middlewares';
import BoxModel from './models/Box';
import { setUndoManager } from './UndoManager';

export const MainStore = types
  .model('MainStore', {
    boxes: types.array(BoxModel),
    history: types.optional(UndoManager, {}),
  })
  .actions(self => {
    setUndoManager(self);

    return {
      addBox(box) {
        self.boxes.push(box);
      },

      unselectAll() {
        for (const box of self.selectedBoxes) {
          box.unselect();
        }
      },

      removeSelected() {
        self.boxes = self.boxes.filter(box => !box.selected);
      },

      changeColor(color) {
        for (const box of self.selectedBoxes) {
          box.setColor(color);
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
