import { Chart } from "📚/chart/mod.ts";
import { Diary } from "📚/investor/diary.ts";
import type { StatsExport, InvestorId } from "../repository/mod.ts";
import { DateFormat } from "📚/utils/time/mod.ts";

export class Investor {
  constructor(
    public readonly UserName: string,
    public readonly CustomerID: number,
    public readonly FullName: string | undefined,
    public readonly chart: Chart,
    public readonly mirrors: Diary<InvestorId[]>,
    public readonly stats: Diary<StatsExport>,
  ){}

  /** Confirm if investor has valid data on this date */
  active(date: DateFormat): boolean {
    if ( this.chart.start <= date && this.chart.end >= date) return true;
    else return false;
  }
}