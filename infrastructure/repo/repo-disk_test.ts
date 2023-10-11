import { assertInstanceOf, assertRejects } from "assert";
import { DiskRepo } from "./repo-disk.ts";

Deno.test("Initialization", () => {
  const repo = new DiskRepo("testdata");
  assertInstanceOf(repo, DiskRepo);
});

Deno.test("Persistency", async () => {
  const repo = new DiskRepo("testdata");

  await assertRejects(
    async () => await repo.delete(),
    Error,
    "Refuse to delete persistent disk repository"
  );
});
