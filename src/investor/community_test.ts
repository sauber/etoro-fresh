import { assertEquals, assertInstanceOf  } from "assert";
import { Community } from "./community.ts";
import { RepoHeapBackend } from "/repository/repo-heap.ts";
import { today } from "/utils/time/calendar.ts";

Deno.test("Initialization", () => {
  const repo = new RepoHeapBackend();
  const community: Community = new Community(repo);
  assertInstanceOf(community, Community);
});

Deno.test("Latest Names", async (t) => {
  const repo = new RepoHeapBackend();
  const community: Community = new Community(repo);
  const name = 'foo';
  const date = today();

  await t.step("incomplete write", async () => {
    await Promise.all([
      repo.store(`${name}.chart.json`, {}),
      repo.store(`${name}.portfolio.json`, {}),
    ]);
    const names = await community.names(date);
    assertEquals(names, []);
  });

  await t.step("complete write", async () => {
    await repo.store(`${name}.stats.json`, {});
    const names = await community.names(date);
    assertEquals(names, [name]);
  });
});
