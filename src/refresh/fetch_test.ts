import { assertEquals, assertInstanceOf } from "assert";
import { FetchHeapBackend } from "./fetch-heap.ts";
import { Fetch } from "./fetch.ts";
import { testAssets, discoverOptions } from "./testdata.ts";
import { investorId } from "/investor/testdata.ts";

const repo = new FetchHeapBackend(testAssets);

Deno.test("Initialization", () => {
  const f: Fetch = new Fetch(repo);
  assertInstanceOf(f, Fetch);
});

Deno.test("Fetching", { ignore: false }, async (t) => {
  const f: Fetch = new Fetch(repo);

  await t.step("discover", async () => {
    const data = await f.discover(discoverOptions);
    assertEquals(data.Status, 'OK');
  });

  await t.step("chart", async () => {
    const data = await f.chart(investorId);
    assertInstanceOf(data.simulation, Object);
  });

  await t.step("portfolio", async () => {
    const data = await f.portfolio(investorId);
    assertInstanceOf(data.AggregatedPositions, Object);
  });

  await t.step("stats", async () => {
    const data = await f.stats(investorId);
    assertInstanceOf(data.Data, Object);
  });
});
