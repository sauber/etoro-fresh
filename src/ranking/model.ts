import { decodeBase64, encodeBase64 } from "base64";
import {
  BatchNorm1DLayer,
  DenseLayer,
  ReluLayer,
  Sequential,
  setupBackend,
  SigmoidLayer,
  tensor1D,
  tensor2D,
  WASM,
} from "netsaur";
import { Asset, RepoBackend } from "/repository/mod.ts";
import type { JSONObject } from "/repository/mod.ts";

type ModelTS = Uint8Array;
export type Input = Array<Array<number>>;
type Profit = number;
type SharpeRatio = number;
export type Output = Array<[Profit, SharpeRatio]>;

// Convert days to ms
const Days = 60 * 60 * 1000;

/** Netsaur Model for predicting Ranking */
export class Model {
  private readonly asset: Asset<ModelTS>;
  private readonly assetname = "ranking.model";
  private readonly expire = 30 * Days;

  constructor(private readonly repo: RepoBackend) {
    this.asset = this.repo.asset(this.assetname);
  }

  /** Run before creating model, training or predicting */
  private async setupBackend(): Promise<void> {
    await setupBackend(WASM);
  }

  /** Load existing model */
  private async loadModel(): Promise<Sequential> {
    const loaded: JSONObject | null = await this.repo.retrieve(this.assetname);
    if (loaded) {
      const model: Uint8Array = decodeBase64(loaded.model as string);
      if (model) return Sequential.load(model);
    }
    throw new Error(`${this.assetname} not loaded`);
  }

  /** Create a sequential model with layers */
  private createModel(): Sequential {
    const outputSize = 2; // Profit and SharpeRatio
    return new Sequential({
      // Number of minibatches, and size of output
      size: [128, outputSize],

      // The silent option is set to true, which means that the network will not output any logs during trainin
      silent: true,

      layers: [
        BatchNorm1DLayer({ momentum: 0.9 }),
        ReluLayer(),
        DenseLayer({ size: [outputSize] }),
        SigmoidLayer(),
        DenseLayer({ size: [outputSize] }),
      ],
    });
  }

  /** Load model if exists, otherwise create one */
  private async loadOrCreate(): Promise<Sequential> {
    console.log("Loading model");
    if (await this.repo.has(this.assetname)) return this.loadModel();
    console.log("Loading failed. Creating model instead.");
    return this.createModel();
  }

  /** Encode Model as Base64 and save in repository */
  private async save(model: Sequential): Promise<void> {
    const uint8arr: Uint8Array = await model.save();
    const str = encodeBase64(uint8arr);
    //console.log(str);
    return this.repo.store(this.assetname, { model: str });
  }

  /** Train model with input and output data */
  public async train(
    input: Input,
    output: Output,
  ): Promise<void> {
    // Setup backend
    await this.setupBackend();

    // Load existing or create new model
    const model: Sequential = await this.loadOrCreate();

    // Train model
    model.train(
      [{ inputs: tensor2D(input), outputs: tensor2D(output) }],
      // The number of iterations is set to 10000.
      10000,
    );

    // Save trained model
    return this.save(model);
  }

  public async predict(input: Input): Promise<Output> {
    // Setup backend
    await this.setupBackend();

    // Load existing model
    const model: Sequential = await this.loadModel();

    // Generate predictions
    const output: Output = [];
    for ( const i of input ) {
      const o = (await model.predict(tensor1D(i))).data;
      output.push([o[0], o[1]] as [Profit, SharpeRatio]);
    }
    return output;
  }
}
