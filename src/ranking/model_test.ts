import { assertInstanceOf, assertEquals } from "assert";
import { Model } from "./model.ts";
import { RepoHeapBackend } from "/repository/repo-heap.ts";

Deno.test("Initialize", () => {
  const repo: RepoHeapBackend = new RepoHeapBackend();
  const model = new Model(repo);
  assertInstanceOf(model, Model);
});