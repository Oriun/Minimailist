import React from 'react';

const useSet = <T>(defaultValue?: Iterable<T>) => {
  const [set, setSet] = React.useState<Set<T>>(new Set(defaultValue));

  const add = (item: T) => {
    setSet(new Set(set.add(item)));
  };

  const remove = (item: T) => {
    setSet((tmp) => {
      tmp.delete(item);
      return new Set(tmp);
    });
  };

  const toggle = (item: T) => {
    setSet((tmp) => {
      if (tmp.has(item)) {
        tmp.delete(item);
      } else {
        tmp.add(item);
      }
      return new Set(tmp);
    });
  };

  const has = (item: T) => {
    return set.has(item);
  };

  const clear = () => {
    setSet(new Set());
  };

  return {
    set,
    add,
    remove,
    has,
    clear,
    toggle,
  };
};

export default useSet;
