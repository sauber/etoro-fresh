import type { DateFormat } from "/utils/time/mod.ts";
import { repoBackend } from "/repository/testdata.ts";
import { Community, Investor, ChartSeries } from "/investor/mod.ts";
import { Position } from "./position.ts";

// Testdata based Community
export const community = new Community(repoBackend);

// Pick a random investor
const investor: Investor = await community.any();
export const username: string = investor.UserName;

// Extract chart data
export const chart: ChartSeries = await investor.chart();
const open: DateFormat = chart.start();
const expire: DateFormat = chart.end();

// Position data
const amount = 1000;
export const position = new Position({
  name: username,
  open,
  expire,
  chart,
  amount,
});
