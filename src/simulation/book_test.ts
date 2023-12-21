import { assertInstanceOf, assertEquals } from "$std/assert/mod.ts";
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
  book.deposit(start, amount);
  assertEquals(book.balance.cash, amount);
  assertEquals(book.balance.value, amount);
});

Deno.test("Add/Remove position", () => {
  const book = new Book();
  assertEquals(book.add(start, position), true);
  assertEquals(book.balance.invested, position.amount);
  assertEquals(book.balance.profit, 0);
  const profit: number = position.amount * (chart.last() / chart.first()-1);
  assertEquals(book.remove(end, position, "sell", chart.last()), true);
  assertEquals(book.balance.invested, 0);
  assertEquals(book.balance.profit, profit);

});

Deno.test("Valuation", () => {
  const book = new Book();
  book.valuate(start);
  assertEquals(book.balance.value, 0);
  assertEquals(book.length, 1);
});
