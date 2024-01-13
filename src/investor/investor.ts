import { Chart } from "📚/chart/mod.ts";
import { Diary } from "📚/investor/diary.ts";
import type { StatsExport, InvestorId } from "../repository/mod.ts";
import { DateFormat } from "📚/utils/time/mod.ts";

export class Investor {
  constructor(
    private readonly UserName: string,
    private readonly CustomerID: number,
    private readonly FullName: string | undefined,
    private readonly chart: Chart,
    private readonly mirrors: Diary<InvestorId[]>,
    private readonly stats: Diary<StatsExport>,
  ){}

  /** Confirm if investor has valid data on this date */
  active(date: DateFormat): boolean {
    if ( this.chart.start <= date && this.chart.end >= date) return true;
    else return false;
  }
}