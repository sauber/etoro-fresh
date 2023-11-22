type Position = {
  x: number;
  y: number;
};

type Item = {
  x: number;
  y: number;
};

type Row = Array<Spot>;
type Matrix = Array<Row>;
type Box = {
  target: Position;
  content: Item;
};

////////////////////////////////////////////////////////////////////////

class Spot {
  private slot: Box | undefined;

  constructor(private readonly position: Position) {}

  /** Insert a box in slot */
  public insert(box: Box): void {
    if (this.slot) throw new Error("Inserting box in occupied slot");
    this.slot = box;
  }

  /** Remove box from slot */
  public remove(): Box {
    if (!this.slot) throw new Error("Removing non-existing box from slot");
    const box = this.slot;
    this.slot = undefined;
    return box;
  }

  /** Check if a box is in slot */
  public get isEmpty(): boolean {
    return this.slot === undefined;
  }

  /** Swap box with another slot */
  public swap(other: Spot): void {
    const box = other.remove();
    other.insert(this.remove());
    this.insert(box);
  }

  /** How far away from target is box */
  public distance(target: Position | undefined = this.slot?.target): number {
    if (!target) return 0;
    const x = 0.5 + this.position.x - target.x;
    const y = 0.5 + this.position.y - target.y;
    return Math.sqrt(x * x + y * y);
  }

  /** Look at item in box */
  public get content(): Item | undefined {
    return this.slot?.content;
  }

  /** Look at target for item in box */
  public get target(): Position | undefined {
    return this.slot?.target;
  }
}

////////////////////////////////////////////////////////////////////////

class DataSet {
  private readonly list: Array<Item>;
  public readonly xmin: number;
  public readonly xmax: number;
  public readonly ymin: number;
  public readonly ymax: number;

  constructor(public readonly length: number) {
    this.list = DataSet.dataset(length);
    this.xmin = Math.min(...this.list.map((i) => i.x));
    this.xmax = Math.max(...this.list.map((i) => i.x));
    this.ymin = Math.min(...this.list.map((i) => i.y));
    this.ymax = Math.max(...this.list.map((i) => i.y));
  }

  /** Generate random Dataset */
  static dataset(length: number): Array<Item> {
    return [...Array(length)].map(() => {
      return { x: DataSet.rand, y: DataSet.rand };
    });
  }

  /** Generate random integer between -100 and 100 */
  static get rand(): number {
    return Math.round(-100 + 200 * Math.random());
  }

  /** All items */
  public get values(): Array<Item> {
    return this.list;
  }
}

////////////////////////////////////////////////////////////////////////

class Grid {
  private readonly spots: Matrix;
  private readonly colcount: number;
  private readonly rowcount: number;

  constructor(private readonly set: DataSet) {
    this.spots = Grid.generateSpots(set);
    this.colcount = this.spots[0].length;
    this.rowcount = this.spots.length;
    for (const item of set.values) this.insert(item);
  }

  /** Generate an empty matrix */
  private static generateSpots(list: DataSet): Matrix {
    const spots = [];
    const avgsize = Math.sqrt(list.length);
    const rowcount = Math.ceil(list.length / avgsize);
    const colcount = Math.ceil(list.length / rowcount);
    for (let r = 0; r < rowcount; r++) {
      const row: Row = [];
      for (let c = 0; c < colcount; c++) {
        row.push(new Spot({ x: c, y: r }));
      }
      spots.push(row);
    }
    return spots;
  }

  /** Calculate target in Matrix for item */
  private targetPosition(item: Item): Position {
    const xwid: number = (this.set.xmax - this.set.xmin) * 1.001;
    const yhei: number = (this.set.ymax - this.set.ymin) * 1.001;
    const cwid: number = xwid / this.colcount;
    const rhei: number = yhei / this.rowcount;
    const x: number = (item.x - this.set.xmin) / cwid;
    const y: number = (item.y - this.set.ymin) / rhei;
    return { x, y };
  }

  /** A flat list of all spots */
  private get flat(): Row {
    return this.spots.flat();
  }

  /** A random free slot */
  private get freeSpot(): Spot {
    const free = this.flat.filter((slot) => slot.isEmpty);
    const index = Math.floor(free.length * Math.random());
    return free[index];
  }

  /** Insert Item in Matrix at any free slot */
  private insert(item: Item): void {
    const pos = this.targetPosition(item);
    const spot = this.freeSpot;
    const box: Box = { content: item, target: pos };
    spot.insert(box);
  }

  /** Swap content of two slots, if it makes combined distance less */
  private minimize(a: Spot, b: Spot): void {
    if (a.isEmpty) [a, b] = [b, a];
    if (b.isEmpty) {
      if (a.isEmpty) return; // Both are empty
      const dist = a.distance();
      const test = b.distance(a.target);
      if (test < dist) b.insert(a.remove());
    }

    // Content in both slots
    const dist = a.distance() + b.distance();
    const test = a.distance(b.target) + b.distance(a.target);
    if (test < dist) a.swap(b);
  }

  /** Calculate sum of displacements */
  public get displacement(): number {
    let sum = 0;
    this.flat.map((spot) => (sum += spot.distance()));
    return sum;
  }

  /** Swap all pairs of slots to reduce displacement */
  private sweep(): void {
    const flat: Row = this.flat;
    for (let i = 0; i < flat.length - 1; i++) {
      for (let j = i + 1; j < flat.length; j++) {
        this.minimize(flat[i], flat[j]);
      }
    }
    this.minimize(flat[0], flat[1]);
  }

  /** Swap content of slots until minimal combined displacement */
  public optimize(): void {
    let displ = Infinity;
    while (this.displacement < displ) {
      displ = grid.displacement;
      grid.sweep();
    }
  }

  /** Print content of matrix */
  public print(): void {
    const matrix: Matrix = this.spots;
    const table = [];
    for (let r = 0; r < this.rowcount; r++) {
      const row = [];
      for (let c = 0; c < this.colcount; c++) {
        const spot: Spot = matrix[r][c];
        row.push({ ...spot.content, dist: spot.distance().toPrecision(3) });
      }
      table.unshift(row);
    }
    console.table(table);
    console.log("Displacement:", this.displacement);
  }
}

////////////////////////////////////////////////////////////////////////

const set = new DataSet(5);
const grid = new Grid(set);
grid.print();
grid.optimize();
grid.print();
