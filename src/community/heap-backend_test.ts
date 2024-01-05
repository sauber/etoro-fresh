import { HeapBackend } from "📚/community/heap-backend.ts";
import { Backend, InvestorObject } from "📚/community/backend.ts";
import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";

const data: InvestorObject = {
  UserName: "foo",
  CustomerId: 1,
  start: "2024-01-05",
  end: "2024-01-05",
  chart: [100],
  stats: {
    "2024-01-05": {
      PopularInvestor: true,
      Gain: 1,
      RiskScore: 1,
      MaxDailyRiskScore: 1,
      MaxMonthlyRiskScore: 1,
      Copiers: 1,
      CopiersGain: 1,
      VirtualCopiers: 1,
      AUMTier: 1,
      AUMTierV2: 1,
      Trades: 1,
      WinRatio: 1,
      DailyDD: 1,
      WeeklyDD: 1,
      ProfitableWeeksPct: 1,
      ProfitableMonthsPct: 1,
      Velocity: 1,
      Exposure: 1,
      AvgPosSize: 1,
      HighLeveragePct: 1,
      MediumLeveragePct: 1,
      LowLeveragePct: 1,
      PeakToValley: 1,
      LongPosPct: 1,
      ActiveWeeks: 1,
      ActiveWeeksPct: 1,
      WeeksSinceRegistration: 1,
    },
  },
};

Deno.test("Initialization", () => {
  const repo: Backend = new HeapBackend();
  assertInstanceOf(repo, HeapBackend);
});

Deno.test("Create", async () => {
  const repo: Backend = new HeapBackend();
  const names = await repo.names();
  assertEquals(names.length, 0);
});

Deno.test("Store and Retrieve", async () => {
  const repo: Backend = new HeapBackend();

  const result = await repo.store(data);
  assertEquals(result, undefined);
  const names = await repo.names();
  assertEquals(names.length, 1);
  assertEquals(names.values, [data.UserName]);

  const investor: InvestorObject = await repo.retrieve(data.UserName);
  assertEquals(investor, data);
});

Deno.test("Delete", async () => {
  const repo: Backend = new HeapBackend();
  const result = await repo.delete();
  assertEquals(result, undefined);
});
