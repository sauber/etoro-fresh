import { assert, assertInstanceOf } from "assert";
import { JSONObject } from "./asset.ts";
import { Fetcher } from "./fetcher.ts";

Deno.test("Fetcher", async (t) => {
  await t.step("blank initialize", async () => {
    const f: Fetcher = new Fetcher();
    assertInstanceOf(f, Fetcher);
  });

  const rate = 200; // Min pause between calls
  const fetch = new Fetcher(rate);
  const begin = new Date();

  await t.step("first fetch", async () => {
    const start = new Date();
    await fetch.get("https://jsonplaceholder.typicode.com/todos/1");
    const end = new Date();
    const diff = end.getTime() - start.getTime();
    assert(diff < rate);
  });

  await t.step("second fetch", async () => {
    const start = new Date();
    await fetch.get("https://jsonplaceholder.typicode.com/todos/2");
    const end = new Date();
    const diff = end.getTime() - start.getTime();
    assert(diff < rate);
    assert(end.getTime() - begin.getTime() > rate);
  });

  await t.step("third fetch", async () => {
    await fetch.get("https://jsonplaceholder.typicode.com/todos/3");
    const end = new Date();
    assert(end.getTime() - begin.getTime() > 2*rate);
  });

  await t.step("parallel fetch", async () => {
    const start = new Date();
    const prom1 = fetch.get("https://jsonplaceholder.typicode.com/todos/1");
    const prom2 = fetch.get("https://jsonplaceholder.typicode.com/todos/2");
    const prom3 = fetch.get("https://jsonplaceholder.typicode.com/todos/3");
    await Promise.all([prom1, prom2, prom3]);
    const end = new Date();
    const diff = end.getTime() - start.getTime();
    assert(diff > 2*rate);
});



});
