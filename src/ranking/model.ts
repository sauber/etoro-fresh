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
  async setupBackend(): Promise<void> {
    await setupBackend(WASM);
  }

  /** Confirm if a recent model exists */
  async hasModel(): Promise<boolean> {
    const age: number | null = await this.repo.age(this.assetname);
    return (age && age < this.expire) ? true : false;
  }

  /** Load existing model */
  async loadModel(): Promise<Sequential> {
    const loaded: JSONObject | null = await this.repo.retrieve(this.assetname);
    if (loaded) {
      const model: Uint8Array = decodeBase64(loaded.model as string);
      if (model) return Sequential.load(model);
    }
    throw new Error(`${this.assetname} not loaded`);
  }

  /** Create a sequential model with layers */
  createModel(): Sequential {
    const outputSize = 2;
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

  /** Train model with input and output data */
  train(
    model: Sequential,
    input: Array<Array<number>>,
    output: Array<[number, number]>,
  ): void {
    model.train(
      [{ inputs: tensor2D(input), outputs: tensor2D(output) }],
      // The number of iterations is set to 10000.
      10000,
    );
  }

  /** Encode Model as Base64 and save in repository */
  async save(model: Sequential): Promise<void> {
    const uint8arr: Uint8Array = await model.save();
    const str = encodeBase64(uint8arr);
    //console.log(str);
    return this.repo.store(this.assetname, { model: str });
  }
}
