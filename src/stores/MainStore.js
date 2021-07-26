import { applySnapshot, getSnapshot, types } from 'mobx-state-tree';
import { UndoManager } from 'mst-middlewares';
import BoxModel from './models/Box';
import { persist, persistStore } from './Persist';
import { setUndoManager, undoManager } from './UndoManager';

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

      moveAll(x, y, ignoredId) {
        const boxes = self.selectedBoxes.filter(box => box.id !== ignoredId);
        for (const box of boxes) {
          box.move(x, y, false);
        }
      },
    };
  })
  .views(self => ({
    get selectedBoxes() {
      return self.boxes.filter(box => box.selected);
    },
  }));

const store = MainStore.create(JSON.parse(localStorage.getItem('store') ?? '{}'));

persistStore(store);

export default store;
