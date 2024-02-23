import { repo } from "📚/repository/testdata.ts";
import { Community } from "📚/repository/mod.ts";
import type { Investors } from "📚/repository/mod.ts";

const community = new Community(repo);
export const investors: Investors = await community.all();