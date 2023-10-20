import { assertInstanceOf, assertStringIncludes } from "assert";
import { FetchURL } from "./fetch-url.ts";
import { discoverOptions } from "./testdata.ts";
import { investorId } from "/investor/testdata.ts";

Deno.test("Initialization", () => {
  const f: FetchURL = new FetchURL();
  assertInstanceOf(f, FetchURL);
});

Deno.test("discover", () => {
  const f: FetchURL = new FetchURL();
  const url = f.discover(discoverOptions);
  assertStringIncludes(url, "maxmonthlyriskscoremax=" + discoverOptions.risk);
  assertStringIncludes(url, "dailyddmin=-" + discoverOptions.daily);
  assertStringIncludes(url, "weeklyddmin=-" + discoverOptions.weekly);
});

Deno.test("chart", () => {
  const f: FetchURL = new FetchURL();
  const url = f.chart(investorId);
  assertStringIncludes(url, "/CopySim/Username/" + investorId.UserName);
});

Deno.test("portfolio", () => {
  const f: FetchURL = new FetchURL();
  const url = f.portfolio(investorId);
  assertStringIncludes(url, "portfolios?cid=" + investorId.CustomerId);
});

Deno.test("stats", () => {
  const f: FetchURL = new FetchURL();
  const url = f.stats(investorId);
  assertStringIncludes(url, "/rankings/cid/" + investorId.CustomerId);
});
