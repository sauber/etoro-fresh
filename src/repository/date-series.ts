import { DateFormat } from "/utils/time/calendar.ts";
import { RepoBackend } from "./mod.ts";

/** A named asset on all the dates it is available */
export class DateSeries {
  constructor(private readonly repo: RepoBackend, private readonly assetname: string) {}

  /** List dates where asset appear in repository */
  public dates(): Promise<DateFormat[]> {
    return this.repo.datesByAsset(this.assetname);
  }
}