import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = { 
  async POST(req: Request) {
    try {
      const body = await req.json();

      const authUser = { secret: "" };
      if ( body.email && body.password ) {
        authUser.secret = "abc";
      }

      return Response.json({
        data: {
          token: authUser.secret,
        }
      });
    } catch (error) {
      console.log('==>>>', error);
      return Response.json({
        error: error.message,
      });
    }
  }
};