import { Table } from "./table.ts";
import { BoolSeries, Series, TextSeries } from "./series.ts";
import type { SeriesClasses, SeriesTypes } from "./series.ts";

type Column = Series | TextSeries | BoolSeries;
type Columns = Array<Column>;
type RowRecord = Record<string, SeriesTypes>;
type RowValues = Array<SeriesTypes>;

/** A collection of series with same length */
export class DataFrame {
  private readonly columns: Record<string, Column> = {};
  public readonly names: string[];

  constructor(series: Columns = []) {
    // Convert array of columns to dict of columns
    series.forEach((column: Column) => this.columns[column.name] = column);

    // Cache column names
    this.names = series.map((column: Column) => column.name);
  }

  /** Import data from list of records */
  public static fromRecords(records: Array<Record<string, unknown>>): DataFrame {
    const series: Record<string, RowValues> = {};

    // Confirm supported type and map RowRecords of dict to named columns
    records.forEach((record, index) => {
      Object.entries(record).forEach(([key, value]) => {
        switch (typeof value) {
          case "number":
          case "string":
          case "boolean":
            if (!(key in series)) {
              series[key] = Array<SeriesTypes>(records.length);
            }
            series[key][index] = value;
        }
      });
    });

    // Map type columns to Series Object
    return new DataFrame(
      Object.entries(series).map(([key, array]) => {
        switch (typeof array[0]) {
          case "string":
            return new TextSeries(array as string[], key);
          case "number":
            return new Series(array as number[], key);
          case "boolean":
            return new BoolSeries(array as boolean[], key);
        }
      }),
    );
  }

  /** Sequence of all indices in series */
  private get indices(): number[] {
    return Array.from(Array(this.length).keys());
  }

  /** Values and columns names from all series at index */
  private record(index: number): RowRecord {
    return Object.assign(
      {},
      ...this.names.map((x) => ({ [x]: this.columns[x].values[index] })),
    );
  }

  /** Export data to list of records */
  public get records(): Array<RowRecord> {
    return this.indices.map((i: number) => this.record(i));
  }

  /** Values from all series at index */
  private line(index: number): RowValues {
    return this.names.map((x) => this.columns[x].values[index]);
  }

  /** Export data to matrix */
  public get grid(): Array<RowValues> {
    return this.indices.map((i: number) => this.line(i));
  }

  /** A new dataframe with subset of columns */
  public include(names: string[]): DataFrame {
    return new DataFrame(names.map((n) => this.series(n)));
  }

  /** A new dataframe except named columns */
  public exclude(names: string[]): DataFrame {
    const keep: string[] = this.names.filter((n) => !names.includes(n));
    return this.include(keep);
  }

  //** First column */
  public get first(): Column {
    return this.series(this.names[0]);
  }

  /** Lookup a particular column */
  public series(key: string): Column {
    return this.columns[key];
  }

  /** Count of items in columns */
  public get length(): number {
    return this.first.length;
  }

  /** Count of columns */
  public get width(): number {
    return this.names.length;
  }

  /** Correlation of each series to each series on other dataframe */
  public correlationMatrix(other: DataFrame): DataFrame {
    const RowRecords = this.names;
    const cols = other.names;
    const series: SeriesClasses[] = [
      new TextSeries(RowRecords, "Keys"),
    ];
    for (const colname of cols) {
      const results: number[] = [];
      for (const RowRecordname of RowRecords) {
        const sc = other.series(colname) as Series;
        const sr = this.series(RowRecordname) as Series;
        const coef: number = sr.correlation(sc);
        results.push(coef);
      }
      series.push(new Series(results, colname));
    }

    return new DataFrame(series);
  }

  /** Disable count of significant digits */
  public digits(units: number, names: string[] = this.names): DataFrame {
    return new DataFrame(
      Object.entries(this.columns).map(([key, column]) =>
        (names.includes(key) && column.isNumber)
          ? (column as Series).digits(units)
          : column
      ),
    );
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
