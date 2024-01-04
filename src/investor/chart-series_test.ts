import {
  assertEquals,
  assertInstanceOf,
  assertThrows,
} from "$std/assert/mod.ts";
import { ChartSeries } from "./chart-series.ts";
import type { DateFormat } from "/utils/time/mod.ts";
import { nextDate } from "/utils/time/mod.ts";

Deno.test("Blank Initialization", () => {
  const chart = new ChartSeries([], "2022-10-10");
  assertInstanceOf(chart, ChartSeries);
});

Deno.test("Single value", () => {
  const value = 10000;
  const start: DateFormat = "2023-10-30";
  const chart = new ChartSeries([value], start);
  assertEquals(chart.first(), value);
  assertEquals(chart.last(), value);
  assertEquals(chart.start(), start);
  assertEquals(chart.end(), start);
  assertEquals(chart.dates(), [start]);
  assertEquals(chart.value(start), value);
});

Deno.test("Series of values", () => {
  const values = [30, 31, 1, 2];
  const dates: DateFormat[] = [
    "2023-10-30",
    "2023-10-31",
    "2023-11-01",
    "2023-11-02",
  ];
  const chart = new ChartSeries(values, dates[0]);
  assertEquals(chart.first(), values[0]);
  assertEquals(chart.last(), values[values.length - 1]);
  assertEquals(chart.start(), dates[0]);
  assertEquals(chart.end(), dates[dates.length - 1]);
  assertEquals(chart.dates(), dates);

  for (let i = 0; i < values.length; i++)
    assertEquals(chart.value(dates[i]), values[i]);
});

Deno.test("Invalid range", () => {
  const values = [30, 31, 1, 2];
  const dates: DateFormat[] = [
    "2023-10-30",
    "2023-10-31",
    "2023-11-01",
    "2023-11-02",
  ];
  const chart = new ChartSeries(values, dates[0]);

  // Before range
  assertThrows(
    () => chart.value(nextDate(dates[0], -1)),
    Error,
    "Date not in range: 2023-10-30 < 2023-10-29 < 2023-11-02"
  );

  // After range
  assertThrows(
    () => chart.value(nextDate(dates[dates.length - 1], 1)),
    Error,
    "Date not in range: 2023-10-30 < 2023-11-03 < 2023-11-02"
  );
});

Deno.test("Combine series", () => {
  const sooner = new ChartSeries([10, 20], "2023-10-31");
  const later = new ChartSeries([10, 20], "2023-11-01");
  const combined = later.combine(sooner);
  assertEquals(combined.values.length, 3);
  //console.log(combined);
});

Deno.test("Combine non-overlapping series", () => {
  const sooner = new ChartSeries([10, 20], "2023-10-31");
  const later = new ChartSeries([10, 20], "2023-11-31");

  // Ranges do not overlap
  assertThrows(
    () => later.combine(sooner),
    Error,
    "Chart Series do not overlap: 2023-10-31:2023-11-01 < 2023-11-31:2023-12-02"
  );
});

Deno.test("Range from date", () => {
  const start = "2023-10-31";
  const cut = "2023-11-01";
  const end = "2023-11-02";
  const chart = new ChartSeries([10, 20, 30], start);
  const from = chart.from(cut);
  assertEquals(from.first(), 20);
  assertEquals(from.last(), 30);
  assertEquals(from.start(), cut);
  assertEquals(from.end(), end);
});

Deno.test("Range until date", () => {
  const date = "2023-10-31";
  const chart = new ChartSeries([10, 20], date);
  const until = chart.until(date);
  assertEquals(until.start(), until.end());
  assertEquals(until.end(), date);
});

Deno.test("Gain", () => {
  const date = "2023-10-31";
  const chart = new ChartSeries([10, 20], date);
  const gain = chart.gain(date, nextDate(date));
  assertEquals(gain, 1);
});
