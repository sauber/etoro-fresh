/**
 * Load all investors.
 * Confirm all are valid.
 * Measure speed.
 */

import { DiskBackend } from "../storage/disk-backend.ts";
import { Community } from "./community.ts";
//import { Investor } from "/investor/mod.ts";
import { assertEquals } from "$std/assert/mod.ts";

const path: string = Deno.args[0];
const repo = new DiskBackend(path);
const community = new Community(repo);
const start: number = performance.now();

// Confirm there are no invalid names
const invalid: string[] = await community.invalidNames();
assertEquals(invalid, []);

const end: number = performance.now();
console.log("Loading time (ms):", end - start);
