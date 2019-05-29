export function isNullOrUndef(o: any): o is undefined | null {
  // eslint-disable-next-line no-undefined
  return o === undefined || o === null;
}
