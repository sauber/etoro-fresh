import { Backend, InvestorObject } from "📚/community/backend.ts";
import { TextSeries } from "../utils/series.ts";

/** Store investor objects in memory */
export class HeapBackend implements Backend {
  private readonly heap: Record<string, InvestorObject> = {};

  public create(): Promise<void> {
    return Promise.resolve();
  }

  public delete(): Promise<void> {
    return Promise.resolve();
  }

  public has(UserName: string): Promise<boolean> {
    return Promise.resolve(UserName in this.heap);
  }

  public store(data: InvestorObject): Promise<void> {
    this.heap[data.UserName] = data;
    return Promise.resolve();
  }

  public retrieve(UserName: string): Promise<InvestorObject> {
    return Promise.resolve(this.heap[UserName]);
  }

  public names(): Promise<TextSeries> {
    return Promise.resolve(new TextSeries(Object.keys(this.heap)));
  }
}
