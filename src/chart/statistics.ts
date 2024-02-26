type Numbers = Array<number>;

/** Add all numbers together */
export function sum(values: Numbers): number {
  return values.reduce((total: number, a: number) => total + a, 0);
}

/** Average of numbers */
export function avg(values: Numbers): number {
  return sum(values) / values.length;
}

/** Add a constant value to each number */
export function add(values: Numbers, offset: number): Numbers {
  return values.map((x) => x + offset);
}

/** Raise each value to power */
export function pow(values: Numbers, exponent: number): Numbers {
  return values.map((x) => Math.pow(x, exponent));
}

/** number * number */
export function squared(values: Numbers): Numbers {
  return values.map((x) => x * x);
}

/** Standard Deviation */
export function std(values: Numbers): number {
  const mean: number = avg(values);
  const variances: Numbers = add(values, -mean);
  const sq: Numbers = squared(variances);
  const total: number = sum(sq);
  const result: number = Math.sqrt(total / (values.length - 1));
  return result;
}
