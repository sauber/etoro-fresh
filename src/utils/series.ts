/** Series of similar types */
export interface SeriesInterface<T> {
  /** List of all values */
  values: Array<T>;

  /** Name of series */
  name?: string;

  /** First value */
  first: T;

  /** First value */
  last: T;
}

export type SeriesTypes = number | string | boolean;
export type SeriesClasses = Series | TextSeries | BoolSeries;

abstract class DataSeries<T> implements SeriesInterface<T> {
  public readonly length;

  constructor(
    public readonly values: Array<T> = [],
    public readonly name: string = "",
  ) {
    this.length = values.length;
  }

  get first(): T {
    return this.values[0];
  }

  get last(): T {
    return this.values[this.values.length - 1];
  }

  get isNumber(): boolean {
    return typeof this.first === "number";
  }
}

/** Series of strings */
export class TextSeries extends DataSeries<string>
  implements SeriesInterface<string> {
  constructor(values?: Array<string>, name?: string) {
    super(values, name);
  }
}

/** Series of booleans */
export class BoolSeries extends DataSeries<boolean>
  implements SeriesInterface<boolean> {
  constructor(values?: Array<boolean>, name?: string) {
    super(values, name);
  }
}

/** Series of numbers */
export class Series extends DataSeries<number>
  implements SeriesInterface<number> {
    //public readonly isNumber = true;

    constructor(values?: Array<number>, name?: string) {
    super(values, name);
  }

  /** Generate new Series: n => n*n */
  get pow2(): Series {
    return new Series(this.values.map((n) => n * n), `${this.name}^2`);
  }

  /** Multiply each items in this series with item at other series: n[i] = x[i] * y[i] */
  multiply(other: Series): Series {
    const values = [];
    for (let i = 0; i < this.values.length; i++) {
      values.push(this.values[i] * other.values[i]);
    }
    return new Series(values, `${this.name} * ${other.name}`);
  }

  /** Calculate sum of numbers in series */
  get sum(): number {
    const arr = this.values;
    let sum = 0;
    let i = arr.length;
    while (i--) sum += arr[i];
    return sum;
  }

  /** Calculate Pearson Correlation Coefficient to other series */
  correlation(other: Series): number {
    const n = this.values.length;
    const x = this.sum;
    const y = other.sum;
    const x2 = this.pow2.sum;
    const y2 = other.pow2.sum;
    const xy = this.multiply(other).sum;
    const r = (n * xy - x * y) / Math.sqrt((n * x2 - x * x) * (n * y2 - y * y));
    return r;
  }

  /** Number of decimals in float */
  decimals(unit: number): Series {
    return new Series(this.values.map((n) => +n.toPrecision(unit)), this.name);
  }
}
