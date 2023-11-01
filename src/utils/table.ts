import AsciiTable from "ascii_table";

type Keys = string[];
type InternalGrid = Record<string, Column>;
export type RawGrid = Record<string, GridRow>;
export type GridRow = Record<string, number>;
//
// Type for callback method
interface RowCallback {
  (row: GridRow): number;
}
interface Formula {
  [key: string]: RowCallback;
}

// Callback filter
interface FilterCallback {
  (row: GridRow): boolean;
}

////////////////////////////////////////////////////////////////////////

export class Column {
  constructor(private readonly column: GridRow = {}) {}

  /** Names of entries */
  get names(): Keys {
    return Object.keys(this.column);
  }

  /** Set value of entry */
  set(name: string, value: number) {
    this.column[name] = value;
  }

  /** Get value of entry */
  get(name: string): number {
    return this.column[name];
  }

  /** raw data */
  get all(): GridRow {
    return this.column;
  }

  /** Sum of all values */
  get sum(): number {
    return Object.values(this.column).reduce((sum, value) => sum + value);
  }

  /** Minimum and maximum value */
  private get min_max(): [number, number] {
    let min = Infinity;
    let max = -Infinity;
    Object.values(this.column).map((value) => {
      if (value > max) max = value;
      if (value < min) min = value;
    });
    return [min, max];
  }

  /** Scale values into range between 0 and 1 */
  get normalize(): Column {
    const col = new Column();
    const [min, max] = this.min_max;
    Object.entries(this.column).forEach(([key, value]) =>
      col.set(key, (value - min) / (max - min))
    );
    return col;
  }

  /** Scale values into range between -1 and 1 */
  get compress(): Column {
    const col = new Column();
    const [min, max] = this.min_max;
    Object.entries(this.column).forEach(([key, value]) => {
      let val = 0;
      if (value > 0) val = value / max;
      if (value < 0) val = -value / min;
      col.set(key, val);
    });
    return col;
  }

  /** Log of each value */
  get log(): Column {
    const col = new Column();
    Object.entries(this.column).forEach(([key, value]) => {
      let val = 0;
      if (value > 0) val = Math.log(value + 1);
      if (value < 0) val = -Math.log(-value + 1);
      col.set(key, val);
    });
    return col;
  }

  /** Distribute numbers to sum equals 1 */
  get distribute(): Column {
    const sum = this.sum;
    const col = new Column();
    Object.entries(this.column).forEach(([key, value]) =>
      col.set(key, value / sum)
    );
    return col;
  }

  /** Round to nearest unit */
  round(unit: number): Column {
    const col = new Column();
    Object.entries(this.column).forEach(([key, value]) =>
      col.set(key, Math.round(value / unit) * unit)
    );
    return col;
  }

  /** Number of decimals in float */
  decimals(unit: number): Column {
    const col = new Column();
    Object.entries(this.column).forEach(([key, value]) => {
      if (value) col.set(key, +value.toFixed(unit));
    });
    return col;
  }

  /** Number of decimals in float */
  scale(factor: number): Column {
    const col = new Column();
    Object.entries(this.column).forEach(([key, value]) => {
      if (value) col.set(key, value * factor);
    });
    return col;
  }
}

////////////////////////////////////////////////////////////////////////

/** Hash of hash transformations **/
export class Table {
  protected readonly grid: InternalGrid = {};
  private locked = false;

  constructor(rows: RawGrid = {}) {
    Object.entries(rows).forEach(([key, value]) => {
      this.addRow(key, value);
    });
  }

  /** Add value across columns */
  addRow(name: string, row: Record<string, number>): void {
    Object.keys(row).forEach((col: string) => this.set(name, col, row[col]));
  }

  /** Pick same value from all columns */
  getRow(name: string): GridRow {
    const row: GridRow = {};
    Object.entries(this.grid).forEach(([key, column]) => {
      row[key] = column.get(name);
    });
    return row;
  }

  /** Add column to table */
  addColumn(name: string, col: Column): void {
    if (this.locked) throw new Error("Modifying locked table");
    this.grid[name] = col;
  }

  /** Check if column exists */
  hasColumn(name: string): boolean {
    if (this.grid[name]) return true;
    return false;
  }

  /** Get value from cell */
  get(rowname: string, colname: string): number {
    if (!this.grid[colname]) {
      throw new Error(`colname ${colname} not in grid`);
    }
    return this.grid[colname].get(rowname);
  }

  /** Set value in cell */
  set(rowname: string, colname: string, value: number): void {
    //console.log(this.locked);
    if (this.locked) throw new Error("Modifying locked table");
    if (!this.grid[colname]) this.grid[colname] = new Column();
    this.grid[colname].set(rowname, value);
  }

  /** Add value to existing value in cell */
  add(rowname: string, colname: string, value: number): void {
    //console.log(this.locked);
    if (this.locked) throw new Error("Modifying locked table");
    if (!this.grid[colname]) this.grid[colname] = new Column();

    const prev: number = this.grid[colname].get(rowname);
    const sum: number = prev ? value + prev : value;

    this.grid[colname].set(rowname, sum);
  }

  /** Names of columns */
  get colnames(): Keys {
    return Object.keys(this.grid);
  }

  /** Combine keys from all columns */
  get rownames(): Keys {
    const set = new Set<string>();
    Object.values(this.grid).map((column) => {
      column.names.forEach((v) => set.add(v));
    });
    const all = Array.from(set);
    return all;
  }

  /** Rownames sorted by value in column */
  rownamesBy(colname: string): Keys {
    const names: string[] = this.rownames;

    function lookup(key: string): number {
      const value = grid[colname].get(key);
      if (value) return value;
      return 0;
    }

    // Sort by by value in column
    const grid = this.grid;
    names.sort((a, b) => lookup(b) - lookup(a));

    return names;
  }

  sumColumn(colname: string): number {
    return this.grid[colname].sum;
  }

  /** Select only certain columns */
  select(colnames: string[]) {
    const table = new Table();
    for (const colname of this.colnames) {
      if (colnames.includes(colname)) {
        table.addColumn(colname, this.grid[colname]);
        this.locked = true;
      }
    }
    return table;
  }

  /** Create new modified column or copy existing by reference into new table */
  private copyOrModify(
    method: string,
    colnames: string[] = this.colnames
  ): Table {
    const table = new Table();
    for (const colname of this.colnames) {
      const oldColumn = this.grid[colname];
      if (colnames.includes(colname)) {
        switch (method) {
          case "normalize":
            table.addColumn(colname, oldColumn.normalize);
            break;
          case "log":
            table.addColumn(colname, oldColumn.log);
            break;
          case "compress":
            table.addColumn(colname, oldColumn.compress);
            break;
          case "distribute":
            table.addColumn(colname, oldColumn.distribute);
            break;
        }
      } else {
        table.addColumn(colname, oldColumn);
        this.locked = true;
      }
    }
    return table;
  }

  normalize(colnames?: string[]): Table {
    return this.copyOrModify("normalize", colnames);
  }

  compress(colnames?: string[]): Table {
    return this.copyOrModify("compress", colnames);
  }

  log(colnames?: string[]): Table {
    return this.copyOrModify("log", colnames);
  }

  distribute(colnames?: string[]): Table {
    return this.copyOrModify("distribute", colnames);
  }

  round(unit: number, colnames: string[] = this.colnames): Table {
    const table = new Table();
    for (const colname of this.colnames) {
      const oldColumn = this.grid[colname];
      if (colnames.includes(colname)) {
        table.addColumn(colname, oldColumn.round(unit));
      } else {
        table.addColumn(colname, oldColumn);
        this.locked = true;
      }
    }
    return table;
  }

  decimals(count: number, colnames: string[] = this.colnames): Table {
    const table = new Table();
    for (const colname of this.colnames) {
      const oldColumn = this.grid[colname];
      if (colnames.includes(colname)) {
        table.addColumn(colname, oldColumn.decimals(count));
      } else {
        table.addColumn(colname, oldColumn);
        this.locked = true;
      }
    }
    return table;
  }

  /** Multiply values by factor */
  scale(factor: number, colnames: string[] = this.colnames): Table {
    const table = new Table();
    for (const colname of this.colnames) {
      const oldColumn = this.grid[colname];
      if (colnames.includes(colname)) {
        table.addColumn(colname, oldColumn.scale(factor));
      } else {
        table.addColumn(colname, oldColumn);
        this.locked = true;
      }
    }
    return table;
  }

  /** Scale each column */
  weight(weight: Record<string, number>): Table {
    const table = this.select(this.colnames); // clone all columns
    Object.entries(weight).forEach(([key, scale]) => {
      if (this.grid[key]) {
        const column: Column = this.grid[key];
        Object.entries(column.all).forEach(([rowname, value]) => {
          let sum: number = scale * value;
          if (table.hasColumn("sum")) {
            const old: number = table.get(rowname, "sum");
            if (old) sum += table.get(rowname, "sum");
          }
          table.set(rowname, "sum", sum);
        });
      }
    });
    return table;
  }

  /** Divide divident with divisor, and store result in column */
  divide(dividend: string, divisor: string, column: string): Table {
    const table: Table = this.select(this.colnames); // clone all columns
    this.rownames.forEach((rowname) => {
      if (this.hasColumn(divisor)) {
        const value: number =
          this.get(rowname, dividend) / this.get(rowname, divisor);
        table.set(rowname, column, value);
      }
    });
    return table;
  }

  /** Rename one column, keep the rest */
  rename(oldColName: string, newColName: string): Table {
    const table = new Table();
    Object.entries(this.grid).forEach(([key, value]) => {
      table.addColumn(key == oldColName ? newColName : key, value);
      this.locked = true;
    });
    return table;
  }

  /** Rename one column, keep the rest */
  merge(other: Table): Table {
    const table = new Table();
    Object.entries(Object.assign({}, this.grid, other.grid)).forEach(
      ([key, value]) => {
        table.addColumn(key, value);
      }
    );
    this.locked = true;
    other.locked = true;
    return table;
  }

  /** Apply custom formula to each row to generate new columns */
  //
  // [
  //   [ 'target1', function(row) { return row.b/row.c} ],
  //   [ 'target2', function(row) { return row.b-row.c} ],
  // ]
  //
  custom(formula: Formula): Table {
    const table = new Table();
    Object.keys(formula).forEach((colname: string) => {
      for (const rowname of this.rownames) {
        const func: RowCallback = formula[colname];
        const row: GridRow = this.getRow(rowname);
        const value: number = func(row);
        table.set(rowname, colname, value);
      }
    });
    return table;
  }

  /** Add or change columns */
  amend(formula: Formula): Table {
    return this.merge(this.custom(formula));
  }

  /** Keep only row passing evaluation in callback */
  filter(callback: FilterCallback, sortby?: string): Table {
    const table = new Table();
    const rownames = sortby ? this.rownamesBy(sortby) : this.rownames;
    for (const rowname of rownames) {
      const row: GridRow = this.getRow(rowname);
      if (callback(row)) table.addRow(rowname, row);
    }
    return table;
  }

  /** Keep only row passing evaluation in callback */
  top(max: number, colname: string): Table {
    const table = new Table();
    let count = 0;
    for (const rowname of this.rownamesBy(colname)) {
      const row: GridRow = this.getRow(rowname);
      table.addRow(rowname, row);
      ++count;
      if (count == max) break;
    }
    return table;
  }

  /** Pick only certain named rows */
  only(rownames: string[]) {
    const table = new Table();
    for (const rowname of this.rownames) {
      if (rownames.includes(rowname))
        table.addRow(rowname, this.getRow(rowname));
    }
    return table;
  }

  /** Print an ascii table */
  print(title: string, sortby?: string): Table {
    const tidy = this.decimals(2);
    const colnames = tidy.colnames;
    const rownames = sortby ? tidy.rownamesBy(sortby) : tidy.rownames;
    const table = new AsciiTable(title);
    table.setHeading("name", ...colnames);
    for (const name of rownames) {
      table.addRow(name, ...[...colnames].map((x) => tidy.get(name, x)));
    }
    console.log("\n" + table.toString());
    return this;
  }

  /** Dump the data structure */
  dump(): Table {
    console.log(this.grid);
    return this;
  }
}
