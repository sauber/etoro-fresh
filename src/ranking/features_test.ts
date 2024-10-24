import {
  assertAlmostEquals,
  assertEquals,
  assertInstanceOf,
} from "@std/assert";
import { community } from "📚/ranking/testdata.ts";
import { Features } from "📚/ranking/features.ts";
import type { Input, Output } from "./mod.ts";

const investor = await community.investor("Robier89");

Deno.test("Initialization", () => {
  const rank = new Features(investor);
  assertInstanceOf(rank, Features);
});

Deno.test("Input at oldest date", () => {
  const rank = new Features(investor);
  const features: Input = rank.input();
  assertEquals(features[1], 50.53);
});

Deno.test("Input at specific date", () => {
  const rank = new Features(investor);
  const date = investor.stats.end;
  const features: Input = rank.input(date);
  assertEquals(features[1], 31.86);
});

Deno.test("Output", () => {
  const rank = new Features(investor);
  const features: Output = rank.output();
  assertAlmostEquals(features[0], 0.11076050031109397);
});
