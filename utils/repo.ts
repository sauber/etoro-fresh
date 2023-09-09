import { today } from "./calendar.ts";
import Files from "/utils/repo/files.ts";

interface DiscoverData = {

}

export class Discover {
  constructor(private readonly repo: Repo) {}

  recent(): 
}

export class Repo {
  readonly files: Files;

  constructor(private readonly path: string) {
    this.files = new Files(path);
  }

  get discover(): Discover {
    return new Discover(this);
  }
}
