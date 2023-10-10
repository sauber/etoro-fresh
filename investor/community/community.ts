export type Names = string[];

export interface CommunityRepo {
  last(): Promise<Names>;
}

/** Use cases for list of investors */
export class Community {
  constructor(private readonly repo: CommunityRepo) {}

  last(): Promise<Names> {
    return this.repo.last();
  }
}