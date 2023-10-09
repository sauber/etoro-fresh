import { Handlers } from "$fresh/server.ts";
import { Repo } from "/utils/repo/repo.ts";

type User = {
  id: string;
  name: string;
};


export const handler: Handlers<string, { repo: Repo }> = {
  async GET(_req: Request, ctx) {
    //console.log('ctr: ', ctx);
    
    const { folder, filename } = ctx.params;
    const repo: Repo = ctx.state.repo;
    const content: string = await repo.files.sub(folder).read(filename);
    return new Response(content, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async POST(req, _ctx) {
    const user = (await req.json()) as User;
    const ok = false;
    if (!ok) throw new Error("Something went wrong.");
    return new Response(JSON.stringify(user));
  },
};
