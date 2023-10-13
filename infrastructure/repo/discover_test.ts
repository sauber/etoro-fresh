import { assert, assertRejects, assertInstanceOf, assertEquals } from "assert";
import { Discover, DiscoverData } from "./discover.ts";
import { InvestorId } from "./repo.d.ts";
import { repoBackend } from "./testdata.ts";

Deno.test("Discover", async (t) => {
  const discover: Discover = new Discover({Status: '', TotalRows: 0, Items: []});
  assertInstanceOf(discover, Discover);

  await t.step("validate", async () => {
    const data = await repoBackend.retrieve('discover') as unknown as DiscoverData;
    const discover: Discover = new Discover(data);
    assertEquals(discover.validate(), true);
  });

  await t.step("investors", async () => {
    const data = await repoBackend.retrieve('discover') as unknown as DiscoverData;
    const discover: Discover = new Discover(data);
    const investors: InvestorId[] = discover.investors();
    assertEquals(investors.length, 60);
  });
});

Deno.test("Discover invalid", async (t) => {
  await assertRejects(
    async () => {
      const data = await repoBackend.retrieve('discover') as unknown as DiscoverData;
      data.TotalRows = 0;
      const discover: Discover = new Discover(data);
      assert(discover.validate());
    },
    Error,
    "TotalRows 0 < 1"
  );
});
