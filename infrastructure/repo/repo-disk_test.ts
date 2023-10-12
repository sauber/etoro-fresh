import { assertInstanceOf, assertRejects } from "assert";
import { DiskRepo } from "./repo-disk.ts";
import { JSONObject } from "./repo.d.ts";

const path = "infrastructure/repo/testdata";

Deno.test("Initialization", () => {
  const repo = new DiskRepo(path);
  assertInstanceOf(repo, DiskRepo);
});

Deno.test("Persistency", async () => {
  const repo = new DiskRepo(path);

  await assertRejects(
    async () => await repo.delete(),
    Error,
    "Refuse to delete persistent disk repository"
  );
});

Deno.test("Read config asset", async () => {
  const repo = new DiskRepo(path);

  const config: JSONObject | null = await repo.last("config");
  assertInstanceOf(config, Object);
});
