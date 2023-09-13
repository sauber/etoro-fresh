import { assertInstanceOf } from "assert";
import { Repo } from "./repo.ts";
import { Investor } from "./investor.ts";
import { username, cis } from "./testdata.ts";

Deno.test("Investor", async () => {
  const repo = await Repo.tmp();
  const investor: Investor = new Investor(repo, username, cis);
  assertInstanceOf(investor, Investor);
  await repo.delete();
});
