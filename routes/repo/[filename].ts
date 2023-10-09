import { Handlers } from "$fresh/server.ts";
import Files from "files";

type User = {
  id: string;
  name: string;
};


export const handler: Handlers<string, { data: Files }> = {
  async GET(_req: Request, ctx) {
    //console.log('ctr: ', ctx);
    
    const filename = ctx.params.filename;
    const files: Files = ctx.state.data;
    const content: string = await files.read(filename);
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
