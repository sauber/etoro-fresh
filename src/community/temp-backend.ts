import { Files } from "📚/repository/files.ts";
import { DiskBackend } from "📚/community/disk-backend.ts";

export class TempBackend extends DiskBackend {
  constructor() {super("")}

    /** Create tmp dir if not already created */
    protected async files(): Promise<Files> {
      if (!this._files) this._files = await Files.tmp();
      return this._files;
    }
  
    /** Delete files if created */
    public delete(): Promise<void> {
      if (this._files) return this._files.delete();
      else return Promise.resolve();
    }
  
}