import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { repoBackend } from "📚/repository/testdata.ts";
import { Compile } from "./compile.ts";
import { HeapBackend } from "./heap-backend.ts";
import { TempBackend } from "./temp-backend.ts";

// const dest = new HeapBackend();
const dest = new TempBackend();

Deno.test("Initialization", () => {
  const c = new Compile(dest, repoBackend);
  assertInstanceOf(c, Compile);
})

Deno.test("Run", async () => {
  const c = new Compile(dest, repoBackend);
  const result: void = await c.run();
  assertEquals(result, undefined);
  //console.log(dest);
})