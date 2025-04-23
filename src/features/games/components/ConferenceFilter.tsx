"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";

type ConferenceFilterProps = {
  selectedConferences: number[];
  onConferenceChange: (conferences: number[]) => void;
};

export default function ConferenceFilter({
  selectedConferences,
  onConferenceChange,
}: ConferenceFilterProps) {
  const { data: conferences, isError } = api.conference.getAll.useQuery();

  const isErrored = isError || !conferences?.length;

  return (
    <Select
      disabled={isErrored}
      value={selectedConferences[selectedConferences.length - 1]?.toString()}
      onValueChange={(value) => {
        const conferenceId = Number(value);
        const newConferences = selectedConferences.includes(conferenceId)
          ? selectedConferences.filter((id) => id !== conferenceId)
          : [...selectedConferences, conferenceId];
        onConferenceChange(newConferences);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={"Filter by Conference"} />
      </SelectTrigger>
      <SelectContent>
        {!!conferences?.length ? (
          conferences?.map((conference) => (
            <SelectItem key={conference.id} value={conference.id.toString()}>
              {conference.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem
            disabled
            value="0"
            className="w-full flex justify-center text-center flex-1 items-center"
          >
            No conferences found
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
