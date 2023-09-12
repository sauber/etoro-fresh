import { assert, assertInstanceOf, assertRejects } from "assert";
import { Repo } from "./repo.ts";
import { Investor } from "./investor.ts";

Deno.test("Investor", async (t) => {
  const repo = await Repo.tmp();
  const name = "JeppeKirkBonde";
  const investor: Investor = new Investor(repo, name);
  assertInstanceOf(investor, Investor);
  await repo.delete();
});
