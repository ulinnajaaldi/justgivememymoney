import React from "react";

import { Banknote, TrendingDown, TrendingUp } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { formatDateRange } from "@/lib/utils";

import { DataCard } from "../components/data-card";
import { CurrentSectionProps } from "../types";

const CurrentSection: React.FC<CurrentSectionProps> = ({ data }) => {
  const params = useSearchParams();

  const to = params.get("to") || new Date().toISOString();
  const from = params.get("from") || new Date().toISOString();

  const dateRangeLabel = formatDateRange({ to, from });

  return (
    <>
      <DataCard
        title="Remaining"
        value={data?.remainingAmmount}
        percentageChange={data?.remainingChange}
        icon={Banknote}
        variant="default"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Income"
        value={data?.incomeAmmount}
        percentageChange={data?.incomeChange}
        icon={TrendingUp}
        variant="success"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Expenses"
        value={data?.expensesAmmount}
        percentageChange={data?.expensesChange}
        icon={TrendingDown}
        variant="danger"
        dateRange={dateRangeLabel}
      />
    </>
  );
};

export default CurrentSection;
