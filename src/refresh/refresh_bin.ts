import { RepoDiskBackend } from "/repository/repo-disk.ts";
import { FetchRateLimitingBackend } from "./fetch-ratelimit.ts";
import { Refresh } from "./refresh.ts";
import { Config } from "/repository/config.ts";
import { Repo } from "/repository/repo.ts";

const path: string = Deno.args[0];
const backend: RepoDiskBackend = new RepoDiskBackend(path);
const repo: Repo = new Repo(backend);
const config: Config = repo.config;
const fetcher: FetchRateLimitingBackend = new FetchRateLimitingBackend(config);
const refresh: Refresh = new Refresh(backend, fetcher, config);
const count: number = await refresh.run();
console.log(`Assets downloaded: ${count}`);
