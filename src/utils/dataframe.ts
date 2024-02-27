import { Table } from "./table.ts";
import { BoolSeries, Series, TextSeries } from "./series.ts";
import type { SeriesClasses, SeriesTypes } from "./series.ts";
import { DateTimeFormatter } from "$std/datetime/_common.ts";

type Column = Series | TextSeries | BoolSeries;
type Columns = Record<string, Column>;
export type RowRecord = Record<string, SeriesTypes>;
export type RowRecords = Array<RowRecord>;
type RowValues = Array<SeriesTypes>;
type Index = number[];
type ColumnNames = string[];
type SortElement = [number, SeriesTypes];
type RowCallback = (row: RowRecord) => SeriesTypes;

/** Generate a series from an array of unknown values */
function series(array: Array<unknown>): SeriesClasses | undefined {
  switch (typeof array[0]) {
    case "number":
      return new Series(array as number[]);
    case "string":
      return new TextSeries(array as string[]);
    case "boolean":
      return new BoolSeries(array as boolean[]);
  }
}

/** A collection of series with same length */
export class DataFrame {
  private readonly index: Index;
  //public readonly length: number;

  constructor(
    // Data Series
    private readonly columns: Columns = {},
    // Ordering of rows
    index?: Index,
  ) {
    // Names of columns
    const names: ColumnNames = Object.keys(columns);

    // Index
    if (index) {
      this.index = index;
      //this.length = index.length;
    } else {
      if (names.length) {
        const first = columns[names[0]];
        //this.length = first.length;
        this.index = Array.from(Array(first.length).keys());
      } else {
        this.index = [];
        //this.length = 0;
      }
    }
  }

  /** Import data from list of records */
  public static fromRecords(records: RowRecords): DataFrame {
    return new DataFrame(
      Object.assign(
        {},
        ...Object.keys(records[0]).map((name: string) => {
          const array = records.map(
            (rec: Record<string, unknown>) => rec[name],
          );
          const ser = series(array);
          if (ser) return { [name]: ser };
        }),
      ),
    );
  }

  /** A new dataframe with subset of columns */
  public include(names: ColumnNames): DataFrame {
    return new DataFrame(
      Object.assign({}, ...names.map((x) => ({ [x]: this.column(x) }))),
      this.index,
    );
  }

  /** A new dataframe except named columns */
  public exclude(names: ColumnNames): DataFrame {
    const keep: ColumnNames = this.names.filter((n) => !names.includes(n));
    return this.include(keep);
  }

  /** Correlation of each series to each series on other dataframe */
  public correlationMatrix(other: DataFrame): DataFrame {
    const RowRecords = this.names;
    const cols = other.names;
    const columns: Columns = {
      Keys: new TextSeries(RowRecords),
    };
    for (const colname of cols) {
      const results: number[] = [];
      for (const RowRecordname of RowRecords) {
        const sc = other.column(colname) as Series;
        const sr = this.column(RowRecordname) as Series;
        const coef: number = sr.correlation(sc);
        results.push(coef);
      }
      columns[colname] = new Series(results);
    }

    return new DataFrame(columns);
  }

  /** Reduce count of significant digits */
  public digits(units: number, names: string[] = this.names): DataFrame {
    const columns: Columns = {};
    names.forEach((name) => {
      const column: Column = this.column(name);
      columns[name] = column.isNumber
        ? (column as Series).digits(units)
        : column;
    });
    return new DataFrame(columns, this.index);
  }

  /** Sort rows by columns */
  public sort(colname: string): DataFrame {
    const index: Index = this.index;
    const value: SeriesTypes[] = this.column(colname).values;
    const zip: Array<SortElement> = index.map((i: number) => [i, value[i]]);
    const sorted: Array<SortElement> = zip.sort((a, b) =>
      (a[1] || 0) < (b[1] || 0) ? -1 : 1
    );
    const order: Index = sorted.map((a: SortElement) => a[0]);
    return new DataFrame(this.columns, order);
  }

  /** Generate a new column from existing columns */
  public amend(name: string, callback: RowCallback): DataFrame {
    const array: SeriesTypes[] = this.index
      .map((index) => this.record(index))
      .map((row: RowRecord) => callback(row));
    const ser = series(array);
    if (ser) {
      return new DataFrame(Object.assign({}, this.columns, { [name]: ser }));
    } else return this;
  }

  /** Select only matching rows */
  public select(callback: RowCallback): DataFrame {
    return this.reindex(
      this.index.filter((index: number) => callback(this.record(index))),
    );
  }

  /** Rearrange rows */
  private reindex(index: Index): DataFrame {
    return new DataFrame(this.columns, index);
  }

  /** Rows in reverse order */
  public get reverse(): DataFrame {
    return this.reindex(this.index.reverse());
  }

  /** Slice each column
   * Note: Underlying series are not sliced
   */
  public slice(start: number, end: number): DataFrame {
    return this.reindex(this.index.slice(start, end));
  }

  /** Rows in random order */
  public get shuffle(): DataFrame {
    return this.reindex(this.index.sort(() => Math.random() - 0.5));
  }

  /** Combine with series from other DataFrame */
  public join(other: DataFrame): DataFrame {
    return new DataFrame(Object.assign({}, this.columns, other.columns));
  }

  /** Rename columns */
  public rename(names: Record<string, string>): DataFrame {
    const columns: Columns = {};
    Object.entries(this.columns).forEach(([from, column]) => {
      const to: string = (from in names) ? names[from] : from;
      columns[to] = column;
    });
    return new DataFrame(columns, this.index);
  }

  /** Replace existing column with new  */
  private replace(name: string, column: Column): DataFrame {
    const columns: Columns = { ...this.columns };
    columns[name] = column;
    return new DataFrame(columns, this.index);
  }

  /** Scale values in column to sum of 1 */
  public distribute(name: string): DataFrame {
    return this.replace(name, (this.column(name) as Series).distribute);
  }

  /** Scale values in column to sum of 1 */
  public log(name: string): DataFrame {
    return this.replace(name, (this.column(name) as Series).log);
  }

  /** Scale values in column to sum of 1 */
  public scale(name: string, factor: number): DataFrame {
    return this.replace(name, (this.column(name) as Series).scale(factor));
  }

  /** Values and columns names from all series at index */
  private record(index: number): RowRecord {
    return Object.assign(
      {},
      ...this.names.map((x) => ({ [x]: this.columns[x].values[index] })),
    );
  }

  /** Export data to list of records */
  public get records(): RowRecords {
    return this.index.map((i: number) => this.record(i));
  }

  /** Values from all series at index */
  private line(index: number): RowValues {
    return this.names.map((x) => this.columns[x].values[index]);
  }

  /** Export data to matrix */
  public get grid(): Array<RowValues> {
    return this.index.map((i: number) => this.line(i));
  }

  /** Names of Columns */
  public get names(): ColumnNames {
    return Object.keys(this.columns);
  }

  /** Lookup a particular column */
  public column(name: string): Column {
    return this.columns[name];
  }

  /** Count of records */
  public get length(): number {
    return this.index.length;
  }

  /** Pretty print as ascii table */
  public print(title?: string): void {
    const table = new Table();
    if (title) table.title = title;
    table.headers = this.names;
    table.rows = this.grid;
    console.log("\n" + table.toString());
  }
}
