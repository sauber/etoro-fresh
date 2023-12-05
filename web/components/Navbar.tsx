export interface AppHeaderProps {
  isHome: boolean;
}

export default function AppHeader({ isHome }: AppHeaderProps) {
  return (
    <header class="bg-black bg-opacity-90 backdrop-blur-md px-4 sticky top-0 z-10 shadow-lg">
      <div class="container flex items-center justify-between flex-shrink mx-auto">
        <h1 class="font-sans font-semibold text-white text-opacity-90 text-2xl select-none whitespace-nowrap pr-2 leading-loose">
          {isHome
            ? "💹 Etoro Copy Investment"
            : <a href="/" title="Return to gallery">{"← Deno Artwork"}</a>}
        </h1>
      </div>
    </header>
  );
}