import { assertEquals, assertInstanceOf } from "assert";
import { repoBackend } from "/repository/testdata.ts";
import { investorId } from "/investor/testdata.ts";
import { Ranking } from "./ranking.ts";
import type { Input, Output } from "./model.ts";


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
  const out = await rank.rank(investorId.UserName );
  console.log(out);
  //assertEquals(input.length, out.length);
});
