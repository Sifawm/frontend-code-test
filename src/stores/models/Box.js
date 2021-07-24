import { getParent, hasParent, types } from 'mobx-state-tree';
import { undoManager } from '../UndoManager';

const BoxModel = types
  .model('Box', {
    id: types.identifier,
    width: 200,
    height: 100,
    color: '#FFF000',
    left: 200,
    top: 100,
    selected: false,
  })
  .views(self => ({}))
  .actions(self => ({
    select(multiple = false) {
      undoManager.withoutUndo(() => {
        if (!multiple && hasParent(self, 2)) {
          getParent(self, 2).unselectAll();
        }

        self.selected = true;
      });
    },

    unselect() {
      undoManager.withoutUndo(() => {
        self.selected = false;
      });
    },

    setColor(color) {
      self.color = color;
    },
  }));

export default BoxModel;
