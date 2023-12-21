import { Position } from "./position.ts";
import type { DateFormat } from "/utils/time/mod.ts";

export type Positions = Array<Position>;

/** A collection of positions */
export class Portfolio {
  private readonly positions: Positions = [];

  /** Add new position to collection */
  public add(position: Position): void {
    this.positions.push(position);
    // console.log('portfolio add', position.date, position.name, this.positions.length);
  }

  /** Remove matching position */
  public remove(position: Position): boolean {
    const id = position.id;
    const p = this.positions;
    //console.log('portfolio remove position count', p.length);
    for (let i = 0; i < p.length; i++) {
      const pos = p[i];
      //console.log('portfolio remove compare id', pos.id, id);
      if (pos.id === id) {
        //console.log('portfolio remove position id matches');
        p.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  /** Count of positions */
  public get length(): number {
    return this.positions.length;
  }

  /** Sum of position amounts */
  public get invested(): number {
    return this.positions.reduce(
      (sum: number, position: Position) => sum + position.amount,
      0
    );
  }

  /** Calculate combined profit on date */
  public profit(date: DateFormat): number {
    return this.positions.reduce(
      (sum: number, position: Position) => sum + position.profit(date),
      0
    );
  }

  /** Current sum of values for each position */
  public value(date: DateFormat): number {
    return this.invested + this.profit(date);
  }

  /** List of all expired positions */
  public expired(date: DateFormat): Positions {
    const keep = this.positions;
    const removed: Positions = [];
    for (let i = keep.length - 1; i >= 0; i--) {
      const pos: Position = keep[i];
      if (!pos.valid(date)) {
        //console.log(date, 'expire position', pos.name, pos.date);
        //keep.splice(i, 1);
        removed.unshift(pos);
      }
    }
    //console.log(date, 'expire', removed.length, 'positions');
    return removed;
  }
}
