import { FreshContext } from "$fresh/server.ts";
import { load } from "$std/dotenv/mod.ts";
import { Backend, DiskBackend, CachingBackend } from "📚/storage/mod.ts";
import { Community } from "📚/repository/mod.ts";

const env = await load();
const datapath = env["DATAPATH"] as string; 

export interface State {
  context: Context;
}

export class Context {
  private static context: Context;
  private repo: Backend;
  private community: Community;

  public constructor() {
    //console.log("i'm logged during initialization, and not during handling!");
    const diskbackend = new DiskBackend(datapath);
    const cachingbackend = new CachingBackend(diskbackend);
    this.repo = cachingbackend;
    this.community = new Community(this.repo);
  }

  public static async init() {
    Context.context = new Context();
  }

  public static instance() {
    if (this.context) return this.context;
    else throw new Error("Context is not initialized!");
  }
}

export async function handler(
  _req: Request,
  ctx: FreshContext<State>,
) {
  ctx.state.context = Context.instance();
  if (ctx.destination === "route") {
    //console.log("i'm logged during a request!");
    //console.log(ctx.state.context);
  }
  const resp = await ctx.next();
  return resp;
}