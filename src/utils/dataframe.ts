import { Table } from "./table.ts";
import { BoolSeries, Series, TextSeries } from "./series.ts";
import type { SeriesClasses, SeriesTypes } from "./series.ts";

type Column = Series | TextSeries | BoolSeries;
type Columns = Array<Column>;

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
  static fromRecords(records: Array<Record<string, unknown>>): DataFrame {
    const series: Record<string, Array<SeriesTypes>> = {};

    // Confirm supported type and map rows of dict to named columns
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

  /** Export data to list of records */
  get records(): Array<Record<string, SeriesTypes>> {
    const names = this.names;
    const l = this.length;
    const records: Array<Record<string, SeriesTypes>> = [];
    for (let i = 0; i < l; i++) {
      const record: Record<string, SeriesTypes> = {};
      for (const key of names) {
        record[key] = this.columns[key].values[i];
      }
      records.push(record);
    }
    return records;
  }

  /** Export data to matrix */
  get grid(): Array<Array<SeriesTypes>> {
    const names = this.names;
    const l = this.length;
    const records: Array<Array<SeriesTypes>> = [];
    for (let i = 0; i < l; i++) {
      const record: Array<SeriesTypes> = [];
      for (const key of names) {
        record.push(this.columns[key].values[i]);
      }
      records.push(record);
    }
    return records;
  }

  /** A new dataframe with subset of columns */
  include(names: string[]): DataFrame {
    return new DataFrame(names.map((n) => this.series(n)));
  }

  /** A new dataframe except named columns */
  exclude(names: string[]): DataFrame {
    const keep: string[] = this.names.filter((n) => !names.includes(n));
    return this.include(keep);
  }

  //** First column */
  get first(): Column {
    return this.series(this.names[0]);
  }

  /** Lookup a particular column */
  series(key: string): Column {
    return this.columns[key];
  }

  /** Count of items in columns */
  get length(): number {
    return this.first.length;
  }

  /** Count of columns */
  get width(): number {
    return this.names.length;
  }

  /** Correlation of each series to each series on other dataframe */
  correlationMatrix(other: DataFrame): DataFrame {
    const rows = this.names;
    const cols = other.names;
    const series: SeriesClasses[] = [
      new TextSeries(rows, "Keys"),
    ];
    for (const colname of cols) {
      const results: number[] = [];
      for (const rowname of rows) {
        const sc = other.series(colname) as Series;
        const sr = this.series(rowname) as Series;
        const coef: number = sr.correlation(sc);
        results.push(coef);
      }
      series.push(new Series(results, colname));
    }

    return new DataFrame(series);
  }

  /** Reference to object */
  get ref(): DataFrame {
    return this;
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
  print(title?: string): void {
    const tidy = this.digits(2);
    const colnames = tidy.names;
    const table = new Table();
    if (title) table.title = title;
    table.headers = colnames;
    table.rows = tidy.grid;
    console.log("\n" + table.toString());
  }
}
