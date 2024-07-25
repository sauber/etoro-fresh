type ValueParams = { op?: string; label?: string; prev?: Values };

export type Values = Array<Value>;

// Stores a single scalar value and its gradient.
export class Value {
  data: number;
  grad: number = 0;
  label: string;
  prev: Values;
  op: string | null;
  min: number = 0;
  max: number = 0;

  constructor(data: number, params: ValueParams = {}) {
    this.data = data;
    this.op = params?.op ?? null;
    this.label = params?.label ?? "";
    this.prev = params?.prev ?? [];
  }

  public print(indent = ""): void {
    console.log(indent, this.op, { data: this.data, grad: this.grad });
    this.prev.forEach((prev) => prev.print(indent + " "));
  }

  private toVal(v: Value | number): Value {
    return typeof v === "number" ? new Value(v) : v;
  }

  public backwardStep() {}

  public add(v: Value | number): Value {
    const other = this.toVal(v);
    const out = new Value(this.data + other.data, {
      prev: [this, other],
      op: "+",
    });
    out.backwardStep = () => {
      this.grad += out.grad;
      other.grad += out.grad;
    };
    return out;
  }

  public sub(v: Value | number): Value {
    const other = this.toVal(v);
    const out = new Value(this.data - other.data, {
      prev: [this, other],
      op: "-",
    });
    out.backwardStep = () => {
      this.grad += out.grad;
      other.grad -= out.grad;
    };
    return out;
  }

  public mul(v: Value | number): Value {
    const other = this.toVal(v);
    const out = new Value(this.data * other.data, {
      prev: [this, other],
      op: "*",
    });
    out.backwardStep = () => {
      this.grad += other.data * out.grad;
      other.grad += this.data * out.grad;
    };
    return out;
  }

  public div(v: Value | number): Value {
    const other = this.toVal(v);
    const out = new Value(this.data / other.data, {
      prev: [this, other],
      op: "/",
    });
    out.backwardStep = () => {
      this.grad += (1 / other.data) * out.grad;
      other.grad += (-this.data / other.data ** 2) * out.grad;

      if (Math.abs(this.grad) > 1000000 || Math.abs(other.grad) > 1000000) {
        console.log("Division operation cause steep inclined grad", {
          "this.data": this.data,
          "this.grad": this.grad,
          "other.data": other.data,
          "other.grad": other.grad,
        });
      }
    };
    return out;
  }

  public pow(other: number): Value {
    if (typeof other !== "number") {
      throw new Error("Only supporting int/float powers");
    }
    const out = new Value(this.data ** other, {
      prev: [this],
      op: "^",
    });
    out.backwardStep = () => {
      this.grad += other * this.data ** (other - 1) * out.grad;
    };
    return out;
  }

  public exp(): Value {
    const out = new Value(Math.exp(this.data), { prev: [this], op: "e" });
    out.backwardStep = () => {
      this.grad += out.data * out.grad;
    };
    return out;
  }

  public sigmoid(): Value {
    // Sigmoid
    const s = (x: number) => 1 / (1 + Math.exp(-x));
    // Sigmoid gradiant
    const ds = (x: number) => {
      const sx = s(x);
      return sx * (1 - sx);
    };

    const out = new Value(s(this.data), { prev: [this], op: "sigmoid" });
    out.backwardStep = () => this.grad += ds(out.data) * out.grad;
    return out;
  }

  public tanh(): Value {
    const out = new Value(Math.tanh(this.data), { prev: [this], op: "tanh" });
    out.backwardStep = () => (this.grad += (1 - out.data ** 2) * out.grad);
    return out;
  }

  public relu(): Value {
    const reluVal = this.data < 0 ? 0 : this.data;
    const out = new Value(reluVal, { prev: [this], op: "relu" });
    out.backwardStep = () => (this.grad += (out.data > 0 ? 1 : 0) * out.grad);
    return out;
  }

  public lrelu(): Value {
    const reluVal = this.data < 0 ? 0.01 * this.data : this.data;
    const out = new Value(reluVal, { prev: [this], op: "lrelu" });
    out.backwardStep =
      () => (this.grad += (out.data > 0 ? 1 : 0.01) * out.grad);
    return out;
  }

  public backward(): void {
    // Topological order of all the children in the graph.
    const topo: Values = [];
    const visited = new Set();
    const buildTopo = (v: Value) => {
      if (visited.has(v)) return;
      visited.add(v);
      for (const parent of v.prev) buildTopo(parent);
      topo.push(v);
    };
    buildTopo(this);
    topo.reverse();

    // Go one variable at a time and apply the chain rule to get its gradient.
    this.grad = 1;
    for (const node of topo) node.backwardStep();
  }
}

// Shortcut for: new Value(data, params)
export const v = (d: number, p: ValueParams = {}): Value => new Value(d, p);

/** Sum of multiple values */
export const sum = (...args: Values): Value => {
  const out = new Value(
    args.reduce((acc, cur) => acc + cur.data, 0),
    { prev: args, op: "Σ" },
  );

  out.backwardStep = () => {
    for (const arg of args) {
      arg.grad += out.grad;
    }
  };
  return out;
};
