import { assert, assertEquals } from "assert";
import { DateFormat, today } from "/infrastructure/time/calendar.ts";

type ChartEntry = {
  "timestamp": string;
  "credit": number;
  "investment": number;
  "pnL": number;
  "equity": number;
  "totalDividends": number;
}

export type ChartData = {
  simulation: {
    oneYearAgo: {
      chart: ChartEntry[]
    }
  }
}

export class Chart {
  constructor(private readonly raw: ChartData) {}
  
  public validate(): boolean {
    const list: ChartEntry[] = this.raw.simulation.oneYearAgo.chart;
    const length = list.length;
    const lastDate: DateFormat = list[length-1].timestamp.substring(0, 10);
    const todayDate = today();

    assert(length > 365, "Too few dates in chart");
    assert(lastDate <= todayDate, "Last date is in the future");
    return true;
  }

}
