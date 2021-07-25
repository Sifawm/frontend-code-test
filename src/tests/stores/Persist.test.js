import { types } from 'mobx-state-tree';
import { persist, persistStore } from '../../stores/Persist';
import { undoManager } from '../../stores/UndoManager';

let localStorageMock = (() => {
  let store = {};

  return {
    getItem(key) {
      return store[key];
    },

    setItem(key, value) {
      store[key] = value;
    },

    clear() {
      store = {};
    },
  };
})();

const fakeStore = types
  .model('FakeStore', {
    history: types.model({ undoIdx: types.number }),
  })
  .actions(self => {
    return {
      increment() {
        self.history.undoIdx += 1;
      },
    };
  });

describe('Persist', () => {
  let store = {};

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  beforeEach(() => {
    jest.useFakeTimers();

    undoManager.withoutUndo = jest.fn(cb => cb());
    localStorageMock.clear();

    store = fakeStore.create({ history: { undoIdx: 0 } });
  });

  it('should save current state to localstorage after timer finish', () => {
    persist(
      () => store.history.undoIdx,
      () => JSON.stringify(store),
      400
    );
    store.increment();

    jest.runOnlyPendingTimers();

    expect(JSON.parse(localStorageMock.getItem('store'))).toEqual({
      history: { undoIdx: 1 },
    });
  });

  it('should cancelled previous save if it is executed before the timer finish', () => {
    persist(
      () => store.history.undoIdx,
      () => JSON.stringify(store),
      400
    );

    store.increment();

    // Advance 300ms will not save to storage
    jest.advanceTimersByTime(300);

    let item = localStorageMock.getItem('store');
    expect(item).not.toBeDefined();

    store.increment();

    // Advance 300ms will not save to storage: Total 600ms
    jest.advanceTimersByTime(300);

    item = localStorageMock.getItem('store');
    expect(item).not.toBeDefined();

    store.increment();

    // Advance 400ms will save to storage: Total 1000ms
    jest.advanceTimersByTime(400);

    item = localStorageMock.getItem('store');
    expect(JSON.parse(item)).toEqual({ history: { undoIdx: 3 } });
  });

  it('should save state without selected boxes nor history', () => {
    store.unselectAll = jest.fn();
    persistStore(store);

    store.increment();

    jest.runOnlyPendingTimers();

    expect(store.unselectAll).toBeCalled();
    expect(JSON.parse(localStorageMock.getItem('store'))).toEqual({});
  });
});
