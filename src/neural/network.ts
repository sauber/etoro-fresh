import { Value } from "./value.ts";
import {
  Dense,
  DenseData,
  LRelu,
  Normalize,
  Relu,
  Sigmoid,
  Tanh,
} from "./layer.ts";
import { Train } from "./train.ts";
import { Node } from "./node.ts";

type Layer = Dense | Relu | LRelu | Sigmoid | Tanh;
type Layers = Array<Layer>;

type LayerData = {
  type: string;
  neurons?: DenseData;
};

export type NetworkData = {
  inputs: number;
  layers: Array<LayerData>;
};

export type TrainingData = number[][];

export class Network extends Node {
  constructor(
    private readonly inputs: number,
    private readonly layers: Layers = [],
  ) {
    super();
  }

  public static import(data: NetworkData): Network {
    let inputs: number = data.inputs;
    const layers: Layers = [];
    data.layers.forEach((layer) => {
      switch (layer.type) {
        case "Dense": {
          const neurons = layer.neurons as DenseData;
          inputs = neurons.length;
          layers.push(Dense.import(neurons));
          break;
        }
        case "Relu":
          layers.push(new Relu());
          break;
        case "LRelu":
          layers.push(new LRelu());
          break;
        case "Sigmoid":
          layers.push(new Sigmoid());
          break;
        case "Tanh":
          layers.push(new Tanh());
          break;
        case "Normalize":
          layers.push(new Normalize(inputs));
          break;
      }
    });
    return new Network(data.inputs, layers);
  }

  public get export(): NetworkData {
    return {
      inputs: this.inputs,
      layers: this.layers.map((l) => {
        const type: string = l.constructor.name;
        return (type === "Dense")
          ? { type, neurons: l.export as DenseData }
          : { type };
      }),
    };
  }

  public get parameters(): Value[] {
    const params: Value[] = [];
    this.layers.forEach((layer: Layer) => params.push(...layer.parameters));
    return params;
  }

  /** Run a set of values through forward propagation and record the output */
  public predict(x: number[]): number[] {
    const xs = x.map((n) => new Value(n));
    const ys = this.forward(xs);
    return ys.map((y) => y.data);
  }

  public forward(xin: Value[]): Value[] {
    let xout = [...xin];
    for (const layer of this.layers) xout = layer.forward(xout);
    return xout;
  }

  private get outputs(): number {
    // Search for last layer where outputs is defined
    for (let i = this.layers.length - 1; i >= 0; --i) {
      const layer = this.layers[i];
      if ("outputs" in layer) return layer.outputs;
    }
    return this.inputs;
  }

  /** Create Network with additional Layer */
  private add(layer: Layer): Network {
    return new Network(this.inputs, [...this.layers, layer]);
  }

  public dense(outputs: number): Network {
    const inputs: number = this.outputs;
    return this.add(new Dense(inputs, outputs));
  }

  public get relu(): Network {
    return this.add(new Relu());
  }

  public get lrelu(): Network {
    return this.add(new LRelu());
  }

  public get sigmoid(): Network {
    return this.add(new Sigmoid());
  }

  public get tanh(): Network {
    return this.add(new Tanh());
  }

  public get normalize(): Network {
    return this.add(new Normalize(this.inputs));
  }

  /** Train network with input and output data */
  public train(xs: TrainingData, ys: TrainingData): Train {
    const train = new Train(this, xs, ys);
    train.run();
    return train;
  }
}
