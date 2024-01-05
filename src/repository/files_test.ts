import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { Files } from "./files.ts";

Deno.test("create and remove tmpdir", async () => {
  const files: Files = await Files.tmp();
  assertInstanceOf(files, Files);
  await files.delete();
});

Deno.test("write a file", async (t) => {
  const files: Files = await Files.tmp();
  const filename = "foo";
  const content = "bar";

  await t.step("unwritten", async () => {
    const exists = await files.exists(filename);
    assertEquals(exists, false);
  });

  await t.step("write", async () => {
    await files.write(filename, content);
  });

  await t.step("written", async () => {
    const exists = await files.exists(filename);
    assertEquals(exists, true);
  });

  await t.step("list files", async () => {
    const filenames: string[] = await files.files();
    assertEquals(filenames, [filename]);
  });

  await t.step("read", async () => {
    const content = await files.read(filename);
    assertEquals(content, content);
  });

  await files.delete();
});

Deno.test("Create a directory", async (t) => {
  const files: Files = await Files.tmp();
  const dirname = "dir";

  await t.step("write", async () => {
    await files.sub(dirname).create();
  });

  await t.step("list", async () => {
    const dirnames: string[] = await files.dirs();
    assertEquals(dirnames, [dirname]);
  });

  await t.step("last", async () => {
    const last: string = await files.last();
    assertEquals(last, dirname);
  });

  await files.delete();
});
