import { DateFormat, DateSeriesAsync } from "/utils/time/mod.ts";
import { RepoBackend } from "./mod.ts";

/** A named asset in repo on all the dates it is available */
export class Asset<AssetType> implements DateSeriesAsync<AssetType> {
  constructor(private readonly repo: RepoBackend, private readonly assetname: string) {}

  private async load(date: DateFormat): Promise<AssetType> {
    return (await this.repo.retrieve(this.assetname, date)) as AssetType;
  }

  public dates(): Promise<DateFormat[]> {
    return this.repo.datesByAsset(this.assetname);
  }

  public async start(): Promise<DateFormat> {
    const dates: DateFormat[] = await this.dates();
    return dates[0];
  }

  public async end(): Promise<DateFormat> {
    const dates: DateFormat[] = await this.dates();
    return dates.reverse()[0];
  }

  public async first(): Promise<AssetType> {
    return this.load(await this.start());
  }

  public async last(): Promise<AssetType> {
    return this.load(await this.end());
  }

  /** Search for asset no later than date */
  public async value(date: DateFormat): Promise<AssetType> {
    // After range
    if ( date >= await this.end() ) return this.last();

    // In range
    const dates: DateFormat[] = await this.dates();
    for ( const available of dates.reverse() ) {
      if ( available <= date ) return this.load(available);
    }

    // Before range (dummy code never called, to satisfy return type)
    return this.first();
  }

}