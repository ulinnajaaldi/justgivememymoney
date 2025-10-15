"use client";

import * as React from "react";

import { Icon, loadIcons } from "@iconify/react";
import { CheckIcon, ChevronsUpDownIcon, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useIconifySearch } from "@/hook/useIconifySearch";

import { cn } from "@/lib/utils";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { ScrollArea } from "../ui/scroll-area";
import { Spinner } from "../ui/spinner";

interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
  color?: string;
  disabled?: boolean;
  /** Optional: limit results to a single icon set (e.g., "mdi", "tabler"). Omit for global search. */
  collection?: string;
}

const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onChange,
  color = "#171717",
  disabled = false,
  collection,
}) => {
  const [open, setOpen] = React.useState(false);
  const [term, setTerm] = React.useState("");

  const { iconIds, loading } = useIconifySearch(term, {
    prefix: collection, // undefined => global search
    limit: 72,
  });

  // Preload visible icons so they render instantly
  React.useEffect(() => {
    if (iconIds.length) loadIcons(iconIds);
  }, [iconIds]);

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setTerm(""); // clear term on close (optional)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between text-xs md:text-sm"
          disabled={disabled}
        >
          {value ? (
            <span className="flex items-center gap-2">
              <Icon icon={value} width={20} height={20} color={color} />
              <span className="text-muted-foreground max-w-[120px] truncate text-xs md:text-sm">
                {value}
              </span>
            </span>
          ) : (
            "Select Icon…"
          )}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="z-[9999] w-[200px] p-0 sm:w-[340px]"
        align="start"
      >
        <div>
          <InputGroup className="border-none shadow-none drop-shadow-none has-[[data-slot=input-group-control]:focus-visible]:border-none has-[[data-slot=input-group-control]:focus-visible]:border-transparent has-[[data-slot=input-group-control]:focus-visible]:ring-0">
            <InputGroupInput
              placeholder="Search Icon"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              // no focus style on input, we handle focus style on the group
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon
              align="inline-end"
              className={cn(loading ? "opacity-100" : "opacity-0")}
            >
              <Spinner />
            </InputGroupAddon>
          </InputGroup>

          <ScrollArea className="h-[300px]">
            <div className="p-2">
              {iconIds.length === 0 && term ? (
                <div className="text-muted-foreground py-6 text-center text-sm">
                  {loading ? "Searching..." : "No icons found."}
                </div>
              ) : iconIds.length === 0 ? (
                <div className="text-muted-foreground py-6 text-center text-xs md:text-sm">
                  Start typing to search icons...
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                  {iconIds.map((iconId) => (
                    <button
                      key={iconId}
                      type="button"
                      onClick={() => {
                        onChange(iconId);
                        setOpen(false);
                        setTerm("");
                      }}
                      className={cn(
                        "hover:bg-accent hover:text-accent-foreground flex flex-col items-center gap-1 rounded-md p-2 text-xs transition-colors",
                        value === iconId && "bg-accent text-accent-foreground",
                      )}
                      title={iconId}
                    >
                      <Icon
                        icon={iconId}
                        width={24}
                        height={24}
                        color={color}
                      />
                      <span className="max-w-full truncate text-[10px]">
                        {iconId.split(":")[1] || iconId}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default IconPicker;
