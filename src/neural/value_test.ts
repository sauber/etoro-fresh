import { assertEquals } from "$std/assert/mod.ts";
import { sum, Value } from "./value.ts";

Deno.test("Initialize", () => {
  const v = new Value(2);
  assertEquals(v.data, 2);
});

Deno.test("Addition", () => {
  const v = new Value(2).add(2);
  assertEquals(v.data, 4);
});

Deno.test("Simple Back Propagation", () => {
  const v = new Value(2).mul(2);
  v.backward();
  assertEquals(v.grad, 1);
  v.prev.forEach((p) => assertEquals(p.grad, 2));
  // v.print();
});

Deno.test("Complex Back Propagation", () => {
  const a = new Value(4.0);
  const b = new Value(-2.0);
  const d = a.mul(b).add(b.pow(3));
  const e = new Value(3.0);
  const f = d.div(e);
  f.backward();
  assertEquals(f.data, -5.3333333333333333);
  assertEquals(a.grad, -0.6666666666666666);
  assertEquals(b.grad, 5.3333333333333333);
  // f.print();
});
