/** RGB color, each channel value in range 0-255 */
export class Color {
  constructor(
    private readonly r: number,
    private readonly g: number,
    private readonly b: number,
  ) {}

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

  /** A random color */
  static get random(): Color {
    return new Color(
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    );
  }
}
