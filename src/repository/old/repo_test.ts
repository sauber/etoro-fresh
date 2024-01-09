import { assertInstanceOf } from "$std/assert/mod.ts";
import { RepoHeapBackend } from "../old/repo-heap.ts";
import { Repo } from "../old/repo.ts";
import { Config } from "../../config/config.ts";

Deno.test("Initialization", () => {
  const backend = new RepoHeapBackend();
  const repo = new Repo(backend);
  assertInstanceOf(repo, Repo);
});

Deno.test("Config", () => {
  const backend = new RepoHeapBackend();
  const repo = new Repo(backend);
  const config = repo.config;
  assertInstanceOf(config, Config);
});
