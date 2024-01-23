import { Backend } from "../storage/mod.ts";
import { Model } from "./model.ts";
import { Features } from "./features.ts";
import { Community } from "/repository/mod.ts";
import { DataFrame } from "/utils/dataframe.ts";
import { TextSeries } from "/utils/series.ts";

export class Ranking {
  private readonly model: Model;
  private readonly features: Features;

  constructor(repo: Backend) {
    this.model = new Model(repo);
    const community = new Community(repo);
    this.features = new Features(community);
    this.features.days = 30; // TODO: Read from config
  }

  /** Train model with extracted features */
  public async train(): Promise<void> {
    console.log("Loading Features");
    const training: DataFrame = await this.features.data();
    const xf = ["Profit", "SharpeRatio"];
    const train_x = training.exclude(xf);
    const train_y = training.include(xf);
    console.log("Training model");
    return this.model.train(train_x, train_y);
  }

  /** Save model to repo */
  public save(): Promise<void> {
    return this.model.save();
  }

  /** Predicted profit and SharpeRatio for investors */
  public async predict(names: TextSeries): Promise<DataFrame> {
    // const features: Array<DataFrame> = await Promise.all(
    //   names.values.map((username: string) => this.features.data(username)),
    // );

    const features: DataFrame = await this.features.data(names);
    const inputs = features.map((feature: Extract) => feature.input);
    const indf = DataFrame.fromRecords(inputs);
    const prediction = await this.model.predict(indf);
    const result = new DataFrame({
      UserName: names,
    }).join(prediction);

    return result;
  }
}
