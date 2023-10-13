import { Repo } from "./repo.ts";
import { Refresh } from "./refresh.ts";

const path = Deno.args[0];
const repo = new Repo(path);
const username = await repo.config.get("UserName") as string;
const cid = await repo.config.get("CustomerId") as number;

const refresh: Refresh = new Refresh(repo, username, cid);
const count: number = await refresh.run();
console.log(`Fetch data for ${count} investors`);
