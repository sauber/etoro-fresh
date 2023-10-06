import { sprintf } from "printf";
import { assert, assertEquals } from "assert";
import { Downloadable } from "./asset.ts";
import { Repo } from "./repo.ts";
import { today } from "/utils/calendar.ts";

interface ChartEntry {
  "timestamp": string;
  "credit": number;
  "investment": number;
  "pnL": number;
  "equity": number;
  "totalDividends": number;
}

export interface ChartData {
  simulation: {
    oneYearAgo: {
      chart: ChartEntry[]
    }
  }
}

export class Chart extends Downloadable<ChartData> {
  protected readonly filename: string;
  static readonly urlTemplate =
    "https://www.etoro.com/sapi/trade-data-real/chart/public/%s/oneYearAgo/1?client_request_id=%s";
  protected readonly expire = 1440; // Max age in miutes

  constructor(
    protected readonly repo: Repo,
    private readonly username: string,
    private readonly _cis: number
  ) {
    super(repo);
    this.filename = `${username}.chart.json`;
    }

  protected async url(): Promise<string> {
    return sprintf(Chart.urlTemplate, this.username, await this.uuid());
  }

  protected validate(data: ChartData): boolean {
    const list = data.simulation.oneYearAgo.chart;
    const length = list.length;
    const lastDate = list[length-1].timestamp.substring(0, 10);
    const todayDate = today();

    assertEquals(lastDate, todayDate, `Last date ${lastDate} in ${this.username} chart is not today`);
    assert(length > 365, "Too few dates in chart");
    return true;
  }

}
