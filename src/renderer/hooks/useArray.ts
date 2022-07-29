import React from 'react';
import dp from 'fast-deep-equal-ts';

const useArray = <T>(defaultValue: Iterable<T> = []) => {
  const [array, setArray] = React.useState<Array<T>>(Array.from(defaultValue));

  const push = (...item: T[]) => {
    setArray((arr) => [...arr, ...item]);
  };

  const remove = (item: T) => {
    setArray((arr) => arr.filter((i) => !dp(i, item)));
  };
  const filter = (...items: T[]) => {
    setArray((arr) => arr.filter((i) => !items.some((j) => dp(i, j))));
  };

  const once = (item: T) => {
    setArray((arr) => {
      const at = arr.findIndex((i) => dp(i, item));
      if (at === -1) {
        return arr;
      }
      return [...arr, item];
    });
  };

  const includes = (item: T) => {
    return array.findIndex((i) => dp(i, item)) !== -1;
  };

  const clear = () => {
    setArray([]);
  };

  return [
    array,
    {
      setArray,
      push,
      remove,
      includes,
      clear,
      once,
      filter,
    },
  ];
};

export default useArray;
