"use client";

import React from "react";

import { CountUp } from "@/components/common/count-up";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn, formatCurrency, formatPercentage } from "@/lib/utils";

import { boxVariants, iconVariants } from "../config";
import type { DataCardProps } from "../types";

export const DataCard: React.FC<DataCardProps> = (props) => {
  const {
    title,
    value = 0,
    percentageChange = 0,
    icon: Icon,
    variant,
    dateRange,
  } = props;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="xs:space-y-2 space-y-1">
          <CardTitle className="line-clamp-1 text-xl md:text-2xl">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-1">
            {dateRange}
          </CardDescription>
        </div>
        <div className={cn(boxVariants({ variant }))}>
          <Icon className={cn(iconVariants({ variant }))} />
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="line-clamp-1 break-all text-sm md:text-base">
          <CountUp
            preserveValue
            start={0}
            end={value}
            decimals={2}
            decimalPlaces={2}
            formattingFn={formatCurrency}
          />
        </h1>
        <p
          className={cn(
            "text-sm text-muted-foreground md:text-base",
            percentageChange > 0 && "text-emerald-500",
            percentageChange < 0 && "text-rose-500",
          )}
        >
          {formatPercentage(percentageChange, { addPrefix: true })} from last
          period
        </p>
      </CardContent>
    </Card>
  );
};
