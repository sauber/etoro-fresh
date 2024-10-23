import { assertInstanceOf, assertNotEquals } from "@std/assert";
import { Community } from "📚/repository/mod.ts";
import { Investor } from "📚/investor/mod.ts";
import { DateFormat, diffDate } from "📚/time/mod.ts";
import { Ranking } from "📚/ranking/ranking.ts";
import { repo } from "📚/ranking/testdata.ts";
import { Model } from "📚/ranking/model.ts";
import { TrainingData } from "📚/ranking/trainingdata.ts";
import type { Inputs } from "📚/ranking/mod.ts";

type Investors = Array<Investor>;

const community = new Community(repo);
const all: Investors = await community.all();
const test: Investors = all.filter(
  (investor: Investor) =>
    diffDate(investor.stats.start, investor.chart.end) < 30,
);

const data = new TrainingData(community, 30);
await data.load();
const xs: Inputs = data.inputs;
const model = Model.generate(xs[0].length);

Deno.test("Initialize", () => {
  const rank = new Ranking(model);
  assertInstanceOf(rank, Ranking);
});

Deno.test("Predict recent", () => {
  const rank = new Ranking(model);
  const out: number = rank.predict(test[0]);
  assertNotEquals(out, 0);
});

Deno.test("Predict at date", async () => {
  const rank = new Ranking(model);
  const last: Investors = await community.latest();
  const end = await community.end() as DateFormat;
  const out = await rank.predict(last[0], end);
  assertNotEquals(out, 0);
});
