import { assertInstanceOf, assert } from "assert";
import { Repo } from "./repo.ts";
import { Portfolio, PortfolioData } from "./portfolio.ts";
import { username, cid } from "./testdata.ts";

Deno.test("Portfolio", async (t) => {
  const repo = await Repo.tmp();
  const portfolio: Portfolio = new Portfolio(repo, username, cid);
  assertInstanceOf(portfolio, Portfolio);

  await t.step("recent", async () => {
    const data: PortfolioData = await portfolio.recent();
    assert(data.AggregatedPositions.length > 0);
  });

  await t.step("mirrors", async () => {
    const copyinvestor = new Portfolio(repo, "GainersQtr", 4657429);
    const inv: Investors = await copyinvestor.mirrors();
    assert(inv.length > 0);
  });

  await repo.delete();
});