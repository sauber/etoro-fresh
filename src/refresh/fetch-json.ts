import { JSONObject } from "/repository/mod.ts";

export function fetchjson (url: string): Promise<JSONObject> {
    console.log(url);

    return fetch(url, {
      headers: {
        accept: "application/json",
      },
    }).then((resp) => resp.json());
  }