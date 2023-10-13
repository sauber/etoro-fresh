import { assert, assertEquals, assertInstanceOf } from "assert";
import { FetchHeapBackend, Assets } from "./fetch-heap.ts";
import { repoBackend, investorId } from "./testdata.ts";
import { JSONObject } from "./repo.d.ts";

// Pull from repo a collective of assets
const assets: Assets = {
  // discover
  "rankings/rankings": (await repoBackend.retrieve("discover")) as JSONObject,

  // chart
  chart: (await repoBackend.retrieve(
    investorId.UserName + ".chart"
  )) as JSONObject,

  // portfolio
  portfolio: (await repoBackend.retrieve(
    investorId.UserName + ".portfolio"
  )) as JSONObject,

  // stats
  "rankings/cid": (await repoBackend.retrieve(
    investorId.UserName + ".stats"
  )) as JSONObject,
};

Deno.test("Initialization", () => {
  const f: FetchHeapBackend = new FetchHeapBackend(assets);
  assertInstanceOf(f, FetchHeapBackend);
});

Deno.test("Fetching", { ignore: false }, async (t) => {
  const f: FetchHeapBackend = new FetchHeapBackend(assets);

  await t.step("discover", async () => {
    const data = await f.get("rankings/rankings");
    assertEquals(data.Status, 'OK');
  });

  await t.step("chart", async () => {
    const data = await f.get("chart");
    assertInstanceOf(data.simulation, Object);
  });

  await t.step("portfolio", async () => {
    const data = await f.get("portfolio");
    assertInstanceOf(data.AggregatedPositions, Object);
  });

  await t.step("stats", async () => {
    const data = await f.get("rankings/cid");
    assertInstanceOf(data.Data, Object);
  });
});
