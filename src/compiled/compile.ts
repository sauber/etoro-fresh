import { RepoBackend } from "📚/repository/repo-backend.ts";
import { Backend } from "../repository/backend.ts";
import type { Names } from "📚/investor/mod.ts";
import type { DateFormat } from "📚/utils/time/mod.ts";
import { TextSeries } from "📚/utils/series.ts";
import { Investor } from "📚/investor/mod.ts";
import type { StatsData as RawStats } from "📚/investor/mod.ts";
import type { InvestorObject, InvestorStats } from "../repository/backend.ts";

/** Scan all date directories and assemble investor objects */
export class Compile {
  constructor(
    private readonly compiled: Backend,
    private readonly raw: RepoBackend) {}

  /** Identify all investor names on a date */
  private async namesByDate(date: DateFormat): Promise<Names> {
    const assets: string[] = await this.raw.assetsByDate(date);
    const valid = /(chart|portfolio|stats)$/;

    // Catalog which file type exist for each investor name
    const names = new Set<string>();
    assets
      .filter((assetname: string) => assetname.match(valid) != null)
      .forEach((assetname: string) => {
        const [name, _type] = assetname.split(".");
        names.add(name);
      });
    return new TextSeries([...names]);
  }

  /** Unit set of names across all dates */
  private async allNames(): Promise<Names> {
    const dates: DateFormat[] = await this.raw.dates();
    const allDates: Names[] = await Promise.all(
      dates.map((date) => this.namesByDate(date))
    );
    const allNames: string[][] = allDates.map((date) => date.values);
    const merged = new Set(allNames.flat());
    return new TextSeries([...merged]);
  }

  /** Investor loader */
  private investor(UserName: string): Investor {
    return new Investor(UserName, this.raw);
  }

  /** Load data for investor */
  private async investorObject(UserName: string): Promise<InvestorObject> {
    const investor = this.investor(UserName);
    const userid = await investor.CustomerId();
    const stats = investor.statsSeries;
    const dates = await stats.dates();
    const statsdata: Record<DateFormat, InvestorStats> = {};
    for ( const date of dates ) {
      const s: RawStats = await stats.value(date);
      statsdata[date] = s.Data;
    }
    const chart = await investor.chart();
    const result: InvestorObject = {
      UserName: UserName,
      CustomerId: userid,
      start: chart.start(),
      end: chart.end(),
      chart: chart.values,
      stats: statsdata
    }
    //console.log(result);
    await this.compiled.store(result);
    return result;
  }

  public async run(): Promise<void> {
    const names: Names = await this.allNames();
    for ( const name of names.values ) await this.investorObject(name);
    console.log(names);
  }
}
