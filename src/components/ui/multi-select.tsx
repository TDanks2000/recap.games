import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

const abbreviate = (label: string) => {
  const words = label.split(" ");
  return words
    .map((w) => w[0])
    .join("")
    .toUpperCase();
};

export const MultiSelect = ({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const toggleSelect = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  const handleSelectAll = () => {
    onChange(options.map((o) => o.value));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  const extraSelected = selected.slice(2);
  const extraLabels = extraSelected
    .map((val) => options.find((o) => o.value === val)?.label || val)
    .join(", ");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex flex-wrap items-center gap-1 max-w-[80%] overflow-hidden">
            {selected.length > 0 ? (
              <>
                {selected.slice(0, 2).map((val) => {
                  const label =
                    options.find((o) => o.value === val)?.label || val;
                  return (
                    <Badge key={val} className="text-xs px-2 py-0.5">
                      {abbreviate(label)}
                    </Badge>
                  );
                })}
                {selected.length > 2 && (
                  <span
                    className="text-muted-foreground text-xs pl-2 flex items-center"
                    title={extraLabels}
                  >
                    +{selected.length - 2} more
                  </span>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search..."
            value={query}
            onValueChange={setQuery}
            className="border-b"
          />
          <CommandGroup heading="Actions">
            <CommandItem onSelect={handleSelectAll}>Select All</CommandItem>
            <CommandItem onSelect={handleClearAll}>Clear All</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Options">
            {filteredOptions.length ? (
              filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => toggleSelect(option.value)}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                      selected.includes(option.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50"
                    )}
                  >
                    {selected.includes(option.value) && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                  {option.label}
                </CommandItem>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                No options found
              </div>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
