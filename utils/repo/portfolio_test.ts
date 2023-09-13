import { assertInstanceOf, assert } from "assert";
import { Repo } from "./repo.ts";
import { Portfolio, PortfolioData } from "./portfolio.ts";
import { username, cid } from "./testdata.ts";
import { Investors } from "./investors.ts";

Deno.test("Portfolio", async (t) => {
  const repo = await Repo.tmp();
  const portfolio: Portfolio = new Portfolio(repo, username, cid);
  assertInstanceOf(portfolio, Portfolio);

  await t.step("recent", async () => {
    const data: PortfolioData = await portfolio.recent();
    assert(data.AggregatedMirrors.length > 0);
  });

  await t.step("mirrors", async () => {
    const inv: Investors = await portfolio.mirrors();
    assert(inv.length > 0);
  });

  await repo.delete();
});