"use client";

import { MultiSelect } from "@/components/ui/multi-select";
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

  if (isError || !conferences?.length) return null;

  const options = conferences.map((conf) => ({
    label: conf.name,
    value: conf.id.toString(),
  }));

  return (
    <MultiSelect
      options={options}
      selected={selectedConferences.map((id) => id.toString())}
      onChange={(values) => onConferenceChange(values.map((v) => Number(v)))}
      placeholder="Filter by Conference"
      className="w-[280px]"
    />
  );
}
