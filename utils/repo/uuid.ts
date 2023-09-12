import { Asset } from "./asset.ts";

export class UUID extends Asset<string> {
  readonly filename = '';

  latest(): Promise<string> {
    return this.repo.config.get('uuid') as Promise<string>;  
  }

  async recent(): Promise<string> {
    const latest: string = await this.latest();
    if ( latest ) return latest;
    
    const new_uuid: string = crypto.randomUUID();
    await this.repo.config.set('uuid', new_uuid);
    return new_uuid;
  }
}
