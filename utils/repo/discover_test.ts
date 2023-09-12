import { assert, assertRejects } from "assert";

import { Repo } from "./repo.ts";
import { Discover, DiscoverData } from "./discover.ts";

Deno.test("Discover", async (t) => {
  const repo = await Repo.tmp();
  const discover: Discover = repo.discover;

  await t.step("latest", async () => {
    await assertRejects(
      () => {
        return discover.latest();
      },
      Error,
      "File discover.json not found"
    );
  });

  await t.step("recent", async () => {
    const data: DiscoverData = await discover.recent();
    assert(data.TotalRows >= 70 && data.TotalRows <= 140);
  });

  await repo.delete();
});
