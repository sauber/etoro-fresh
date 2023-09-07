import { useState } from "preact/hooks";
import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    const { id } = ctx.params;
    return ctx.render({
      content: `Hello Post ${id} 📝`,
    });
  }
};

export default function PostPage(props: PageProps) {
  const [post, setPost] = useState<any>();
  setPost(props.data);

  if(!post) { 
    return <div>Loading...</div>
  }
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1>{post.content}</h1>
    </div>
  )
}