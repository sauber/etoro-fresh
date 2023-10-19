import { assertInstanceOf } from "assert";
import { Investor } from "./investor.ts";
import { investorId } from "/refresh/testdata.ts";
import { DateSeries } from "/repository/date-series.ts";
import { repoBackend } from "/refresh/testdata.ts";

const charts = new DateSeries(repoBackend, "chart");
const portfolios = new DateSeries(repoBackend, "portfolio");
const stats = new DateSeries(repoBackend, "stats");

Deno.test("Blank Initialization", () => {
  const investor: Investor = new Investor(charts, portfolios, stats);
  assertInstanceOf(investor, Investor);
});
