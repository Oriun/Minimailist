export type Throttle<T, S> = (...args: T[]) => Promise<S>;
export type Resolve<S> = (value: S | PromiseLike<S>) => void;

export const createThrottle = <T, S>(
  callback: (args: T[][], promises: Resolve<S>[]) => void,
  delay: number
): Throttle<T, S> => {
  const ArgumentStack: T[][] = [];
  const PromiseStack: Resolve<S>[] = [];
  let promise: Promise<void> | null = null;
  return function throttle(...args: T[]) {
    return new Promise((resolve) => {
      ArgumentStack.push(args);
      PromiseStack.push(resolve);
      if (!promise) {
        // eslint-disable-next-line promise/param-names
        promise = new Promise((resolve2) => {
          setTimeout(() => {
            callback(
              ArgumentStack.splice(0, ArgumentStack.length),
              PromiseStack.splice(0, PromiseStack.length)
            );
            promise = null;
            resolve2();
          }, delay);
        });
        return promise;
      }
      return promise;
    });
  };
};
