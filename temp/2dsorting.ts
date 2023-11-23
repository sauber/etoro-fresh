type Item = [number, number];
type DataSet = Array<Item>;
type Grid = Array<Array<Item>>;

// Generate a set of points
function dataset(count: number): DataSet {
  const list: DataSet = [];
  for (let i = 0; i < count; i++) {
    list.push([
      Math.round(-100 + 200 * Math.random()),
      Math.round(-100 + 200 * Math.random()),
    ]);
  }
  return list;
}

// Calculate height/width of matrix
function gridSize(list: DataSet): number {
  return Math.ceil(Math.sqrt(list.length));
}

function makeGrid(list: DataSet): Grid {
  const avgsize = Math.round(Math.sqrt(list.length));
  const rowcount = Math.ceil(list.length / avgsize);
  const colcount = Math.ceil(list.length / rowcount);
  return [...Array(rowcount)].map(() => Array(colcount));
}

// Created a grid, where elements are coordinates
function positionGrid(list: DataSet): Grid {
  const xs = list.map((value) => value[0]);
  const ys = list.map((value) => value[1]);
  const xmin: number = Math.min(...xs);
  const xmax: number = Math.max(...xs);
  const ymin: number = Math.min(...ys);
  const ymax: number = Math.max(...ys);
  const grid = makeGrid(list);
  const colcount = grid[0].length;
  const rowcount = grid.length;
  const xwid: number = (xmax - xmin) / colcount;
  const yhei: number = (ymax - ymin) / rowcount;
  console.log({xmin, xmax, ymin, ymax, colcount, rowcount, xwid, yhei});
  for (let r = 0; r < rowcount; r++) {
    const y = Math.round(ymin + yhei * (r + 0.5));
    for (let c = 0; c < colcount; c++) {
      const x = Math.round(xmin + xwid * (c + 0.5));
      grid[r][c] = [x, y];
    }
  }
  return grid;
}

// Place elements randomly in grid
function randomGrid(list: DataSet): Grid {
  const size = gridSize(list);
  const grid: Grid = [...Array(size)].map(() => Array(size));
  let i = 0;
  while (i < list.length) {
    let [x, y] = [size - 1, size - 1];
    while (grid[x][y] != undefined) {
      x = Math.floor(size * Math.random());
      y = Math.floor(size * Math.random());
    }
    grid[x][y] = list[i];
    i++;
  }
  return grid;
}

// Place elements sorted in grid
function sortedGrid(list: DataSet): Grid {
  // Sort by Y
  const sorted: DataSet = list.sort((a, b) => b[1] - a[1]);
  const size: number = gridSize(list);
  const grid: Grid = [...Array(size)].map(() => Array(size));
  const itemsPerRow = sorted.length / size;
  for (
    let i = 0, rowIndex = 0;
    Math.round(i) < sorted.length;
    i += itemsPerRow, rowIndex++
  ) {
    const start = Math.round(i);
    const end = Math.round(i + itemsPerRow);
    const row = sorted.slice(start, end).sort((a, b) => a[0] - b[0]);
    grid[rowIndex] = row;
  }
  return grid;
}

// Attempt to place items at their ideal location
function radarGrid(list: DataSet): Grid {
  const size: number = gridSize(list);
  const colcount = Math.ceil(list.length / size);
  const rowcount = Math.ceil(list.length / colcount);
  console.log({ rowcount, colcount });
  return makeGrid(list);
}

const set = dataset(26);
const grid = sortedGrid(set);
console.table(grid);
const pos = positionGrid(set);
console.table(pos);
