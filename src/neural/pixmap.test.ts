import {
  assertEquals,
  assertExists,
  assertGreaterOrEqual,
  assertInstanceOf,
  assertLessOrEqual,
} from "$std/assert/mod.ts";

////////////////////////////////////////////////////////////////////////

import { Color } from "./pixmap.ts";

const black = Color.black;
const white = Color.white;
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

Deno.test("Color Average", () => {
  const avg: Color = Color.average([black, white, color]);
  assertEquals(avg, new Color(85, 85, 85));
});


Deno.test("Random Color", () => {
  const random: Color = Color.random;
  const brightness = random.brightness;
  assertGreaterOrEqual(brightness, 0);
  assertLessOrEqual(brightness, 255);
});

////////////////////////////////////////////////////////////////////////

import { Pixel } from "./pixmap.ts";

Deno.test("Pixel instance", () => {
  const p = new Pixel([0, 0], Color.random, 0);
  assertInstanceOf(p, Pixel);
});

////////////////////////////////////////////////////////////////////////

import { PixMap, Position } from "./pixmap.ts";

Deno.test("PixMap instance", () => {
  const m = new PixMap(0, 0);
  assertInstanceOf(m, PixMap);
});

Deno.test("PixMap Set/get", () => {
  const m = new PixMap(1, 1);
  const white = Color.white;
  const pos: Position = [0, 0];
  m.set(...pos, white);
  assertEquals(m.get(...pos), white);
});

Deno.test("PixMap Gradient", () => {
  const rows = 8;
  const cols = 20;
  const g = new PixMap(cols, rows);
  for ( let x = 0; x<cols; ++x ) {
    for ( let y = 0; y<rows; ++y ) {
      const l = Math.floor((x+y)*(255/(rows-1+cols-1)));
      // console.log({x, y, l});
      g.set(x, y, new Color(l,255-l,l));
    }  
  }
  console.log(g.toString());
});


////////////////////////////////////////////////////////////////////////

import { BlockPixMap } from "./pixmap.ts";

Deno.test("BlockPixMap instance", () => {
  const b = new BlockPixMap(white, white, white, white);
  assertInstanceOf(b, BlockPixMap);
  assertEquals(b.get(1, 1), white);
  const s = b.toString();
  assertEquals(s, "\x1b[48;2;255;255;255m \x1b[49m");
});

Deno.test("BlockPixMap grouping", () => {
  const b = new BlockPixMap(Color.white, Color.black, Color.black, Color.white);
  const s = b.toString();
  assertEquals(s, "\x1b[48;2;0;0;0m\x1b[38;2;255;255;255m▚\x1b[39m\x1b[49m");
});
