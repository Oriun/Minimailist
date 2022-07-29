import React from 'react';

const useRefArray = <T>() => {
  const ref = React.useRef<Array<T>>([]);
  const push = (index: number) => {
    return (value: T) => {
      ref.current[index] = value;
    };
  };
  push.current = ref.current;
  return push;
};

export default useRefArray;
