import { assertEquals, assertInstanceOf } from "assert";
import { Chart } from "./chart.ts";
import { chartData } from "./testdata.ts";

Deno.test("Initialization", () => {
  const chart = new Chart({ simulation: { oneYearAgo: { chart: [] } } });
  assertInstanceOf(chart, Chart);
});

Deno.test("Validate", () => {
  const chart: Chart = new Chart(chartData);
  assertEquals(chart.validate(), true);
});

/*
Deno.test("Series", () => {
  const chart: Chart = new Chart(chartData);
  const series: DateSeries<number> = chart.series();
  assertEquals(series.end(), "2023-10-11");
});
*/