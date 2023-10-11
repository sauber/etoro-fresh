import { assertEquals, assertInstanceOf } from "assert";
import { FetchRepo } from "./repo-fetch.ts";
import { config } from "./testdata.ts";

const delay = await config.get('fetch_delay') as number;
const discoverOptions = {
  risk: await config.get('discover_risk') as number,
  daily: await config.get('discover_daily') as number,
  weekly: await config.get('discover_weekly') as number,
};

const investorOptions = {
  username: await config.get('UserName') as string,
  cid: await config.get('CustomerId') as number,
};

Deno.test("investorOptions", () => {
  const repo = new FetchRepo(delay);
  assertEquals(investorOptions, { username: "GainersQtr", cid: 4657429});
});


Deno.test("Initialization", () => {
  const repo = new FetchRepo(delay);
  assertInstanceOf(repo, FetchRepo);
});

Deno.test("Fetching", async (t) => {
  const repo = new FetchRepo(delay);
  

  
  await t.step("discover", async () => {
    const data = await repo.last('discover', discoverOptions);
    assertInstanceOf(data, Object);
    assertEquals(data.Status, 'OK');
  });
  
  await t.step("stats", async () => {
    const data = await repo.last('stats', investorOptions);
    assertInstanceOf(data, Object);
    assertEquals(data.Status, 'OK');
  });
});
