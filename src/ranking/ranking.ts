import { RepoBackend } from "/repository/mod.ts";
import { Model } from "./model.ts";
import type { Input, Output, Prediction } from "./model.ts";
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
  }

  public async train(): Promise<void> {
    const training: DataFrame = await this.features.data();

    const xf = ["Profit", "SharpeRatio"];
    const train_x = training.exclude([...xf, "VirtualCopiers"]);
    const train_y = training.include(xf);
    const inputs = train_x.grid as Input;
    const outputs = train_y.grid as Output;

    this.model.train(inputs, outputs);
  }

  /** Predicted profit and SharpeRatio for an investor */
  public async rank(username: string): Promise<Prediction> {
    //const input = await this.features.features(username);
    //const prediction = await this.model.predictOne(input);
    //return prediction;
    return [0, 0];
  }
}
