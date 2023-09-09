import { assert, assertEquals, assertInstanceOf } from "assert";
import { Repo } from "/utils/repo.ts";

Deno.test("blank initialization", async () => {
  const tmp = await Deno.makeTempDir();
  const repo = new Repo(tmp);
  assertInstanceOf(repo, Repo);
  await Deno.remove(tmp, { recursive: true });
});

/*
Deno.test("discover file", async (t) => {
  // Setup temp repo dir
  const tmpDir: string = await Deno.makeTempDir();
  const repo = new Repo(tmpDir);
  const discover: DiscoverFile = repo.discover();

  await t.step("download", async () => {
    await discover.download();
  });

  await t.step("age", async () => {
    const age = await discover.age();
    assertEquals(age, 0);
  });

  await t.step("read", async () => {
    const data: DiscoverData = await discover.read();
    assert(data.TotalRows >= 70 && data.TotalRows <= 140);
  });

  await t.step("freshness", async () => {
    assert(await discover.recent());
  });

  // Change timestamp of file, so it appears too old
  const filepath = await discover.path();
  const file = await Deno.open(filepath, { create: true, write: true });
  await Deno.futime(file.rid, 1556495550, 1556495550);
  file.close();

  await t.step("expiration", async () => {
    assert(!await discover.recent());
  });

  await t.step("refresh", async () => {
    const data: DiscoverData = await discover.load();
    assert(data.TotalRows >= 70 && data.TotalRows <= 140);
    assert(await discover.recent());
  });

  // Remove temp repo dir
  Deno.remove(tmpDir, { recursive: true });
});

Deno.test("discover file load", async (t) => {
    // Setup temp repo dir
    const tmpDir: string = await Deno.makeTempDir();
    const repo = new Repo(tmpDir);
    const discover: DiscoverFile = repo.discover();
  
    await t.step("refresh", async () => {
      const data: DiscoverData = await discover.load();
      assert(data.TotalRows >= 70 && data.TotalRows <= 140);
      assert(await discover.recent());
    });
  
    // Remove temp repo dir
    Deno.remove(tmpDir, { recursive: true });
  });
*/