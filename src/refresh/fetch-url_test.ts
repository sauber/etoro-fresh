import { assertInstanceOf, assertStringIncludes } from "assert";
import { FetchURL } from "./fetch-url.ts";
import { config, discoverOptions } from "./testdata.ts";
import { investorId } from "/investor/testdata.ts";

Deno.test("Initialization", () => {
  const f: FetchURL = new FetchURL(config);
  assertInstanceOf(f, FetchURL);
});

Deno.test("discover", async () => {
  const f: FetchURL = new FetchURL(config);
  const url = await f.discover();
  assertStringIncludes(url, "maxmonthlyriskscoremax=" + discoverOptions.risk);
  assertStringIncludes(url, "dailyddmin=-" + discoverOptions.daily);
  assertStringIncludes(url, "weeklyddmin=-" + discoverOptions.weekly);
});

Deno.test("chart", () => {
  const f: FetchURL = new FetchURL(config);
  const url = f.chart(investorId);
  assertStringIncludes(url, "/CopySim/Username/" + investorId.UserName);
});

Deno.test("portfolio", () => {
  const f: FetchURL = new FetchURL(config);
  const url = f.portfolio(investorId);
  assertStringIncludes(url, "portfolios?cid=" + investorId.CustomerId);
});

Deno.test("stats", () => {
  const f: FetchURL = new FetchURL(config);
  const url = f.stats(investorId);
  assertStringIncludes(url, "/rankings/cid/" + investorId.CustomerId);
});
