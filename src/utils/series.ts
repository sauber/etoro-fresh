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

export type SeriesTypes = number | string | boolean | undefined;
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
  //public readonly isNumber = true;

  constructor(values?: Array<number | undefined>) {
    super(values);
  }

  /** Generate new Series: n => n*n */
  public get pow2(): Series {
    return new Series(
      this.values.map((n) => (n !== undefined ? n * n : undefined)),
    );
  }

  /** Generate new Series: n => log(n) */
  public get log(): Series {
    return new Series(
      this.values.map((n) => (n !== undefined ? Math.log(n) : undefined)),
    );
  }

  /** Generate new Series: n => c*n */
  public scale(factor: number): Series {
    return new Series(
      this.values.map((n) => (n !== undefined ? n * factor : undefined)),
    );
  }

  /** Generate new Series: sum(n) = 1 */
  public get distribute(): Series {
    return this.scale(1 / this.sum);
  }

  /** Multiply each items in this series with item at other series: n[i] = x[i] * y[i] */
  public multiply(other: Series): Series {
    const values = [];
    for (let i = 0; i < this.values.length; i++) {
      const [x, y] = [this.values[i], other.values[i]];
      values.push(x !== undefined && y !== undefined ? x * y : undefined);
    }
    return new Series(values);
  }

  /** Number of decimals in float */
  public digits(unit: number): Series {
    return new Series(
      this.values.map((n) =>
        n !== undefined ? parseFloat(n.toFixed(unit)) : undefined
      ),
    );
  }

  /** Convert to absolute numbers */
  public get abs(): Series {
    return new Series(
      this.values.map((n) => (n !== undefined ? Math.abs(n) : undefined)),
    );
  }

  /** Calculate sum of numbers in series */
  public get sum(): number {
    // const arr = this.values;
    // let sum = 0;
    // let i = arr.length;
    // while (i--) sum += arr[i];
    // return sum;
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
    const xy: number = this.multiply(other).sum;
    const r: number = (n * xy - x * y) /
      Math.sqrt((n * x2 - x * x) * (n * y2 - y * y));
    return r;
  }
}
