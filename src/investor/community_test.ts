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
  const name = 'john';
  const date = today();

  await t.step("incomplete write", async () => {
    await Promise.all([
      repo.store(`${name}.chart`, {}),
      repo.store(`${name}.portfolio`, {}),
    ]);
    const names = await community.names(date);
    assertEquals(names, new Set([name]));
  });

  await t.step("complete write", async () => {
    await repo.store(`${name}.stats`, {});
    const names = await community.names(date);
    assertEquals(names, new Set([name]));
  });
});
