import { assertEquals, assertGreater, assertGreaterOrEqual, assertLess, assertLessOrEqual } from "$std/assert/mod.ts";
import { sort } from "$std/semver/sort.ts";
import { Color } from "./pixmap.ts";

const black = new Color(0, 0, 0);
const white = new Color(255, 255, 255);
const color = new Color(1, 1, 1);

Deno.test("Color Distance", () => {
  const d: number = color.distance(black);
  assertEquals(d, 3);
  const bw: number = black.distance(white);
  assertEquals(bw, 255 * 255 * 3);
});

Deno.test("Color Brightness", () => {
  assertEquals(color.brightness, 1);
});

Deno.test("Color Sort", () => {
  const sorted: Array<Color> = Color.sort([black, white, color]);
  assertEquals(sorted.map((c) => c.brightness), [0, 1, 255]);
});

Deno.test("Random Color", () => {
  const random: Color = Color.random;
  const brightness = random.brightness;
  console.log({random, brightness});
  assertGreaterOrEqual(brightness, 0);
  assertLessOrEqual(brightness, 255);
});
