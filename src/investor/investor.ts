import { Chart } from "📚/chart/mod.ts";
import { Diary } from "📚/investor/diary.ts";
import type { StatsExport, InvestorId } from "../repository/mod.ts";

export class Investor {
  constructor(
    private readonly UserName: string,
    private readonly CustomerID: number,
    private readonly FullName: string | undefined,
    private readonly chart: Chart,
    private readonly mirrors: Diary<InvestorId[]>,
    private readonly stats: Diary<StatsExport>,
  ){}
}