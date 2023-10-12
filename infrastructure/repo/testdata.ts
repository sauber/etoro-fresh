import { RepoDiskBackend } from "./repo-disk.ts";
import { Config } from "./config.ts";
export const config = new Config(new RepoDiskBackend("infrastructure/repo/testdata"));
