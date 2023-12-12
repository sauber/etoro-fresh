import { PageProps } from "$fresh/server.ts";
import Header from "📦/Header.tsx";

export default function Layout({ Component, state }: PageProps) {
  return (
    <div class="h-screen bg-[url('/chartbg.jpg')]">
      <Header />
      <Component />
    </div>
  );
}
