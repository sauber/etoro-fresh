import { assertEquals, assertInstanceOf } from "assert";
import { Grid, DataSet } from "./grid.ts";

Deno.test("Empty initialization", () => {
  const g = new Grid(new DataSet(0));
  assertInstanceOf(g, Grid);
});

