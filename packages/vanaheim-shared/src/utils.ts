export function isNullOrUndef(o: any): o is undefined | null {
  // eslint-disable-next-line no-undefined
  return o === undefined || o === null;
}

export function tryFunction<T = string>(func: () => T, defaultResult?: T) {
  try {
    return func();
  } catch (_error) {
    return defaultResult;
  }
}
