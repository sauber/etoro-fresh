import { RepoDiskBackend } from "./repo-disk.ts";
import { Config } from "./config.ts";
import { InvestorId } from "./repo.d.ts";

export const repoBackend = new RepoDiskBackend("infrastructure/repo/testdata");
export const config = new Config(repoBackend);

export const investorId: InvestorId = {
  UserName: await config.get('UserName') as string,
  CustomerId: await config.get('CustomerId') as number,
}
