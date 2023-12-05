export interface CommunityProps {
  label: string;
  value: (string|number);
}

export default function Value({ label, value }: CommunityProps) {
  return (
    <p class="font-jost text-sm p-1"><strong>{label}</strong>: {value}</p>
  );
}