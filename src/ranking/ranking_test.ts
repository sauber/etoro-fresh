import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { repo } from "./testdata.ts";
import { Ranking } from "./ranking.ts";
import { Community } from "📚/repository/mod.ts";
import { Investor } from "📚/investor/mod.ts";
import { diffDate } from "📚/utils/time/mod.ts";

type Investors = Array<Investor>;

const community = new Community(repo);
const all: Investors = await community.all();
const train: Investors = all.filter(
  (investor: Investor) =>
    diffDate(investor.stats.start, investor.chart.end) >= 30
);
const test: Investors = all.filter(
  (investor: Investor) =>
    diffDate(investor.stats.start, investor.chart.end) < 30
);

Deno.test("Initialize", () => {
  const rank = new Ranking(repo);
  assertInstanceOf(rank, Ranking);
});

Deno.test("Train", { ignore: false }, async () => {
  const rank = new Ranking(repo);

  // Training
  const done = await rank.train(train);
  assertEquals(done, undefined);
});

Deno.test("Predict", { ignore: false }, async () => {
  const rank = new Ranking(repo);

  const out = await rank.predict(test);
  out.print("Prediction");
  assertEquals(out.length, test.length);
  assertEquals(out.names.length, 3);
});
