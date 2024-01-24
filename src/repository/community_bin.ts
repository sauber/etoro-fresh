/**
 * Load all investors.
 * Confirm all are valid.
 * Measure speed.
 */

import { DiskBackend } from "../storage/disk-backend.ts";
import { CachingBackend } from "../storage/caching-backend.ts";
import { Community } from "./community.ts";
import { Investor } from "/investor/mod.ts";
import { assertEquals } from "$std/assert/mod.ts";

const path: string = Deno.args[0];
const disk = new DiskBackend(path);
const repo = new CachingBackend(disk);
const community = new Community(repo);
const p1: number = performance.now();

// Confirm there are no invalid names
const invalid: string[] = await community.invalidNames();
assertEquals(invalid, []);
const p2: number = performance.now();
console.log("Validation time (ms):", p2 - p1);

// Load all investors
const _investors: Investor[] = await community.all();
const p3: number = performance.now();
console.log("Loading time (ms):", p3 - p2);
