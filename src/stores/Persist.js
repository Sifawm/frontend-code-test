import { reaction } from 'mobx';
import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import { undoManager } from './UndoManager';

export const persist = (condition, save, debounceTime) => {
  let timerId;

  reaction(condition, data => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      localStorage.setItem('store', save());
    }, debounceTime);
  });
};

const getStoreWithoutHistory = ({ history, ...rest }) => rest;

export const persistStore = store =>
  persist(
    () => store.history.undoIdx,
    () => {
      const snapshot = getSnapshot(store);
      let storeData;
      undoManager.withoutUndo(() => {
        store.unselectAll();
        storeData = JSON.stringify(getStoreWithoutHistory(store));
        applySnapshot(store, snapshot);
      });

      return storeData;
    },
    300
  );
