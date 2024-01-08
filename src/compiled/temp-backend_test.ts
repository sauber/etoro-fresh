import { TempBackend } from "./temp-backend.ts";
import { Backend, InvestorObject } from "./backend.ts";
import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { investorData } from "./testdata.ts";

Deno.test("Initialization", () => {
  const repo: Backend = new TempBackend();
  assertInstanceOf(repo, TempBackend);
});

Deno.test("Create and delete Repo", async () => {
  const repo: Backend = new TempBackend();
  const names = await repo.names();
  assertEquals(names.length, 0);

  await repo.delete();
});

Deno.test("Store and Retrieve", async () => {
  const repo: Backend = new TempBackend();

  const result = await repo.store(investorData);
  assertEquals(result, undefined);
  const names = await repo.names();
  assertEquals(names.length, 1);
  assertEquals(names.values, [investorData.UserName]);

  const investor: InvestorObject = await repo.retrieve(investorData.UserName);
  assertEquals(investor, investorData);

  await repo.delete();
});
