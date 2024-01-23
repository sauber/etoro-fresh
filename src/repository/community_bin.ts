/**
 * Load all investors.
 * Measure speed.
 */

import { DiskBackend } from "../storage/disk-backend.ts";
import { Community } from "./community.ts";

const path: string = Deno.args[0];
const repo = new DiskBackend(path);
const community = new Community(repo);
const start: number = performance.now();
await community.all();
const end: number = performance.now();
console.log("Loading time (ms):", end - start);
