import { assertEquals, assertInstanceOf } from "assert";
import { Community, CommunityRepo, Names } from "../community/community.ts";

const names = ["foo", "bar"];

// Stub class
const repo = new (class implements CommunityRepo {
  last(): Promise<Names> {
    return new Promise((resolve) => resolve(names));
  }
})();

Deno.test("Initialization", () => {
  const community: Community = new Community(repo);
  assertInstanceOf(community, Community);
});

Deno.test("Load Names", async () => {
  const community: Community = new Community(repo);
  assertEquals(await community.last(), names);
});
