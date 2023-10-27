import { assertEquals, assertInstanceOf } from "assert";
import { FetchWebBackend } from "./fetch-web.ts";
import { discoverOptions } from "./testdata.ts";
import { investorId } from "/investor/testdata.ts";

const rate = 5000;

Deno.test("Initialization", () => {
  const f = new FetchWebBackend(rate);
  assertInstanceOf(f, FetchWebBackend);
});

Deno.test("Fetching", { ignore: false }, async (t) => {
  const f = new FetchWebBackend(rate);

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
