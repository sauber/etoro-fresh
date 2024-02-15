/*
export default async function CustomerId(req: Request, ctx: RouteContext) {
  const p = new Promise((resolve) => resolve(42));
  const value: number = await p;
  return <p>foo is: {value}</p>;
}

export default function CustomerId() {
  return <p>foo</p>;
}

*/

import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";

interface Project {
  name: string;
  stars: number;
}

export const handler: Handlers<Project> = {
  GET(_req, ctx) {
    const project: Project = { name: "Nammy", stars: 5 };
    return ctx.render(project);
  },
};

export default function ProjectPage(props: PageProps<Project>) {
  return (
    <div>
      <h1>Name goes here</h1>
      <p>stars</p>
    </div>
  );
}
