import { createHandler, ServeHandlerInfo } from "$fresh/server.ts";
import manifest from "../fresh.gen.ts";
import { assertEquals } from "$std/assert/mod.ts";

const CONN_INFO: ServeHandlerInfo = {
  remoteAddr: { hostname: "127.0.0.1", port: 53496, transport: "tcp" },
};

Deno.test("HTTP assert test.", async (t) => {
  const handler = await createHandler(manifest);

  await t.step("#1 GET /", async () => {
    const resp = await handler(
      new Request("http://127.0.0.1/"),
      CONN_INFO,
    );
    assertEquals(resp.status, 200);
  });

  await t.step("#2 GET /community/latest", async () => {
    const resp = await handler(
      new Request("http://127.0.0.1/community/latest"),
      CONN_INFO,
    );
    assertEquals(resp.status, 200);
  });

  await t.step("#3 GET /community/all", async () => {
    const resp = await handler(
      new Request("http://127.0.0.1/community/all"),
      CONN_INFO,
    );
    assertEquals(resp.status, 200);
  });

  await t.step("#4 GET /about", async () => {
    const resp = await handler(
      new Request("http://127.0.0.1/about"),
      CONN_INFO,
    );
    assertEquals(resp.status, 200);
  });

});
