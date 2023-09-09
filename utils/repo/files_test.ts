import { assert, assertEquals, assertInstanceOf } from "assert";
import Files from "./files.ts";

/** Create tmp dir */
async function mktmp(): Promise<string> {
  return await Deno.makeTempDir();
}

/** Remove tmpdir and all content */
async function rmtmp(path: string): Promise<void> {
  await Deno.remove(path, { recursive: true });
}

Deno.test("create and remove tmpdir", async () => {
  const tmp = await mktmp();
  const files = new Files(tmp);
  assertInstanceOf(files, Files);
  rmtmp(tmp);
});

Deno.test("write a file", async (t) => {
  // Setup temp repo dir
  const tmp: string = await mktmp();
  const files = new Files(tmp);

  await t.step("write", async () => {
    await files.write("foo", "bar");
  });

  await t.step("read", async () => {
    const content = await files.read("foo");
    assertEquals(content, "bar");
  });

  rmtmp(tmp);
});