import { assertEquals, assertInstanceOf  } from "assert";
import { CommunityFileRepo } from "./community-file-repo.ts";
import { Files } from "/utils/repo/files.ts";

Deno.test("Initialization", async () => {
  const files: Files = await Files.tmp();
  const repo: CommunityFileRepo = new CommunityFileRepo(files);
  assertInstanceOf(repo, CommunityFileRepo);
  await files.delete();
});

Deno.test("Latest Names", async (t) => {
  const files: Files = await Files.tmp();
  const repo: CommunityFileRepo = new CommunityFileRepo(files);
  const name = 'foo';
  const dir = files.sub('today');

  await t.step("incomplete write", async () => {
    await Promise.all([
      dir.write(`${name}.chart.json`, "{}"),
      dir.write(`${name}.portfolio.json`, "{}"),
    ]);
    const names = await repo.last();
    assertEquals(names, []);
  });

  await t.step("complete write", async () => {
    await dir.write(`${name}.stats.json`, "{}");
    const names = await repo.last();
    assertEquals(names, [name]);
  });

  await files.delete();
});
