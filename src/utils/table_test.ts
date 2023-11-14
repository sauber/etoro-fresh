import { assertEquals, assertInstanceOf } from "assert";
import { Table } from "./table.ts";

Deno.test("Blank Initialization", () => {
  const t = new Table();
  assertInstanceOf(t, Table);
});

Deno.test("Display Blank Table", () => {
  const t = new Table();
  assertEquals(t.toString(), "");
});

Deno.test("Display Title", () => {
  const t = new Table();
  t.title = "title";
  assertEquals(t.toString(), "[ title ]");
});

Deno.test("Display Headers", () => {
  const t = new Table();
  t.headers = ["a", "b"];
  //console.log(t.toString());
  assertEquals(
    t.toString(),
    "╔═══╤═══╗\n" + "║ \x1b[1ma\x1b[0m │ \x1b[1mb\x1b[0m ║\n" + "╚═══╧═══╝",
  );
});

Deno.test("Display Rows", () => {
  const t = new Table();
  t.rows = [["a", "b"]];
  //console.log(t.toString());
  assertEquals(
    t.toString(),
    "╔═══╤═══╗\n" + "║ a │ b ║\n" + "╚═══╧═══╝",
  );
});

Deno.test("Display Headers and Rows", { ignore: true }, () => {
  const t = new Table();
  t.theme = t.roundTheme;
  t.headers = ["text", "number", "boolean"];
  t.rows = [["a", 0, true], ["bb", 10, false]];
  console.log(t.toString());
});
