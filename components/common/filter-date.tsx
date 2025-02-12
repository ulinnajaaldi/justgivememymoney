"use client";

import React, { useState } from "react";

import { format, subDays } from "date-fns";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useMediaQuery } from "@/hook/useMediaQuery";

import { formatDateRange } from "@/lib/utils";

const FilterDate: React.FC<{
  disabled?: boolean;
}> = ({ disabled }) => {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;
  const account = params.get("accountId") || "all";

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const isMobile = useMediaQuery("(max-width: 980px)");

  const paramState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  };

  const [date, setDate] = useState<DateRange | undefined>(paramState);

  const pushToUrl = (dateRange: DateRange | undefined) => {
    const query = {
      accountId: account === "all" ? "" : account,
      from: format(dateRange?.from || defaultFrom, "yyyy-MM-dd"),
      to: format(dateRange?.to || defaultTo, "yyyy-MM-dd"),
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipEmptyString: true, skipNull: true },
    );

    router.push(url);
  };

  const onReset = () => {
    setDate(undefined);
    pushToUrl(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="w-full sm:w-auto"
        >
          <span>{formatDateRange(paramState)}</span>
          <ChevronDown className="ml-2 h-5 w-5 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full" align="end">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={isMobile ? 1 : 2}
        />
        <div className="grid grid-cols-2 gap-5">
          <PopoverClose asChild>
            <Button
              onClick={onReset}
              variant="outline"
              disabled={!date?.from || !date?.to || disabled}
            >
              Reset
            </Button>
          </PopoverClose>
          <Button
            onClick={() => {
              pushToUrl(date);
            }}
            variant="default"
            disabled={!date?.from || !date?.to || disabled}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterDate;
