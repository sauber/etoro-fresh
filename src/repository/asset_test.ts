import { assertEquals, assertInstanceOf, assert } from "$std/assert/mod.ts";
import { Asset } from "./asset.ts";
import { repoBackend } from "./testdata.ts";
import { DateFormat } from "/utils/time/mod.ts";
import { DiscoverData } from "../discover/mod.ts";

Deno.test("Blank Initialization", () => {
  const series = new Asset(repoBackend, "");
  assertInstanceOf(series, Asset);
});

Deno.test("Properties of discovery asset", async (t) => {
  const discover = new Asset<DiscoverData>(repoBackend, "discover");

  await t.step("All dates", async () => {
    const dates: DateFormat[] = await discover.dates();
    assertEquals(
      dates.length,
      6,
      "6 copies of discover.json in testdata repository"
    );
    assert(dates[0] < dates[dates.length - 1], "dates are sorted");
  });

  await t.step("Start date", async () => {
    const date: DateFormat = await discover.start();
    assertEquals(date, "2021-12-29");
  });

  await t.step("End date", async () => {
    const date: DateFormat = await discover.end();
    assertEquals(date, "2022-04-25");
  });

  await t.step("First Value", async () => {
    const data: DiscoverData = await discover.first();
    assertEquals(data.TotalRows, 127);
  });

  await t.step("Last Value", async () => {
    const data: DiscoverData = await discover.last();
    assertEquals(data.TotalRows, 97);
  });

  await t.step("Value on date", async () => {
    const data: DiscoverData = await discover.value("2022-03-01");
    assertEquals(data.TotalRows, 23);
  });
});
