import { assertEquals, assertInstanceOf } from "assert";
import { FetchRepo } from "./repo-fetch.ts";
import { config } from "./testdata.ts";

const delay = await config.get('fetch_delay') as number;
const options = {
  risk: await config.get('discover_risk') as number,
  daily: await config.get('discover_daily') as number,
  weekly: await config.get('discover_weekly') as number,
};

Deno.test("Initialization", () => {
  const repo = new FetchRepo(delay);
  assertInstanceOf(repo, FetchRepo);
});

Deno.test("Fetching", async (t) => {
  const repo = new FetchRepo(delay);
  
  await t.step("discover", async () => {
    const data = await repo.last('discover', options);
    assertInstanceOf(data, Object);
    assertEquals(data.Status, 'OK');
  });
});
