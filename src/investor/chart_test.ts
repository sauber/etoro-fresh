import {
  assertEquals,
  assertInstanceOf,
  assertNotEquals,
} from "$std/assert/mod.ts";
import { Chart } from "./chart.ts";
import { chartData } from "./testdata.ts";
import { ChartSeries } from "./chart-series.ts";

Deno.test("Initialization", () => {
  const chart = new Chart({ simulation: { oneYearAgo: { chart: [] } } });
  assertInstanceOf(chart, Chart);
});

Deno.test("Validate", () => {
  const chart: Chart = new Chart(chartData);
  assertEquals(chart.validate(), true);
});

Deno.test("Series", () => {
  const chart: Chart = new Chart(chartData);
  const series: ChartSeries = chart.series();
  assertEquals(series.first(), 10000);
  assertNotEquals(series.last(), 10000);
  assertEquals(series.start(), "2022-10-01");
  assertEquals(series.end(), "2023-10-13");
});
