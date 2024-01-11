import { Chart } from "📚/chart/mod.ts";
//import { Stats } from "📚/investor/mod.ts";

export class Investor {
  constructor(
    private readonly UserName: string,
    private readonly CustomerID: number,
    private readonly FullName?: string,
    private readonly chart: Chart,
    //private readonly mirrors: Mirrors,
    //private readonly stats: Stats,
  ){}
}