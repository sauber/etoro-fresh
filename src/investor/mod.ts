export * from "./community.ts";
export * from "./chart.ts";
export * from "./portfolio.ts";
export * from "./stats.ts";
import { ChartSeries } from "./chart-series.ts";
import type { StatsExport } from "./stats.ts";

export type InvestorId = {
  CustomerId: number;
  UserName: string;
}

export type InvestorExport = {
  chart: ChartSeries;
  mirrors: InvestorId[];
  stats: StatsExport;
}
