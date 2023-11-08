import { format } from "format";

export class ProgressBar {
  private readonly start = new Date().getTime();
  private readonly encoder = new TextEncoder();

  constructor(private readonly title: string, private readonly total: number) {}

  /** Calculate epoch ms for estimated eta */
  private eta(count: number): number {
    const now = new Date().getTime();
    // how many ms since start
    const gone = now - this.start;
    // Ratio of completion
    const ratio = count / this.total;
    // how many ms remaining
    const remain = gone / ratio - gone;
    const eta = now + remain;
    return Math.round(eta);
  }

  private formatTime(ms: number): string {
    return format(new Date(ms), "MM-dd HH:mm:ss");
  }

  private formatCount(count: number): string {
    return `[${count}/${this.total}]`;
  }

  private formatLine(count: number): string {
    const con = this.formatCount(count);
    const tim = this.formatTime(this.eta(count));
    return `${this.title} ${con} ETA ${tim}`;
  }

  public async update(count: number): Promise<void> {
    if (count > 0) {
      const widgetText = this.formatLine(count);
      const text = `\r${widgetText}\x1b[?25l`;
      await Deno.stdout.write(this.encoder.encode(text));
    }
  }

  public sync_update(count: number): void {
    if (count > 0) {
      const widgetText = this.formatLine(count);
      const text = `${widgetText}\x1b[?25l`;
      console.log(text);
    }
  }

  public async finish(): Promise<void> {
    await Deno.stdout.write(this.encoder.encode("\x1b[?25h\n"));
  }
}