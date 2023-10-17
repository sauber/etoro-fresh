import { assertInstanceOf, assert, assertEquals } from "assert";
import { Portfolio, PortfolioData } from "./portfolio.ts";
import { repoBackend, investorId } from "/repository/testdata.ts";
import { InvestorId } from "./investor.d.ts";

Deno.test("Initialization", () => {
  const portfolio = new Portfolio({
    CreditByRealizedEquity: 0,
    CreditByUnrealizedEquity: 0,
    AggregatedMirrors: [],
    AggregatedPositions: [],
    AggregatedPositionsByInstrumentTypeID: [],
    AggregatedPositionsByStockIndustryID: []
  });
  assertInstanceOf(portfolio, Portfolio);
});

Deno.test("Portfolio", async (t) => {
  const data = await repoBackend.retrieve(investorId.UserName + '.portfolio') as unknown as PortfolioData;
  const portfolio: Portfolio = new Portfolio(data);

  await t.step("validate", () => {
    assertEquals(portfolio.validate(), true);
  });

  await  t.step("mirrors", () => {
    const inv: InvestorId[] = portfolio.investors();
    assert(inv.length > 0);
  });
});
