import { RepoDiskBackend } from "/repository/repo-disk.ts";
import { FetchRateLimitingBackend } from "./fetch-ratelimit.ts";
import { Refresh } from "./refresh.ts";
import { Config } from "/repository/config.ts";
import { Repo } from "/repository/repo.ts";

const path = Deno.args[0];
const backend = new RepoDiskBackend(path);
const repo = new Repo(backend);
const config: Config = repo.config;
const fetcher: FetchRateLimitingBackend = new FetchRateLimitingBackend(config);
const refresh = new Refresh(backend, fetcher);
const count: number = await refresh.run();
console.log(`Assets downloaded: ${count}`);
