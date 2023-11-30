import { defineLayout } from "$fresh/server.ts";
import AppHeader from "📦/Navbar.tsx";

export default defineLayout(async (req, ctx) => {
  const { pathname } = new URL(req.url);
  const isHome = pathname === "/";

  return (
    <div class="relative bg-neutral-500 min-h-screen flex flex-col">
      <AppHeader {...{ isHome }} />
      <div className="flex-grow z-0">
        <ctx.Component />
      </div>
    </div>
  );
});
