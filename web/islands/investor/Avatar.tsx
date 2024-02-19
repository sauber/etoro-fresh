import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { Signal } from "@preact/signals";

interface Props {
  CustomerId: number;
}

export default function InvestorItem({ CustomerId }: Props) {
  const imageUrl = useSignal<URL | null>(null);

  // Generate URL for avatar
  const makeUrl = (revision: number): URL => {
    if (revision == 0) {
      return new URL(
        `https://etoro-cdn.etorostatic.com/avatars/150X150/${CustomerId}.jpg`,
      );
    }
    return new URL(
      `https://etoro-cdn.etorostatic.com/avatars/150X150/${CustomerId}/${revision}.jpg`,
    );
  };

  // Confirm if an image exists
  const testUrl = async (url: URL): Promise<boolean> => {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  };

  // Search for the most recent image that exists
  const searchUrl = async (): Promise<URL | null> => {
    for (const revision of [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]) {
      const url = makeUrl(revision);
      if (await testUrl(url)) return url;
    }
    return null;
  };

  /** Cache URL */
  const cachedUrl = async (): Promise<URL | null> => {
    const key = "avatar_" + CustomerId;
    const url = localStorage.getItem(key);

    // A previous URL is cached
    if ( url?.length ) return url.length ? new URL(url) : null;

    // No cached URL, search for one
    const searched: URL | null = await searchUrl();
    if (searched) {
      localStorage.setItem(key, searched.toString());
    } else {
      localStorage.setItem(key, "");
    }

    return searched;
  };

  useEffect(() => {
    const scanImage = async () => {
      const url = await cachedUrl();
      if (url) imageUrl.value = url;
    };
    if (CustomerId != null) scanImage();
  }, [CustomerId]);

  if (imageUrl.value != null) {
    return <img class="h-full" src={`${imageUrl}`} />;
  } else {
    return (
      
        <img class="h-full" src="/8991202.png" />
      
    );
  }
}
