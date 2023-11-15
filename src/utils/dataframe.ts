import { Table } from "./table.ts";
import { BoolSeries, Series, TextSeries } from "./series.ts";
import type { SeriesTypes } from "./series.ts";

type Column = Series | TextSeries | BoolSeries;
type Columns = Record<string, Column>;
type RowRecord = Record<string, SeriesTypes>;
type RowRecords = Array<RowRecord>;
type RowValues = Array<SeriesTypes>;
type Index = number[];
type ColumnNames = string[];
type SortElement = [number, SeriesTypes];

/** A collection of series with same length */
export class DataFrame {
  public readonly names: ColumnNames;
  private readonly index: Index;

  constructor(
    // Data Series
    private readonly columns: Columns = {},
    // Ordering of rows
    index?: Index,
  ) {
    // Names of columns
    this.names = Object.keys(columns);

    // Index
    if (index) {
      this.index = index;
    } else {
      if (this.names.length) {
        const first = columns[this.names[0]];
        const length = first.length;
        this.index = Array.from(Array(length).keys());
      } else {
        this.index = [];
      }
    }
  }

  /** Import data from list of records */
  public static fromRecords(records: RowRecords): DataFrame {
    return new DataFrame(
      Object.assign(
        {},
        ...Object.keys(records[0]).map((key: string) => {
          const array = records.map((r: Record<string, unknown>) => r[key]);
          switch (typeof array[0]) {
            case "number":
              return { [key]: new Series(array as number[], key) };
            case "string":
              return { [key]: new TextSeries(array as string[], key) };
            case "boolean":
              return { [key]: new BoolSeries(array as boolean[], key) };
          }
        }),
      ),
    );
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

  /** A new dataframe with subset of columns */
  public include(names: ColumnNames): DataFrame {
    return new DataFrame(
      Object.assign({}, ...names.map((x) => ({ [x]: this.column(x) }))),
    );
  }

  /** A new dataframe except named columns */
  public exclude(names: ColumnNames): DataFrame {
    const keep: ColumnNames = this.names.filter((n) => !names.includes(n));
    return this.include(keep);
  }

  /** Lookup a particular column */
  public column(key: string): Column {
    return this.columns[key];
  }

  /** Correlation of each series to each series on other dataframe */
  public correlationMatrix(other: DataFrame): DataFrame {
    const RowRecords = this.names;
    const cols = other.names;
    const columns: Columns = {
      Keys: new TextSeries(RowRecords, "Keys"),
    };
    for (const colname of cols) {
      const results: number[] = [];
      for (const RowRecordname of RowRecords) {
        const sc = other.column(colname) as Series;
        const sr = this.column(RowRecordname) as Series;
        const coef: number = sr.correlation(sc);
        results.push(coef);
      }
      //series.push(new Series(results, colname));
      columns[colname] = new Series(results, colname);
    }

    return new DataFrame(columns);
  }

  /** Display count of significant digits */
  public digits(units: number, names: ColumnNames = this.names): DataFrame {
    const columns: Columns = {};
    names.forEach((key) => {
      const column: Column = this.column(key);
      columns[key] = column.isNumber
        ? (column as Series).digits(units)
        : column;
    });
    return new DataFrame(columns, this.index);
  }

  /** Pretty print as ascii table */
  public print(title?: string): void {
    const table = new Table();
    if (title) table.title = title;
    table.headers = this.names;
    table.rows = this.grid;
    console.log("\n" + table.toString());
  }

  /** Sort rows by columns */
  public sort(colname: string): DataFrame {
    // TODO: only rearrange incides
    const index: Index = this.index;
    const value: SeriesTypes[] = this.column(colname).values;
    const zip: Array<SortElement> = index.map((i: number) => [i, value[i]]);
    const sorted: Array<SortElement> = zip.sort((
      a,
      b,
    ) => (a[1] < b[1] ? -1 : 1));
    const order: Index = sorted.map((a: SortElement) => a[0]);
    return new DataFrame(this.columns, order);
  }
}
