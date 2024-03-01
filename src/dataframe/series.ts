/** Series of similar types */
export interface SeriesInterface<T> {
  /** List of all values */
  values: Array<T>;

  /** First value */
  first: T;

  /** First value */
  last: T;

  /** Random value */
  any: T;
}

export type SeriesTypes = number | string | boolean | object | undefined;
export type SeriesClasses =
  | Series
  | TextSeries
  | BoolSeries
  | ObjectSeries<object>;

abstract class DataSeries<T> implements SeriesInterface<T> {
  constructor(public readonly values: Array<T> = []) {}

  public get length(): number {
    return this.values.length;
  }

  public get first(): T {
    return this.values[0];
  }

  public get last(): T {
    return this.values[this.values.length - 1];
  }

  public get any(): T {
    const index: number = Math.floor(this.values.length * Math.random());
    return this.values[index];
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

  /** Sort alphabetically */
  public get sort(): TextSeries {
    return new TextSeries(this.values.sort(Intl.Collator().compare));
  }
}

/** Series of booleans */
export class BoolSeries extends DataSeries<boolean>
  implements SeriesInterface<boolean> {
  constructor(values?: Array<boolean>) {
    super(values);
  }
}

/** Series of objects */
export class ObjectSeries<T> extends DataSeries<T>
  implements SeriesInterface<T> {
  constructor(values?: Array<T>) {
    super(values);
  }
}

/** Series of numbers */
export class Series extends DataSeries<number | undefined>
  implements SeriesInterface<number | undefined> {
  constructor(values?: Array<number | undefined>) {
    super(values);
  }

  /** Modify each valid number in series */
  private derive(callback: (n: number) => number): Series {
    return new Series(
      this.values.map((n) => (n !== undefined ? callback(n) : undefined)),
    );
  }

  /** Generate new Series: n => n*n */
  public get pow2(): Series {
    return this.derive((n) => n * n);
  }

  /** Generate new Series: n => log(n) */
  public get log(): Series {
    return this.derive((n) => Math.log(n));
  }

  /** Generate new Series: n => n + b */
  public add(operand: number): Series {
    return this.derive((n) => n + operand);
  }

  /** Generate new Series: n => c*n */
  public scale(factor: number): Series {
    return this.derive((n) => n * factor);
  }

  /** Generate new Series: sum(n) = 1 */
  public get distribute(): Series {
    return this.scale(1 / this.sum);
  }

  /** Number of decimals in float */
  public digits(unit: number): Series {
    return this.derive((n) => parseFloat(n.toFixed(unit)));
  }

  /** Convert to absolute numbers */
  public get abs(): Series {
    return this.derive((n) => Math.abs(n));
  }

  /** Multiply each items in this series with item at other series: n[i] = x[i] * y[i] */
  public dot(other: Series): Series {
    const values = [];
    for (let i = 0; i < this.values.length; i++) {
      const [x, y] = [this.values[i], other.values[i]];
      values.push(x !== undefined && y !== undefined ? x * y : undefined);
    }
    return new Series(values);
  }

  /** Calculate sum of numbers in series */
  public get sum(): number {
    return this.values.reduce(
      (sum: number, a) => sum + (a !== undefined ? a : 0),
      0,
    );
  }

  /** Calculate Pearson Correlation Coefficient to other series */
  public correlation(other: Series): number {
    const n: number = this.values.length;
    const x: number = this.sum;
    const y: number = other.sum;
    const x2: number = this.pow2.sum;
    const y2: number = other.pow2.sum;
    const xy: number = this.dot(other).sum;
    const r: number = (n * xy - x * y) /
      Math.sqrt((n * x2 - x * x) * (n * y2 - y * y));
    return r;
  }
}
