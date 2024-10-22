import { assert, assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { community } from "./testdata.ts";
import { Features } from "./features.ts";
import type { Input, Output } from "./features.ts";

const investor = await community.investor("Robier89");

Deno.test("Initialization", () => {
  const rank = new Features(investor);
  assertInstanceOf(rank, Features);
});

Deno.test("Input at oldest date", () => {
  const rank = new Features(investor);
  const features: Input = rank.input();
  assert("PopularInvestor" in features);
  assert("Gain" in features);
  assertEquals(features.Gain, 50.53);
});

Deno.test("Input at specific date", () => {
  const rank = new Features(investor);
  const date = investor.stats.end;
  const features: Input = rank.input(date);
  assert("PopularInvestor" in features);
  assert("Gain" in features);
  assertEquals(features.Gain, 31.86);
});

Deno.test("Output", () => {
  const rank = new Features(investor);
  const features: Output = rank.output();
  assert("Profit" in features);
  assert("SharpeRatio" in features);
});
