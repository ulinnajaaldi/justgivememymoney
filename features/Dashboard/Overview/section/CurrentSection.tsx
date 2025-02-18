import React from "react";

import { useSearchParams } from "next/navigation";

import {
  HandCoinsIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "@/components/icons";

import { formatDateRange } from "@/lib/utils";

import { DataCard } from "../components/data-card";
import { CurrentSectionProps } from "../types";

const CurrentSection: React.FC<CurrentSectionProps> = ({ data }) => {
  const params = useSearchParams();

  const to = params.get("to") || "";
  const from = params.get("from") || "";

  const dateRangeLabel = formatDateRange({ to, from });

  return (
    <>
      <DataCard
        title="Remaining"
        value={data?.remainingAmmount}
        percentageChange={data?.remainingChange}
        icon={<HandCoinsIcon className="text-blue-500" />}
        variant="default"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Income"
        value={data?.incomeAmmount}
        percentageChange={data?.incomeChange}
        variant="success"
        dateRange={dateRangeLabel}
        icon={<TrendingUpIcon className="text-emerald-500" />}
      />
      <DataCard
        title="Expenses"
        value={data?.expensesAmmount}
        percentageChange={data?.expensesChange}
        icon={<TrendingDownIcon className="text-rose-500" />}
        variant="danger"
        dateRange={dateRangeLabel}
      />
    </>
  );
};

export default CurrentSection;
