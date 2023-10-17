import { Config } from "./config.ts";
import type { RepoBackend } from "./repo.d.ts";

/** Factory of objects based on assets in inventory */
export class Repo {
  constructor(private readonly backend: RepoBackend){}

  get config(){
    return new Config(this.backend);
  }

  get community() {
    return [];
  }
}
