import type { DateFormat } from "/utils/time/mod.ts";
import { today } from "/utils/time/mod.ts";

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

/** Convert scraped timestamps to DateFormat */
function date(timestamp: string): DateFormat {
  return timestamp.substring(0, 10);
}

/** Scraped chart data from eToro */
export class Chart {
  constructor(private readonly raw: ChartData) {}

  private get list(): ChartEntry[] {
    return this.raw.simulation.oneYearAgo.chart;
  }

  /** First date in chart */
  public get start(): DateFormat {
    const list: ChartEntry[] = this.list;
    return date(list[0].timestamp);
  }

  /** Last date in chart */
  public get end(): DateFormat {
    const list: ChartEntry[] = this.list;
    return date(list[list.length - 1].timestamp);
  }

  public get count(): number {
    return this.list.length;
  }

  public validate(): boolean {
    const todayDate = today();
    if (this.count <= 365) throw new Error("Too few dates in chart");
    if (this.end > todayDate) throw new Error("Last date is in the future");
    return true;
  }

  /** Equity series */
  public get values(): number[] {
    const list: ChartEntry[] = this.list;
    return list.map((entry: ChartEntry) => entry.equity);
  }
}
