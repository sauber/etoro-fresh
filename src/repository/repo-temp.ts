import { Files } from "./files.ts";
import { RepoDiskBackend } from "./repo-disk.ts";

export class RepoTempBackend extends RepoDiskBackend {
  constructor() {
    super("");
  }

  /** Create tmp dir if not already created */
  protected async files(): Promise<Files> {
    if (!this._files) this._files = await Files.tmp();
    return this._files;
  }

  public delete(): Promise<void> {
    if (this._files) return this._files.delete();
    return new Promise((resolve) => resolve());
  }
}
