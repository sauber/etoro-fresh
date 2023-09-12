import { assertEquals, assertNotEquals } from "assert";

import { Repo } from "./repo.ts";
import { JSONValue } from "./asset.ts";
import { UUID } from "./uuid.ts";

Deno.test("UUID", async (t) => {
  const repo = await Repo.tmp();
  const uuid: UUID = new UUID(repo);

  await t.step("get unknown value", async () => {
    const value: JSONValue = await uuid.latest();
    assertEquals(value, null);
  });

  let generated: string;
  await t.step("generate value", async () => {
    const value: JSONValue = await uuid.recent();
    assertNotEquals(value, null);
    generated = value;
  });

  await t.step("confim value", async () => {
    const value: JSONValue = await uuid.latest();
    assertEquals(value, generated);
  });

  await repo.delete();
});


