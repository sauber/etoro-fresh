import { Community } from "📚/repository/mod.ts";
import { Investor } from "📚/investor/mod.ts";
import type { DateFormat } from "📚/time/mod.ts";
import { diffDate } from "📚/time/mod.ts";
import { Features } from "📚/ranking/features.ts";
import { Chart } from "📚/chart/mod.ts";
import type { Input, Inputs, Output, Outputs } from "./mod.ts";
import type { Names } from "📚/repository/community.ts";

// Combine input and output records
type Sample = {
  input: Input;
  output: Output;
};

/** Prepare data for training models */
export class TrainingData {
  readonly samples: Array<Sample> = [];

  /**
   * @param community - Investor Community objects
   * @param window - Minimum number of chart values available after date of stats for calculating SharpeRatio
   */
  constructor(
    private readonly community: Community,
    private readonly window = 30,
  ) {}

  /** Load features and sharperatio for an investor */
  private async investor(name: string): Promise<void> {
    const investor: Investor = await this.community.investor(name);
    const dates: DateFormat[] = investor.stats.dates;
    const chart: Chart = investor.chart;
    const end: DateFormat = chart.end;

    // Test if each date of where stats are available have
    // enough data available for calculating SharpeRatio
    dates.filter((date) => diffDate(date, end) >= this.window).forEach(
      (date) => {
        const features: Features = new Features(investor);
        const input: Input = features.input(date);
        const output: Output = features.output(date);
        this.samples.push({ input, output });
      },
    );
  }

  /** Load in data from investor community */
  public async load(): Promise<void> {
    const names: Names = await this.community.allNames();
    await Promise.all(names.map((name) => this.investor(name)));
  }

  /** Names of columns in input data */
  public get keys(): string[] {
    return Object.keys(this.samples[0].input);
  }

  /** List of training input data */
  public get inputs(): Inputs {
    return this.samples.map((sample: Sample) => sample.input);
  }

  /** List of SharpeRatio matching input data */
  public get outputs(): Outputs {
    return this.samples.map((sample: Sample) => [sample.output[0]]);
  }
}
