import { assert, assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { Portfolio } from "./portfolio.ts";
import { portfolioData } from "./testdata.ts";
import { InvestorId } from "./mod.ts";

Deno.test("Initialization", () => {
  const portfolio = new Portfolio({
    CreditByRealizedEquity: 0,
    CreditByUnrealizedEquity: 0,
    AggregatedMirrors: [],
    AggregatedPositions: [],
    AggregatedPositionsByInstrumentTypeID: [],
    AggregatedPositionsByStockIndustryID: [],
  });
  assertInstanceOf(portfolio, Portfolio);
});

Deno.test("Portfolio", async (t) => {
  const portfolio: Portfolio = new Portfolio(portfolioData);

  await t.step("validate", () => {
    assertEquals(portfolio.validate(), true);
  });

  await t.step("mirrors", () => {
    const inv: InvestorId[] = portfolio.investors();
    assert(inv.length > 0);
  });
});
