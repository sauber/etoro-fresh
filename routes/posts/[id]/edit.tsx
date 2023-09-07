import { Handlers, PageProps } from "$fresh/server.ts";
import { Fragment } from "preact";

export const handler: Handlers = {
  GET(_req, ctx) {
    const { id } = ctx.params;
    return ctx.render({
      data: { id },
    });
  },
};

export default function EditPostPage(props: PageProps) {
  return (
    <Fragment>
      <div class="p-4 mx-auto max-w-screen-md">
      </div>
    </Fragment>
  )
}