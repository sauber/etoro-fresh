import { DateFormat } from "/utils/time/mod.ts";
import { Investor } from "/investor/mod.ts";
import type { StatsExport } from "📚/repository/mod.ts";
import { Chart } from "📚/chart/mod.ts";

export type Input = StatsExport;

export type Output = {
  SharpeRatio: number;
  Profit: number;
};

export class Features {
  constructor(private readonly investor: Investor) {}

  /** Prediction input parameters */
  public get input(): Input {
    return this.investor.stats.first;
  }

  /** Prediction output parameters */
  public get output(): Output {
    const start: DateFormat = this.investor.stats.start;
    const chart: Chart = this.investor.chart.from(start);
    const apy: number = chart.apy;
    // 5% is annual money market return. TODO: Load from config
    const sr: number = chart.sharpeRatio(0.05);
    const features: Output = {
      Profit: apy,
      SharpeRatio: sr,
    };
    return features;
  }
}
