import { assertInstanceOf } from "assert";
import { RepoHeapBackend } from "./repo-heap.ts";
import { Repo } from "./repo.ts";
import { Config } from "./config.ts";

Deno.test("Initialization", () => {
  const backend = new RepoHeapBackend();
  const repo  = new Repo(backend);
  assertInstanceOf(repo, Repo);
});

Deno.test("Config", () => {
  const backend = new RepoHeapBackend();
  const repo  = new Repo(backend);
  const config = repo.config;
  assertInstanceOf(config, Config);
});
