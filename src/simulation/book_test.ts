import { assertInstanceOf, assertEquals, assertNotEquals } from "assert";
import type { DateFormat } from "/utils/time/mod.ts";
import { Book } from "./book.ts";
import { position, chart } from "./testdata.ts";

const start: DateFormat = chart.start();
const end: DateFormat = chart.end();

Deno.test("Instance", () => {
  const book = new Book();
  assertInstanceOf(book, Book);
});

Deno.test("Deposit", () => {
  const book = new Book();
  const amount = 100000;
  book.deposit(amount, start);
  assertEquals(book.value, amount);
});

Deno.test("Add/Remove position", () => {
  const book = new Book();
  assertEquals(book.add(position), true);
  assertEquals(book.value, 0);
  assertEquals(book.remove(position, end, "sell"), true);
  assertNotEquals(book.value, 0);
  //book.export.print("Buy/Sell");
});

Deno.test("Valuation", () => {
  const book = new Book();
  book.valuate(chart.start());
  assertEquals(book.value, 0);
  //book.export.print("Valuation");
});
