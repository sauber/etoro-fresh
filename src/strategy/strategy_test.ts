import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { today } from "📚/utils/time/mod.ts";
import { Strategy, NullStrategy, RandomStrategy } from "./strategy.ts";
import type { Orders } from "./strategy.ts";
import { investors } from "./testdata.ts";

const date = today();

Deno.test("Strategy Instance", () => {
    const s = new Strategy(investors);
    assertInstanceOf(s, Strategy);
})

Deno.test("Null Strategy", () => {
    const s = new NullStrategy(investors);
    assertEquals(s.orders(date).length, 0);
})

Deno.test("Random Strategy", () => {
    const amount = 1000;
    const s = new RandomStrategy(investors, amount);
    const orders: Orders = s.orders(date);
    assertEquals(orders.length, 1);
    assertEquals(orders[0].amount, amount);
})
