import { DiskBackend } from "../repository/disk-backend.ts";
import { mktmpdir, rmdir } from "../repository/files.ts";

export class TempBackend extends DiskBackend {
  constructor() {
    super("");
  }

  /** Created tmp dir */
  private _tmppath: string | null = null;
  protected async path(): Promise<string> {
    if (!this._tmppath) this._tmppath = await mktmpdir();
    return this._tmppath;
  }

  /** Delete files if created */
  public delete(): Promise<void> {
    if (this._tmppath) return rmdir(this._tmppath);
    else return Promise.resolve();
  }
}
