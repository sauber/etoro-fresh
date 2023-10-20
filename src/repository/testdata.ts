import { Config, RepoDiskBackend } from "/repository/mod.ts";
export const repoPath = "src/repository/testdata"
export const repoBackend = new RepoDiskBackend(repoPath);
export const config = new Config(repoBackend);

