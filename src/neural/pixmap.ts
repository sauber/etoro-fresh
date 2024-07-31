import { bgRgb24, rgb24 } from "$std/fmt/colors.ts";

/** RGB color, each channel value in range 0-255 */
export class Color {
  /** Average of channel values */
  public readonly brightness: number;

  constructor(
    private readonly r: number,
    private readonly g: number,
    private readonly b: number,
  ) {
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw new Error(
        `Error: (r:${r},g:${g},b:${b}) not in range(r:[0-255],g:[0-255],b:[0-255])`,
      );
    }
    this.brightness = (r + g + b) / 3;
  }

  public get rgb(): { r: number; g: number; b: number } {
    return { r: this.r, g: this.g, b: this.b };
  }

  /** Are to colors same */
  public equals(other: Color): boolean {
    return this.r === other.r && this.g === other.g && this.b === other.b;
  }

  /** Sum of squared differences for each channel */
  public distance(other: Color): number {
    const sqr = (n: number) => n * n;
    const d: number = sqr(this.r - other.r) + sqr(this.g - other.g) +
      sqr(this.b - other.b);
    return d;
  }

  /** Sort colors by brightness */
  static sort(colors: Array<Color>): Array<Color> {
    return colors.sort((a, b) => a.brightness - b.brightness);
  }

  /** Average of multiple colors */
  static average(colors: Array<Color>): Color {
    if (!colors.length) {
      throw new Error(`Error Average requires at least 1 argument.`);
    }
    return new Color(
      Math.round(
        colors.map((c) => c.r).reduce((s, a) => s + a) / colors.length,
      ),
      Math.round(
        colors.map((c) => c.g).reduce((s, a) => s + a) / colors.length,
      ),
      Math.round(
        colors.map((c) => c.b).reduce((s, a) => s + a) / colors.length,
      ),
    );
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
export type Pixels = Array<Pixel>;

/** Position and color */
export class Pixel {
  constructor(
    public readonly position: Position,
    public readonly color: Color,
    public readonly index: number,
  ) {}
}

////////////////////////////////////////////////////////////////////////

/** Grid of pixels */
export class PixMap {
  private readonly pixels: Array<Array<Color>> = [];

  /** Create [x,y] sized black-filled pixel map */
  constructor(
    /** Number of x positions */
    private readonly cols: number,
    /** Number of y positions, must be even number */
    private readonly rows: number,
  ) {
    const black = Color.black;
    // this.pixels = new Array(columns * rows).fill(black);
    for (let x = 0; x < cols; ++x) {
      for (let y = 0; y < rows; ++y) {
        // console.log({x, y, black});
        this.set(x, y, black);
      }
    }
  }

  /** Set color at position */
  public set(x: number, y: number, color: Color): void {
    // Verify position is in range
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) {
      throw new Error(
        `Error: (x:${x},y:${y}) out of range (x:[0-${this.cols - 1}],y:[0-${
          this.rows - 1
        }])`,
      );
    }

    // Create row
    if (!this.pixels[y]) this.pixels[y] = [];

    // Set color
    this.pixels[y][x] = color;
  }

  /** Get color at position */
  public get(x: number, y: number): Color {
    return this.pixels[y][x];
  }

  // Split pixmap into 2x2 blocks
  private get blocks(): BlockPixMap[][] {
    const lines = [];
    for (let row = this.rows - 2; row >= 0; row -= 2) {
      const line: Array<BlockPixMap> = [];
      for (let col = 0; col < this.cols; col += 2) {
        line.push(
          new BlockPixMap(
            this.get(col, row + 1),
            this.get(col + 1, row + 1),
            this.get(col, row),
            this.get(col + 1, row),
          ),
        );
      }
      lines.push(line);
    }
    return lines;
  }

  /** Convert pixmap to string printable on console */
  public toString(): string {
    return this.blocks.map((line) =>
      line.map((block) => block.toString()).join("")
    ).join("\n");
  }
}

////////////////////////////////////////////////////////////////////////

/** 2x2 pixel map */
export class BlockPixMap extends PixMap {
  /** List of pixels */
  private readonly block: Pixels;

  constructor(
    topleft: Color,
    topright: Color,
    bottomleft: Color,
    bottomright: Color,
  ) {
    super(2, 2);

    // List of pixels
    this.block = [
      new Pixel([0, 0], topleft, 0),
      new Pixel([1, 0], topright, 1),
      new Pixel([0, 1], bottomleft, 2),
      new Pixel([1, 1], bottomright, 3),
    ];

    // Create pixmap
    this.block.forEach((pixel) => this.set(...pixel.position, pixel.color));
  }

  public toString(): string {
    // Sort pixels by bightness, darkest first
    const sorted: Pixels = this.block.slice().sort((a, b) =>
      a.color.brightness - b.color.brightness
    );

    // Identify the darkest pixels
    const dark: Pixels = [sorted.shift() as Pixel];

    // Identify all pixels with color equal to darkest
    while (sorted.length && sorted[0].color.equals(dark[0].color)) {
      dark.push(sorted.shift() as Pixel);
    }

    // If all pixels are identical, then only set background color and displace a blank char
    if (dark.length === 4) {
      const bgColor: Color = dark[0].color;
      return bgRgb24(" ", bgColor.rgb);
    }

    // Identify brightest pixel
    const bright: Pixels = [sorted.pop() as Pixel];

    // For remaining pixels, test if they are most close the darkest or
    // brightst pixel, and add to respective groups
    sorted.forEach((pixel) => {
      if (
        pixel.color.distance(dark[0].color) <
          pixel.color.distance(bright[0].color)
      ) {
        dark.push(pixel);
      } else {
        bright.push(pixel);
      }
    });

    // Average of dark and bright colors
    const bg: Color = Color.average(dark.map((p) => p.color));
    const fg: Color = Color.average(bright.map((p) => p.color));

    // Pick block element to represent brigtest pixels
    const elementIndex: number = bright.map((p) => p.index).reduce(
      (s, a) => s + (2 ** a),
      0,
    );
    const chars = " ▘▝▀▖▌▞▛▗▚▐▜▄▙▟█";
    const element = chars.substring(elementIndex, elementIndex + 1);

    // Color code background and foreground
    return bgRgb24(rgb24(element, fg.rgb), bg.rgb);
  }
}
