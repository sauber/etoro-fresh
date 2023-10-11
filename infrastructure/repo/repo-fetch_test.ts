import { assertEquals, assertInstanceOf, assertRejects } from "assert";
import { FetchRepo } from "./repo-fetch.ts";
import { config } from "./testdata.ts";

Deno.test("Initialization", () => {
  const repo = new FetchRepo(config);
  assertInstanceOf(repo, FetchRepo);
});

Deno.test("Fetching", async (t) => {
  const repo = new FetchRepo(config);
  
  await t.step("discover", async () => {
    const data = await repo.last('discover');
    assertInstanceOf(data, Object);
    assertEquals(data.Status, 'OK');
  });

  await assertRejects(
    async () => await repo.last('config'),
    Error,
    "Cannot fetch config asset"
  );
});
