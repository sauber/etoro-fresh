import { assert, assertInstanceOf } from "$std/assert/mod.ts";
import { community } from "./testdata.ts";
import { Features } from "./features.ts";
import type { Input, Output } from "./features.ts";

const investor = await community.any();

Deno.test("Initialization", () => {
  const rank = new Features(investor);
  assertInstanceOf(rank, Features);
});

Deno.test("Input", () => {
  const rank = new Features(investor);
  const features: Input = rank.input;
  assert("PopularInvestor" in features);
  assert("Gain" in features);
});

Deno.test("Output", () => {
  const rank = new Features(investor);
  const features: Output = rank.output;
  assert("Profit" in features);
  assert("SharpeRatio" in features);
});
