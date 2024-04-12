import { Value, add, mul, sub } from './engine.ts';

export function toValues(arr: number[]): Value[] {
  return arr.map((x) => new Value(x));
}

export const getLoss = (ygt: Value[], ypred: Value[]) => {
  let result = new Value(0);
  for (let i = 0; i < ygt.length; i++) {
    result = add(result, mul(sub(ygt[i], ypred[i]), sub(ygt[i], ypred[i])));
  }
  return result;
};