import { getParent, hasParent, types } from 'mobx-state-tree';

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
      if (!multiple && hasParent(self, 2)) {
        getParent(self, 2).unselectAll();
      }

      self.selected = true;
    },

    unselect() {
      self.selected = false;
    },
  }));

export default BoxModel;
