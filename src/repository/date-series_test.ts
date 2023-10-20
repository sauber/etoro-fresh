import { assertEquals, assertInstanceOf, assert } from "assert";
import { DateSeries } from "./date-series.ts";
import { repoBackend } from "/refresh/testdata.ts";
import { DateFormat } from "/utils/time/calendar.ts";

Deno.test("Blank Initialization", () => {
  const series = new DateSeries(repoBackend, "");
  assertInstanceOf(series, DateSeries);
});

Deno.test("Dates of discovery", async () => {
  const discover = new DateSeries(repoBackend, "discover");
  const dates: DateFormat[] = await discover.dates();
  assertEquals(
    dates.length,
    7,
    "7 copies of discover.json in testdata repository",
  );
  assert(dates[0] < dates[dates.length-1], "dates are sorted");
});
