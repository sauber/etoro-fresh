import { DateFormat } from "../time/mod.ts";
import { Investor } from "/investor/mod.ts";
import type { StatsExport } from "📚/repository/mod.ts";
import { Chart } from "📚/chart/mod.ts";
import { input_labels } from "📚/ranking/mod.ts";
import type { Input, Output } from "📚/ranking/mod.ts";

export class Features {
  constructor(private readonly investor: Investor) {}

  /** Prediction input parameters */
  public input(date?: DateFormat): Input {
    const v: StatsExport = date
      ? this.investor.stats.before(date)
      : this.investor.stats.first;

    // Pluck data from stats and convert to number
    return input_labels.map((key: keyof StatsExport) =>
      Number(v[key])
    ) as Input;
  }

  /** Prediction output parameters */
  public output(start: DateFormat = this.investor.stats.start): Output {
    const chart: Chart = this.investor.chart.from(start);
    // 5% is annual money market return.
    // TODO: Load from config
    const sr: number = chart.sharpeRatio(0.0);
    if (!Number.isFinite(sr)) {
      console.log({ chart, start, sr });
      throw new Error("Invalid SharpeRatio");
    }
    return [sr];
  }
}
