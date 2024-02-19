import { ComponentChildren } from "preact";

interface Props {
  children: ComponentChildren;
}

export default function Feature({ children }: Props) {
  return (
    <div class="w-full p-8">
      <div class="rounded-lg bg-neutral-900 overflow-hidden border-green-400 border-2 text-gray-50 p-6 shadow">
        {children}
      </div>
    </div>
  );
}
