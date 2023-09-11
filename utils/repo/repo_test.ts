import { assert, assertInstanceOf, assertRejects } from "assert";
import { Repo, Discover, DiscoverData } from "/utils/repo/repo.ts";

Deno.test("repo initialization", async () => {
  const repo: Repo = await Repo.tmp();
  assertInstanceOf(repo, Repo);
  await repo.delete();
});

Deno.test("discover", async (t) => {
  const repo = await Repo.tmp();
  const discover: Discover = repo.discover;

  await assertRejects(
    () => { return discover.latest() },
    Error,
    "File discover.json not found",
  );

  await t.step("recent", async () => {
    const data: DiscoverData = await discover.recent();
    assert(data.TotalRows >= 70 && data.TotalRows <= 140);
  });

  await repo.delete();
});

