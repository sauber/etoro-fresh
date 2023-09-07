import { PageProps } from "$fresh/server.ts";
import { Fragment } from "preact";
import { HandlerContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req: Request, ctx: HandlerContext) {
    console.log('Inside GET handler');
    return ctx.render({
      message: "Hello New Post 📝",
    });
  },
};

export default function NewPostPage(props: PageProps) {
  return (
    <Fragment>
      <div class="p-4 mx-auto max-w-screen-md">
      </div>
    </Fragment>
  )
}