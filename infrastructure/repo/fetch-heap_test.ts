import { assertEquals, assertInstanceOf } from "assert";
import { FetchHeapBackend } from "./fetch-heap.ts";
import { testAssets } from "./testdata.ts";

Deno.test("Initialization", () => {
  const f: FetchHeapBackend = new FetchHeapBackend(testAssets);
  assertInstanceOf(f, FetchHeapBackend);
});

Deno.test("Fetching", { ignore: false }, async (t) => {
  const f: FetchHeapBackend = new FetchHeapBackend(testAssets);

  await t.step("discover", async () => {
    const data = await f.get("rankings/rankings");
    assertEquals(data.Status, 'OK');
  });

  await t.step("chart", async () => {
    const data = await f.get("CopySim");
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
