import { PageProps } from "$fresh/server.ts";
import Header from "../components/ux/Header.tsx";

export default function Layout({ Component, state }: PageProps) {
  return (
    <div class="bg-[url('/chartbg.jpg')]">
      <Header />
      <Component />
    </div>
  );
}