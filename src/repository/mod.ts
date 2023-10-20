export { Config } from "./config.ts";
export { Repo } from "./repo.ts";
export { RepoDiskBackend } from "./repo-disk.ts";
export { RepoBackend } from "./repo-backend.ts";
export { Asset } from "./asset.ts";

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export type JSONObject = {
  [key: string]: JSONValue;
};
