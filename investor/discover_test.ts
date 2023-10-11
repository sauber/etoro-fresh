import { assert, assertRejects } from "assert";
import { Repo } from "./repo.ts";
import { Discover, DiscoverData } from "./discover.ts";
import { Investors } from "./investors.ts";

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

  await t.step("investors", async () => {
    const investors: Investors = await discover.investors();
    const count: number = investors.length;
    assert(count >= 70 && count <= 140, `Count of investors is ${count}, should be 70-140`);
  });

  await repo.delete();
});
