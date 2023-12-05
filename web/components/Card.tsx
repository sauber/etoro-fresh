import { ComponentChildren } from "preact";

interface Props {
  children: ComponentChildren;
}

export default function Card({ children }: Props) {
  return (
    <div class="rounded-md bg-green-200 overflow-hidden border-green-800 border-2 inline-block">
      {children}
    </div>
  );
}
