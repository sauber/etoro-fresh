import type { JSONObject, RepoBackend } from "./repo.d.ts";
import type { DateFormat } from "../time/calendar.ts";
import { Config } from "./config.ts";


/** Factory of objects based on assets in inventory */
export class Repo {
  constructor(private readonly backend: RepoBackend){}

  get config(){
    return new Config(this.backend);
  }
}
