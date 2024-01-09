export { Journal } from "📚/repository/journal.ts";
export { Asset } from "📚/repository/asset.ts";
export { Backend } from "📚/repository/backend.ts";
export { DiskBackend } from "📚/repository/disk-backend.ts";
export { TempBackend } from "📚/repository/temp-backend.ts";
export { HeapBackend } from "📚/repository/heap-backend.ts";


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

export type AssetName = string;
export type AssetNames = Array<AssetName>;
