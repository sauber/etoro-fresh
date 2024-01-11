export * from "./community.ts";
export * from "../scrape/chart.ts";
export * from "../scrape/portfolio.ts";
export * from "../scrape/stats.ts";
export * from "./investor.ts";
export * from "../chart/chart.ts";
import { DateFormat } from "/utils/time/mod.ts";
import type { StatsExport } from "../scrape/stats.ts";

export type InvestorId = {
  CustomerId: number;
  UserName: string;
};

export type ChartExport = [DateFormat[], number[]];

export type InvestorExport = {
  chart: ChartExport;
  mirrors: InvestorId[];
  stats: StatsExport;
};
