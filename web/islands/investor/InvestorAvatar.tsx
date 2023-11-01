import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { Signal } from "@preact/signals";

interface Props {
  CustomerId: Signal<|null|number>;
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
  const searchUrl = async (): Promise<URL | undefined> => {
    for ( const revision of [9,8,7,6,5,4,3,2,1,0]) {
        const url = makeUrl(revision);
        if (await testUrl(url)) return url;
    }
  };

  useEffect(() => {
    const scanImage = async () => {
      const url = await searchUrl();
      if (url) imageUrl.value = url;
    };
    if ( CustomerId != null ) scanImage();
  }, [CustomerId]);


  if (imageUrl.value != null ) {
    return <img class="h-full inline p-1" src={`${imageUrl}`} />;
  } else {
    return <span>...</span>;
  }
}
