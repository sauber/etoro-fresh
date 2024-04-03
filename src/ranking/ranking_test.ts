import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { Community } from "📚/repository/mod.ts";
import { Investor } from "📚/investor/mod.ts";
import { diffDate } from "📚/time/mod.ts";
import type { DateFormat } from "📚/time/mod.ts";
import { Ranking } from "./ranking.ts";
import { repo } from "./testdata.ts";

type Investors = Array<Investor>;

const community = new Community(repo);
const all: Investors = await community.all();
const train: Investors = all.filter(
  (investor: Investor) =>
    diffDate(investor.stats.start, investor.chart.end) >= 30,
);
const test: Investors = all.filter(
  (investor: Investor) =>
    diffDate(investor.stats.start, investor.chart.end) < 30,
);

Deno.test("Initialize", () => {
  const rank = new Ranking(repo);
  assertInstanceOf(rank, Ranking);
});

Deno.test("Train", async () => {
  const rank = new Ranking(repo);

  // Training
  const done = await rank.train(train);
  assertEquals(done, undefined);
});

Deno.test("Predict recent", async () => {
  const rank = new Ranking(repo);
  const out = await rank.predict(test);
  //out.sort("SharpeRatio").reverse.digits(3).print("Prediction");
  assertEquals(out.length, test.length);
  assertEquals(out.names.length, 3);
});

Deno.test("Predict at date", async () => {
  const rank = new Ranking(repo);
  const last: Investors = await community.latest();
  const end = await community.end() as DateFormat;
  const out = await rank.predict(last, end);
  //out.sort("SharpeRatio").reverse.digits(3).print("Prediction");
  assertEquals(out.length, last.length);
  assertEquals(out.names.length, 3);
});
