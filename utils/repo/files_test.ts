import { assert, assertEquals, assertInstanceOf } from "assert";
import Files from "./files.ts";


Deno.test("create and remove tmpdir", async () => {
  const files: Files = await Files.tmp();
  assertInstanceOf(files, Files);
  await files.delete();
});

Deno.test("write a file", async (t) => {
  const files: Files = await Files.tmp();

  await t.step("write", async () => {
    await files.write("foo", "bar");
  });

  await t.step("read", async () => {
    const content = await files.read("foo");
    assertEquals(content, "bar");
  });

  await files.delete();
});


Deno.test("Download a file", async (t) => {
  const files: Files = await Files.tmp();

  await t.step("write", async () => {
    await files.write("foo", "bar");
  });

  await t.step("read", async () => {
    const content = await files.read("foo");
    assertEquals(content, "bar");
  });

  await files.delete();
});