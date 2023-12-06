import { ComponentChildren } from "preact";

interface Props {
  children: ComponentChildren;
}

export default function Feature({ children }: Props) {
  return (
    <div class="rounded-lg bg-neutral-900 overflow-hidden border-white border-2 inline-block text-gray-50 p-6 m-8 shadow">
      {children}
    </div>
  );
}
