import { DiskRepo } from "./repo-disk.ts";
import { Config } from "./config.ts";
export const config = new Config(new DiskRepo("infrastructure/repo/testdata"));
