import { assert } from "assert";
import { DateFormat, DateSeries, today } from "/utils/time/mod.ts";
import { ChartSeries } from "./chart-series.ts";

type ChartEntry = {
  "timestamp": string;
  "credit": number;
  "investment": number;
  "pnL": number;
  "equity": number;
  "totalDividends": number;
};

export type ChartData = {
  simulation: {
    oneYearAgo: {
      chart: ChartEntry[];
    };
  };
};


export class Chart {
  constructor(private readonly raw: ChartData) {}

  private get list(): ChartEntry[] {
    return this.raw.simulation.oneYearAgo.chart;
  }

  // Last date in chart
  public get end(): DateFormat {
    const list: ChartEntry[] = this.list;
    const length = list.length;
    const lastDate: DateFormat = list[length - 1].timestamp.substring(0, 10);
    return lastDate;
  }

  public get count(): number {
    return this.list.length;
  }

  public validate(): boolean {
    const todayDate = today();
    assert(this.count > 365, "Too few dates in chart");
    assert(this.end <= todayDate, "Last date is in the future");
    return true;
  }

  /** All values as a DateSeries */
  public series(): ChartSeries {
    const entries: ChartEntry[] = this.list();
    return new ChartSeries([], "2022-22-22");
  }
}
