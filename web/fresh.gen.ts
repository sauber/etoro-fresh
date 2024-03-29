// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_layout from "./routes/_layout.tsx";
import * as $about from "./routes/about.tsx";
import * as $community_all from "./routes/community/all.tsx";
import * as $community_index from "./routes/community/index.tsx";
import * as $community_latest from "./routes/community/latest.tsx";
import * as $index from "./routes/index.tsx";
import * as $investor_username_ from "./routes/investor/[username].tsx";
import * as $ranking from "./routes/ranking.tsx";
import * as $simulation from "./routes/simulation.tsx";
import * as $investor_Avatar from "./islands/investor/Avatar.tsx";
import * as $investor_Chart from "./islands/investor/Chart.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/_layout.tsx": $_layout,
    "./routes/about.tsx": $about,
    "./routes/community/all.tsx": $community_all,
    "./routes/community/index.tsx": $community_index,
    "./routes/community/latest.tsx": $community_latest,
    "./routes/index.tsx": $index,
    "./routes/investor/[username].tsx": $investor_username_,
    "./routes/ranking.tsx": $ranking,
    "./routes/simulation.tsx": $simulation,
  },
  islands: {
    "./islands/investor/Avatar.tsx": $investor_Avatar,
    "./islands/investor/Chart.tsx": $investor_Chart,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
