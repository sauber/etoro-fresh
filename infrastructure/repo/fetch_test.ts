import { assertEquals, assertInstanceOf } from "assert";
import { FetchRepo } from "./fetch.ts";
import type { InvestorId } from "./repo.js";
import { config } from "./testdata.ts";

const delay = (await config.get("fetch_delay")) as number;
const discoverOptions = {
  risk: (await config.get("discover_risk")) as number,
  daily: (await config.get("discover_daily")) as number,
  weekly: (await config.get("discover_weekly")) as number,
};

// TODO: Use InvestorDate type
const investor: InvestorId = {
  UserName: (await config.get("UserName")) as string,
  CustomerId: (await config.get("CustomerId")) as number,
};

Deno.test("investor", () => {
  assertEquals(investor, { UserName: "GainersQtr", CustomerId: 4657429 });
});

Deno.test("Initialization", () => {
  const repo = new FetchRepo(delay);
  assertInstanceOf(repo, FetchRepo);
});

Deno.test("Fetching", {ignore: true}, async (t) => {
  const repo = new FetchRepo(delay);

  await t.step("discover", async () => {
    const data = await repo.discover(discoverOptions);
    assertInstanceOf(data, Object);
    assertEquals(data.Status, "OK");
  });

  // TODO: Use InvestorDate type instead of investorOptions
  await t.step("chart", async () => {
    const data = await repo.chart(investor);
    assertInstanceOf(data, Object);
    assertInstanceOf(data.Data, Object);
  });

  await t.step("portfolio", async () => {
    const data = await repo.portfolio(investor);
    assertInstanceOf(data, Object);
    assertInstanceOf(data.Data, Object);
  });

  await t.step("stats", async () => {
    const data = await repo.stats(investor);
    assertInstanceOf(data, Object);
    assertInstanceOf(data.Data, Object);
  });
});
