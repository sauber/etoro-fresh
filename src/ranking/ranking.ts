import { RepoBackend } from "/repository/mod.ts";
import { Model } from "./model.ts";
//import type { Input, Output, Prediction } from "./model.ts";
import { Features } from "./features.ts";
import { Community } from "/investor/mod.ts";
import { DataFrame } from "/utils/dataframe.ts";

export class Ranking {
  private readonly model: Model;
  private readonly features: Features;

  constructor(repo: RepoBackend) {
    this.model = new Model(repo);
    const community = new Community(repo);
    this.features = new Features(community);
    this.features.days = 30; // TODO: Read from config
  }

  public async train(): Promise<void> {
    const training: DataFrame = await this.features.data();
    const xf = ["Profit", "SharpeRatio"];
    const train_x = training.exclude([...xf, "VirtualCopiers"]);
    const train_y = training.include(xf);
    return this.model.train(train_x, train_y);
  }

  /** Predicted profit and SharpeRatio for an investor */
  public async rank(username: string): Promise<DataFrame> {
    const input = (await this.features.features(username)).input;
    const xf = ["Profit", "SharpeRatio"];

    const df: DataFrame = DataFrame.fromRecords([input]).exclude([
      ...xf,
      "VirtualCopiers",
    ]);
    const prediction = await this.model.predict(df);
    return prediction;
  }
}
