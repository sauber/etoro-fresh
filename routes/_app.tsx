import { AppProps } from "$fresh/server.ts";
import Navbar from "../components/Navbar.tsx";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>my-project</title>
      </head>
      <body>
        <Navbar />
        <Component />
      </body>
    </html>
  );
}
