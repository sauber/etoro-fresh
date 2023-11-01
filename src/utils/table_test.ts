import {
  assertInstanceOf,
  assertEquals,
  assertThrows,
  assertAlmostEquals,
} from "assert";
import { Table, Column } from "./table.ts";

Deno.test("empty initialization", () => {
  const s = new Table();
  assertInstanceOf(s, Table);
});

Deno.test("get cell", () => {
  const s = new Table({ r: { c: 1 } });
  assertEquals(s.get("r", "c"), 1);
});

Deno.test("set cell", () => {
  const s = new Table();
  s.set("r", "c", 1);
  assertEquals(s.get("r", "c"), 1);
  assertEquals(s.colnames, ["c"]);
});

Deno.test("sum of cells", () => {
  const sum = new Table({
    a: { c: -2 },
    b: { c: 3 },
  }).sumColumn("c");
  assertEquals(sum, 1);
});

Deno.test("log of cells", () => {
  const log = new Table({
    a: { c: -1 },
    b: { c: 1 },
  }).log(["c"]);
  assertAlmostEquals(log.get("a", "c"), -0.69, 0.01);
  assertAlmostEquals(log.get("b", "c"), 0.69, 0.01);
});

Deno.test("normalize", () => {
  const s = new Table({
    a: { c: -2 },
    b: { c: 3 },
  }).normalize();
  assertEquals(s.get("a", "c"), 0);
  assertEquals(s.get("b", "c"), 1);
});

Deno.test("distribute", () => {
  const s = new Table({
    a: { c: 2 },
    b: { c: 3 },
  }).distribute();
  assertEquals(s.get("a", "c"), 0.4);
  assertEquals(s.get("b", "c"), 0.6);
});

Deno.test("filter", () => {
  const s = new Table({
    a: { c: -2 },
    b: { c: 3 },
  });
  const f = s.filter((r) => r.c > 0);
  assertEquals(f.rownames.length, 1);
  assertEquals(f.get("b", "c"), 3);
});

Deno.test("round", () => {
  const s = new Table({
    a: { b: -0.5 },
    b: { c: 0.5 },
  });
  const t = s.round(1);
  assertEquals(t.get("a", "b"), 0);
  assertEquals(t.get("b", "c"), 1);
});

Deno.test("colnames", () => {
  const t = new Table({
    a: { b: 0.123 },
    b: { c: 0.456789 },
  });
  assertEquals(t.colnames, ["b", "c"]);
});

Deno.test("rownames", () => {
  const t = new Table({
    a: { b: 0.123 },
    b: { c: 0.456789 },
  });
  assertEquals(t.rownames, ["a", "b"]);
});

Deno.test("sorted rownames", () => {
  const t = new Table({
    a: { b: 0.123 },
    b: { c: 0.456789 },
  });
  assertEquals(t.rownamesBy("b"), ["a", "b"]);
});

Deno.test("decimals", () => {
  const s = new Table({
    a: { b: 0.123 },
    b: { c: 0.456789 },
  });

  const t = s.decimals(2);
  assertEquals(t.get("a", "b"), 0.12);
  assertEquals(t.get("b", "c"), 0.46);

  const u = s.decimals(1, ["b"]);
  assertEquals(u.get("a", "b"), 0.1);
  assertEquals(u.get("b", "c"), 0.456789);
});

Deno.test("weight", () => {
  const s = new Table({
    a: { b: 1, c: 2 },
  });
  const t = s.weight({ b: 1, c: 1 });
  assertEquals(t.get("a", "sum"), 3);
});

Deno.test("scale", () => {
  const s = new Table({
    a: { b: 1, c: 2 },
  });
  const t = s.scale(2, ["c"]);
  assertEquals(t.get("a", "b"), 1); // Not scaled
  assertEquals(t.get("a", "c"), 4); // Scaled
});

Deno.test("sorted top", () => {
  const s = new Table({
    a: { c: 2 },
    b: { c: 3 },
  });
  const t = s.top(1, "c");
  assertEquals(t.rownames, ["b"]);
  // XXX sorted rows do no propagate to children
});

Deno.test("print", () => {
  const t = new Table({
    a: { b: 1, c: 2, d: 0 },
  });
  t.print("test of print");
  t.print("sorted print", "b");
});

Deno.test("dump", () => {
  const t = new Table({
    a: { b: 1, c: 2 },
  });
  t.dump();
});

Deno.test("invalid column name", () => {
  const t = new Table({
    a: { b: 1, c: 2 },
  });
  assertThrows(
    () => {
      t.get("a", "d");
    },
    Error,
    "colname d not in grid"
  );
});

Deno.test("modify locked table", () => {
  const t = new Table({
    a: { b: 1, c: 2 },
  });
  t.select(["b"]);

  assertThrows(
    () => {
      t.set("a", "b", 3);
    },
    Error,
    "Modifying locked table"
  );

  assertThrows(
    () => {
      t.addColumn("c", new Column({ b: 3 }));
    },
    Error,
    "Modifying locked table"
  );
});
