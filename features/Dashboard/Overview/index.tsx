"use client";

import React from "react";

import FilterAccount from "@/components/common/filter-account";
import FilterDate from "@/components/common/filter-date";

import { useGetSummary } from "@/useCases/Summary";

import {
  CategoriesLoader,
  TransactionsLoader,
} from "./components/overview-loader";
import { CurrentSection, SpendingSection, TransactionSection } from "./section";

const OverviewFeature = () => {
  const { data, isLoading } = useGetSummary();

  return (
    <main className="custom-container my-3 space-y-5 md:my-4 lg:my-5">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold sm:text-2xl md:text-3xl">
          Overview
        </h1>

        <div className="grid w-full grid-cols-2 items-center gap-4 sm:flex sm:w-auto">
          <FilterAccount />
          <FilterDate disabled={isLoading} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <CurrentSection data={data} />
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8">
          {isLoading ? (
            <TransactionsLoader />
          ) : (
            <TransactionSection data={data?.days} />
          )}
        </div>
        <div className="col-span-12 lg:col-span-4">
          {isLoading ? (
            <CategoriesLoader />
          ) : (
            <SpendingSection data={data?.categories} />
          )}
        </div>
      </div>
    </main>
  );
};

export default OverviewFeature;
