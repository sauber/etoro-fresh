import { PageProps } from "$fresh/server.ts";
import Header from "📦/Header.tsx";

export default function Layout({ Component, state }: PageProps) {
  return (
    <div class="h-screen bg-gray-500">
      <Header />
      <Component />
    </div>
  );
}
