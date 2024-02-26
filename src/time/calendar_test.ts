import { assertEquals } from "$std/assert/mod.ts";
import { diffDate, nextDate, today } from "./calendar.ts";

Deno.test("today", () => {
  assertEquals(today(), new Date().toISOString().substring(0, 10));
});

Deno.test("diffDate", () => {
  assertEquals(diffDate("2024-02-26", "2024-03-01"), 4);
});

Deno.test("nextDate", () => {
  assertEquals(nextDate("2024-02-26", 4), "2024-03-01");
})