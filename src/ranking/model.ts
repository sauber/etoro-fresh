import { Semaphore } from "semaphore";
import { decodeBase64, encodeBase64 } from "$std/encoding/base64.ts";
import {
  AdamOptimizer,
  Array1D,
  Array2D,
  BatchNorm1DLayer,
  Cost,
  DenseLayer,
  ReluLayer,
  Sequential,
  setupBackend,
  SigmoidLayer,
  tensor1D,
  tensor2D,
  WASM,
} from "netsaur";
import { Asset, Backend } from "📚/storage/mod.ts";
import type { JSONObject } from "📚/storage/mod.ts";
import { DataFrame } from "📚/dataframe/mod.ts";
import type { RowRecord, RowRecords } from "📚/dataframe/mod.ts";

type ModelTS = Uint8Array;
type Profit = number;
type SharpeRatio = number;
type Prediction = [Profit, SharpeRatio];

// Convert days to ms
const Days = 60 * 60 * 1000;

/** Netsaur Model for predicting Ranking */
export class Model {
  private readonly asset: Asset<ModelTS>;
  private readonly assetname = "ranking.model";
  private readonly expire = 30 * Days;
  private readonly inputSize = 26; // Stats parameters
  private readonly outputSize = 2; // Profit and SharpeRatio
  private _sequential: Sequential | undefined;
  private semaphore = new Semaphore(1);

  constructor(private readonly repo: Backend) {
    //this.asset = this.repo.asset(this.assetname);
    this.asset = new Asset<ModelTS>(this.assetname, repo);
  }

  /** Run before creating model, training or predicting */
  private async setupBackend(): Promise<void> {
    await setupBackend(WASM);
  }

  /** Load existing model */
  private async loadModel(): Promise<Sequential> {
    //console.log("Loading existing model");
    const loaded: JSONObject | null = await this.repo.retrieve(this.assetname);
    if (loaded) {
      const model: Uint8Array = decodeBase64(loaded.model as string);
      if (model) return Sequential.load(model);
    }
    throw new Error(`${this.assetname} not loaded`);
  }

  /** Create a sequential model with layers */
  private createModel(): Sequential {
    console.warn("Creating new model");

    const hiddenSize = this.outputSize + Math.round(Math.sqrt(this.inputSize));

    return new Sequential({
      // Number of minibatches, and size of output
      size: [128, this.inputSize],

      // The silent option is set to true, which means that the network will not output any logs during training
      silent: true,

      layers: [
        BatchNorm1DLayer({ momentum: 0.9 }),
        ReluLayer(),
        DenseLayer({ size: [hiddenSize] }),
        SigmoidLayer(),
        DenseLayer({ size: [this.outputSize] }),
      ],

      // The cost function used for training the network is the mean squared error (MSE).
      cost: Cost.MSE,

      // Use Adam optimizer
      optimizer: AdamOptimizer(),
    });
  }

  /** Load model if exists, otherwise create one */
  private async loadOrCreate(): Promise<Sequential> {
    return (await this.repo.has(this.assetname))
      ? this.loadModel()
      : this.createModel();
  }

  /** Prepare model */
  private async init(): Promise<Sequential> {
    return await this.semaphore.use(async () => {
      if (!this._sequential) {
        await this.setupBackend();
        this._sequential = await this.loadOrCreate();
      }
      return this._sequential;
    });
  }

  /** Encode Model as Base64 and save in repository */
  public async save(): Promise<void> {
    if (this._sequential) {
      const uint8arr: Uint8Array = await this._sequential.save();
      const str = encodeBase64(uint8arr);
      return this.repo.store(this.assetname, { model: str });
    }
    return Promise.reject("No model loaded or created. Cannot save.");
  }

  /** Train model with input and output data */
  public async train(input: DataFrame, output: DataFrame): Promise<void> {
    // Load existing or create new model
    const model: Sequential = await this.init();

    // Reshape data as tensors
    if (input.names.length != this.inputSize) 
      throw new Error(`Expected ${this.inputSize} columns in input, got ${input.names.length}.`);
    if (output.names.length != this.outputSize) 
      throw new Error(`Expected ${this.outputSize} columns in output, got ${output.names.length}.`);
    const inputs = tensor2D(input.grid as Array2D);
    const outputs = tensor2D(output.grid as Array2D);
    //console.log({input, output});

    // Train model
    model.train(
      [{ inputs, outputs }],
      // The number of iterations is set to 10000.
      10000,
      // Batches
      25,
      // Learning Rate
      0.1
    );
  }

  /** Make prediction for one row of input */
  private async predictOne(parameters: Array1D): Promise<Prediction> {
    const model: Sequential = await this.init();
    const values = (await model.predict(tensor1D(parameters))).data;
    return [values[0], values[1]] as [Profit, SharpeRatio];
  }

  private async predictRecord(record: RowRecord): Promise<RowRecord> {
    const input = Object.values(record) as Array1D;
    const output = await this.predictOne(input);
    const result = { Profit: output[0], SharpeRatio: output[1] };
    return result;
  }

  /** Predict a set of inputs in parallel */
  public async predict(input: DataFrame): Promise<DataFrame> {
    if (input.names.length != this.inputSize) {
      throw new Error(`Expected ${this.inputSize} columns in input, got ${input.names.length}`);
    }
    const output: RowRecords = await Promise.all(
      input.records.map((r: RowRecord) => this.predictRecord(r))
    );
    const df = DataFrame.fromRecords(output);
    return df;
  }
}
