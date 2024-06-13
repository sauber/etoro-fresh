import { assertEquals } from "$std/assert/mod.ts";
import { Relu } from "./layer.ts";
import { Value } from "./value.ts";

Deno.test("Rely Layer Activation", () => {
  const l = new Relu();
  const cases = [
    [-1, 0],
    [0, 0],
    [1, 1],
  ];
  cases.forEach((c) => {
    const predict = l.forward([new Value(c[0])]);
    assertEquals(predict[0].data, c[1]);
  });
});
