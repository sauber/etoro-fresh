import type { DateFormat } from "/utils/time/mod.ts";
import { today, formatDate } from "/utils/time/mod.ts";
import { ChartSeries } from "./chart-series.ts";

type ChartEntry = {
  timestamp: string;
  credit: number;
  investment: number;
  pnL: number;
  equity: number;
  totalDividends: number;
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
    if (this.raw.simulation.oneYearAgo)
      return this.raw.simulation.oneYearAgo.chart;
    else {
      return [];
    }
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
    if (this.count <= 365) {
      console.warn(`Warning: Too few dates in chart: ${this.count}`);
      return false;
    }
    if (this.end > todayDate) {
      console.warn(`Warning: Last date is in the future: ${this.end}`);
      return false;
    }
    return true;
  }

  /** All values as a DateSeries */
  public series(): ChartSeries {
    const entries: ChartEntry[] = this.list;
    const timestamp: string = entries[0].timestamp;
    const firstDate: DateFormat = formatDate(new Date(timestamp).getTime());
    const values = entries.map((entry) => entry.equity);
    return new ChartSeries(values, firstDate);
  }
}
