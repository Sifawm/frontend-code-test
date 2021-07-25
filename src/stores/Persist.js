import { reaction } from 'mobx';

export const persist = (condition, save, debounceTime) => {
  let timerId;

  reaction(condition, data => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      localStorage.setItem('store', save());
    }, debounceTime);
  });
};
