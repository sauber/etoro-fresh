import { CachingBackend, DiskBackend } from "📚/storage/mod.ts";
import { Community } from "📚/repository/mod.ts";
import { Ranking } from "📚/ranking/mod.ts";

export class Backend {
  private readonly repo: CachingBackend;

  constructor(readonly diskpath: string) {
    const disk = new DiskBackend(diskpath);
    this.repo = new CachingBackend(disk);
  }

  public get community(): Community {
    return new Community(this.repo);
  }

  public get ranking(): Ranking {
    return new Ranking(this.repo);
  }
}
