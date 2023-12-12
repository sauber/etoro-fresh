export * from "./community.ts";
export * from "./chart.ts";
export * from "./portfolio.ts";
export * from "./stats.ts";
export * from "./investor.ts";
export * from "./chart-series.ts";
import { DateFormat } from "/utils/time/mod.ts";
import type { StatsExport } from "./stats.ts";

export type InvestorId = {
  CustomerId: number;
  UserName: string;
}

export type ChartExport = [DateFormat[], number[]];

export type InvestorExport = {
  chart: ChartExport;
  mirrors: InvestorId[];
  stats: StatsExport;
}
