import { RepoDiskBackend } from "/repository/repo-disk.ts";
import { FetchWebBackend } from "./fetch-web.ts";
import { Refresh } from "./refresh.ts";
import { Config } from "/repository/config.ts";
import { Repo } from "/repository/repo.ts";
import type { InvestorId } from "/investor/mod.ts";
import type { DiscoverFilter } from "./mod.ts";

const path: string = Deno.args[0];
const backend: RepoDiskBackend = new RepoDiskBackend(path);
const repo: Repo = new Repo(backend);

const config: Config = repo.config;
const id = await config.get('investor') as InvestorId;
const filter = await config.get('discover') as DiscoverFilter;
const rate = await config.get('rate') as number;

const fetcher: FetchWebBackend = new FetchWebBackend(rate);
const refresh: Refresh = new Refresh(backend, fetcher, id, filter);
const count: number = await refresh.run();
console.log(`Assets downloaded: ${count}`);
