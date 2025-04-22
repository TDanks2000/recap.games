import type { conferences, games, streams } from "@/server/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import CardHeader from "./CardHeader";
import DateTimeDetails from "./DateTimeDetails";

interface ConferenceCardProps extends InferSelectModel<typeof conferences> {
  games?: Array<InferSelectModel<typeof games>> | null;
  steams?: Array<InferSelectModel<typeof streams>> | null;
}

const ConferenceCard = (conference: ConferenceCardProps) => {
  return (
    <div className="relative flex w-full transform flex-col gap-1.5 rounded-md bg-muted p-2 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus-visible:scale-[1.02] focus-visible:shadow-lg">
      <CardHeader {...conference} />
      <DateTimeDetails {...conference} />
    </div>
  );
};

export default ConferenceCard;
