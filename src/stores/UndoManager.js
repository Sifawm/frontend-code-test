export let undoManager = {};

export const setUndoManager = targetStore => {
  undoManager = targetStore.history;
};
