import Feature from "📦/ux/Feature.tsx";

import Card from "📦/ux/Card.tsx";

export default function Community() {
  return (
    <div class="page">
      <Feature>

      <h1>Community Page</h1>
      <Card>
          <a href="/community/all">All</a>
        </Card>

        <Card>
          <a href="/community/latest">Latest</a>
        </Card>
      </Feature>
    </div>
  );
}
