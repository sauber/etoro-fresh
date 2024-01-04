import {
  assert,
  assertRejects,
  assertInstanceOf,
  assertEquals,
} from "$std/assert/mod.ts";
import { Discover, DiscoverData } from "./discover.ts";
import type { InvestorId } from "/investor/mod.ts";
import { repoBackend } from "/repository/testdata.ts";

Deno.test("Discover", async (t) => {
  const discover: Discover = new Discover({
    Status: "",
    TotalRows: 0,
    Items: [],
  });
  assertInstanceOf(discover, Discover);

  await t.step("validate", async () => {
    const data = (await repoBackend.retrieve("discover")) as DiscoverData;
    const discover: Discover = new Discover(data);
    assertEquals(discover.validate(), true);
  });

  await t.step("investors", async () => {
    const data = (await repoBackend.retrieve("discover")) as DiscoverData;
    const discover: Discover = new Discover(data);
    const investors: InvestorId[] = discover.investors;
    assertEquals(investors.length, 70);
  });
});

Deno.test("Discover invalid", async () => {
  await assertRejects(
    async () => {
      const data = (await repoBackend.retrieve("discover")) as DiscoverData;
      data.TotalRows = 0;
      const discover: Discover = new Discover(data);
      assert(discover.validate());
    },
    Error,
    "TotalRows 0 < 1"
  );
});
