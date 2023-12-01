import { DateFormat } from "/utils/time/mod.ts";

export interface CommunityProps {
  date: DateFormat;
}

export default function Updated({ date }: CommunityProps) {
  return (
    <div>
      Updated: {date}
    </div>
  );
}