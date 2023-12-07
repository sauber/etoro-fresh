import { ComponentChildren } from "preact";

interface Props {
  children: ComponentChildren;
}

export default function Card({ children }: Props) {
  return (
    <div class="rounded-md bg-gray-700 overflow-hidden inline-block top-0">
      <div class="rounded-md text-gray-50 overflow-hidden border-green-500 border-2 m-1 p-1 top-0">
        {children}
      </div>
    </div>
  );
}
