import { assertInstanceOf, assertRejects } from "$std/assert/mod.ts";
import { RepoDiskBackend } from "./repo-disk.ts";
import { JSONObject } from "./mod.ts";

const path = "testdata";

Deno.test("Initialization", () => {
  const repo = new RepoDiskBackend(path);
  assertInstanceOf(repo, RepoDiskBackend);
});

Deno.test("Persistency", async () => {
  const repo = new RepoDiskBackend(path);

  await assertRejects(
    async () => await repo.delete(),
    Error,
    "Refuse to delete persistent disk repository",
  );
});

Deno.test("Read config asset", async () => {
  const repo = new RepoDiskBackend(path);

  const config: JSONObject | null = await repo.retrieve("config");
  assertInstanceOf(config, Object);
});
