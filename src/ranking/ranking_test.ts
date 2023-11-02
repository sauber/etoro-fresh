import { assertInstanceOf } from "assert";
import { community } from "./testdata.ts";
import { Ranking } from "./ranking.ts";
import { Table } from "/utils/table.ts";

Deno.test("Initialization", () => {
  const rank = new Ranking(community);
  assertInstanceOf(rank, Ranking);
});

Deno.test("Features", async (t) => {
  const rank = new Ranking(community);

  await t.step("data", async () => {
    const [input, output] = await rank.data();
    //input.print("Input");
    console.log(JSON.stringify(input));
    console.log(JSON.stringify(output));
    
  });
});
