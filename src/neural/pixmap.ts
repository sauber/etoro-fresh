/** RGB color, each channel value in range 0-255 */
export class Color {
  constructor(
    private readonly r: number,
    private readonly g: number,
    private readonly b: number,
  ) {
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw new Error(
        `(r:$r,g:$g,b:$b) not in range(r:[0-255],g:[0-255],b:[0-255])`,
      );
    }
  }

  /** Sum of squared difference for each channel */
  public distance(other: Color): number {
    const sqr = (n: number) => n * n;
    const d: number = sqr(this.r - other.r) + sqr(this.g - other.g) +
      sqr(this.b - other.b);
    return d;
  }

  /** Average of channel values */
  public get brightness(): number {
    return (this.r + this.g + this.b) / 3;
  }

  /** Sort colors by brightness */
  static sort(colors: Array<Color>): Array<Color> {
    return colors.sort((a, b) => a.brightness - b.brightness);
  }

  /** Black color */
  static get black(): Color {
    return new Color(0, 0, 0);
  }

  /** White color */
  static get white(): Color {
    return new Color(255, 255, 255);
  }

  /** A random color */
  static get random(): Color {
    return new Color(
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    );
  }
}

////////////////////////////////////////////////////////////////////////

/** [x, y] position in grid */
export type Position = [number, number];

/** Position and color */
export class Pixel {
  constructor(
    private readonly position: Position,
    private readonly color: Color,
  ) {}
}

////////////////////////////////////////////////////////////////////////

/** Grid of pixels */
export class PixMap {
  private readonly pixels: Array<Array<Color>> = [];

  /** Create [x,y] sized black-filled pixel map */
  constructor(
    private readonly cols: number,
    private readonly rows: number,
  ) {
    const black = Color.black;
    // this.pixels = new Array(columns * rows).fill(black);
    for ( let x = 0; x<rows; ++x) {
      for ( let y = 0; y<cols; ++y) {
        this.set(x, y, black);
      }
    }
  }


  /** Set color at position */
  public set(x: number, y: number, color: Color): void {
    // Verify position is in range
    if ( x<0||x>=this.cols||y<0||y>=this.rows) throw new Error(`Error: (x:${x},y:${y}) out of range (x:[0-${this.cols-1}],y:[0-${this.rows-1}])`);

    // Create row
    if ( ! this.pixels[y]) this.pixels[y] = [];

    // Set color
    this.pixels[y][x] = color;
  }

  /** Get color at position */
  public get(x: number, y: number): Color {
    return     this.pixels[y][x];

  }

}

////////////////////////////////////////////////////////////////////////

/** 2x2 pixel map */
export class BlockPixMap extends PixMap {
  constructor(
    topleft: Color,
    topright: Color,
    bottomleft: Color,
    bottomright: Color,
  ) {
    super(2, 2);
    this.set(0, 0, topleft);
    this.set(1, 0, topright);
    this.set(0, 1, bottomleft);
    this.set(1, 1, bottomright);
  }
}
