import { assertInstanceOf, assertRejects } from "assert";
import { Repo } from "./repo.ts";

Deno.test("repo initialization", async (t) => {
  let repo: Repo;

  await t.step("create", async () => {
    repo = await Repo.tmp();
    assertInstanceOf(repo, Repo);
  });

  await t.step("delete", async () => {
    await repo.delete();

    await assertRejects(
      () => {
        return repo.files.age(repo.files.path);
      },
      Error,
    );
  });

});
