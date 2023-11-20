/** Series of similar types */
export interface SeriesInterface<T> {
  /** List of all values */
  values: Array<T>;

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
  ) {
    this.length = values.length;
  }

  public get first(): T {
    return this.values[0];
  }

  public get last(): T {
    return this.values[this.values.length - 1];
  }

  public get isNumber(): boolean {
    return typeof this.first === "number";
  }
}

/** Series of strings */
export class TextSeries extends DataSeries<string>
  implements SeriesInterface<string> {
  constructor(values?: Array<string>) {
    super(values);
  }
}

/** Series of booleans */
export class BoolSeries extends DataSeries<boolean>
  implements SeriesInterface<boolean> {
  constructor(values?: Array<boolean>) {
    super(values);
  }
}

/** Series of numbers */
export class Series extends DataSeries<number>
  implements SeriesInterface<number> {
  //public readonly isNumber = true;

  constructor(values?: Array<number>) {
    super(values);
  }

  /** Generate new Series: n => n*n */
  public get pow2(): Series {
    return new Series(this.values.map((n) => n * n));
  }

  /** Multiply each items in this series with item at other series: n[i] = x[i] * y[i] */
  public multiply(other: Series): Series {
    const values = [];
    for (let i = 0; i < this.values.length; i++) {
      values.push(this.values[i] * other.values[i]);
    }
    return new Series(values);
  }

  /** Number of significant decimals in float */
  public digits(unit: number): Series {
    return new Series(this.values.map((n) => +n.toPrecision(unit)));
  }

  /** Convert to absolute numbers */
  public get abs(): Series {
    return new Series(this.values.map((n) => Math.abs(n)));
  }

  /** Calculate sum of numbers in series */
  public get sum(): number {
    const arr = this.values;
    let sum = 0;
    let i = arr.length;
    while (i--) sum += arr[i];
    return sum;
  }

  /** Calculate Pearson Correlation Coefficient to other series */
  public correlation(other: Series): number {
    const n: number = this.values.length;
    const x: number = this.sum;
    const y: number = other.sum;
    const x2: number = this.pow2.sum;
    const y2: number = other.pow2.sum;
    const xy: number = this.multiply(other).sum;
    const r: number = (n * xy - x * y) / Math.sqrt((n * x2 - x * x) * (n * y2 - y * y));
    return r;
  }
}
