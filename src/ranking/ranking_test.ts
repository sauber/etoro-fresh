import { assertEquals, assertInstanceOf } from "assert";
import { repoBackend } from "/repository/testdata.ts";
import { investorId } from "/investor/testdata.ts";
import { Ranking } from "./ranking.ts";
import { TextSeries } from "/utils/series.ts";

Deno.test("Initialize", () => {
  const rank = new Ranking(repoBackend);
  assertInstanceOf(rank, Ranking);
});

Deno.test("Train", { ignore: false }, async () => {
  const rank = new Ranking(repoBackend);

  // Training
  const done = await rank.train();
  assertEquals(done, undefined);
});

Deno.test("Validate", { ignore: false }, async () => {
  const rank = new Ranking(repoBackend);

  // Validate
  const names = new TextSeries([investorId.UserName]);
  //console.log(names);
  const out = await rank.predict(names);
  out.print('Prediction');
  assertEquals(out.length, 1);
  assertEquals(out.names.length, 3);
});
