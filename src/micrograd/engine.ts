/** Uniq list of all values */
function buildTopo(top: Value): Value[] {
  const topo: Value[] = [];
  const values = new Set();

  function visit(v: Value) {
    if (!values.has(v)) {
      values.add(v);
      for (const child of v._children) {
        visit(child);
      }
      topo.push(v);
    }
  }
  visit(top);
  return topo;
}

export class Value {
  public grad: number = 0;
  public _backward: () => void = () => {};
  private topology: Value[] = [];

  constructor(
    public data: number,
    public _children: Value[] = [],
    public _op = "",
  ) {}

  public backward() {
    if (this.topology.length == 0) {
      // console.log("Building topology");
      this.topology = buildTopo(this);
    }
    this.grad = 1;
    for (const v of this.topology.reverse()) {
      v._backward();
    }
  }

  public print(indent: string = "") {
    console.log(indent, this._op, this.data, this.grad);
    for (const c of this._children) {
      c.print(indent + " ");
    }
  }

}

export const add = (...args: Value[]) => {
  const out = new Value(
    args.reduce((acc, cur) => acc + cur.data, 0),
    args,
    "+",
  );

  function _backward() {
    for (const arg of args) {
      arg.grad += 1 * out.grad;
    }
  }
  out._backward = _backward;

  return out;
};

export const sub = (a: Value, b: Value) => {
  const out = new Value(a.data - b.data, [a, b], "-");

  function _backward() {
    a.grad += 1 * out.grad;
    b.grad += -1 * out.grad;
  }
  out._backward = _backward;

  return out;
};

export const mul = (...args: Value[]) => {
  const out = new Value(
    args.reduce((acc, cur) => acc * cur.data, 1),
    args,
    "*",
  );

  function _backward() {
    for (const arg of args) {
      arg.grad += (out.grad * out.data) / arg.data;
    }
  }
  out._backward = _backward;

  return out;
};

export const pow = (a: Value, b: Value) => {
  const out = new Value(a.data ** b.data, [a, b], "**");

  function _backward() {
    a.grad += b.data * a.data ** (b.data - 1) * out.grad;
    b.grad += Math.log(a.data) * a.data ** b.data * out.grad;
  }
  out._backward = _backward;

  return out;
};

export const neg = (a: Value) => {
  const out = new Value(-a.data, [a], "-");

  function _backward() {
    a.grad += -1 * out.grad;
  }
  out._backward = _backward;

  return out;
};

export const div = (a: Value, b: Value) => {
  const out = new Value(a.data / b.data, [a, b], "/");

  function _backward() {
    a.grad += (1 / b.data) * out.grad;
    b.grad += (-a.data / b.data ** 2) * out.grad;
  }
  out._backward = _backward;

  return out;
};

export const relu = (a: Value) => {
  const out = new Value(a.data < 0 ? 0 : a.data, [a], "relu");

  function _backward() {
    a.grad += (out.data > 0 ? 1 : 0) * out.grad;
  }
  out._backward = _backward;

  return out;
};

export const tanh = (a: Value) => {
  const out = new Value(Math.tanh(a.data), [a], "tanh");

  function _backward() {
    a.grad += (1 - out.data ** 2) * out.grad;
  }
  out._backward = _backward;

  return out;
};
