import { Asset, RepoBackend } from "/repository/mod.ts";
import {
  Cost,
  DenseLayer,
  Sequential,
  setupBackend,
  SigmoidLayer,
  tensor1D,
  tensor2D,
  WASM,
} from "netsaur";

type ModelTS = Uint8Array;

/** Netsaur Model for predicting Ranking */
export class Model {
  private readonly asset: Asset<ModelTS>;
  private readonly assetname = "ranking.model";

  constructor(private readonly repo: RepoBackend) {
    this.asset = this.repo.asset(this.assetname);
  }

  // Load
  //     const age: number | null = await this.repo.age(assetname);
  //  if ( age && age < expire ) return true;

}
