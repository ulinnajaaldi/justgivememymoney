"use client";

import React from "react";

import { useSearchParams } from "next/navigation";

import { useGetSummary } from "@/useCases/Summary";

import { DataCardLoading } from "@/features/Dashboard/Overview/components/data-card";

import { formatDateRange } from "@/lib/utils";

import ChartTransaction from "./components/chart-transaction";
import { CurrentSection, SpendingSection } from "./section";

const OverviewFeature = () => {
  const params = useSearchParams();
  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;

  const dateRangeLabel = formatDateRange({ to, from });

  const { data, isLoading } = useGetSummary();

  return (
    <main className="container mt-5 space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {isLoading ? (
          <>
            <DataCardLoading />
            <DataCardLoading />
            <DataCardLoading />
          </>
        ) : (
          <CurrentSection data={data} dateRangeLabel={dateRangeLabel} />
        )}
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-8">
          <ChartTransaction data={data?.days} />
        </div>
        <div className="col-span-4">
          <SpendingSection data={data?.categories} />
        </div>
      </div>
    </main>
  );
};

export default OverviewFeature;
