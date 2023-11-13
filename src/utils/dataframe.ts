import { BoolSeries, Series, TextSeries } from "./series.ts";
import type { SeriesTypes } from "./series.ts";

type Column = Series | TextSeries | BoolSeries;
type Columns = Array<Column>;

/** A collection of series with same length */
export class DataFrame {
  private readonly columns: Record<string, Column> = {};

  constructor(series: Columns = []) {
    // Convert array to dict
    series.forEach((column: Column) => this.columns[column.name] = column);
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

  /** Lookup a particular column */
  series(key: string): Column {
    return this.columns[key];
  }

  /** List of all column names */
  get names(): string[] {
    return Object.keys(this.columns);
  }

  /** Count of items in columns */
  get length(): number {
    return Object.values(this.columns)[0].values.length;
  }
}
