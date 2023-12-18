import { Strategy } from "./mod.ts";
import type { Positions } from "./mod.ts";
import { Community } from "/investor/mod.ts";

/** No buying and no selling */
export class NullStrategy extends Strategy {
  constructor(readonly positions: Positions, readonly community: Community) {
    super(positions, community);
  }

  /** Buy nothing */
  public open(): Positions {
    return [];
  }

  /** Sell nothing */
  public close(): Positions {
    return [];
  }
}
