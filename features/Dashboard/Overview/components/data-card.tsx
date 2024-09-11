"use client";

import React from "react";

import { cva, VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

import { CountUp } from "@/components/common/count-up";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn, formatCurrency, formatPercentage } from "@/lib/utils";

const boxVariants = cva("rounded-md p-3", {
  variants: {
    variant: {
      default: "bg-blue-500/20",
      success: "bg-emerald-500/20",
      danger: "bg-rose-500/20",
      warning: "bg-yellow-500/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const iconVariants = cva("size-6", {
  variants: {
    variant: {
      default: "text-blue-500",
      success: "text-emerald-500",
      danger: "text-rose-500",
      warning: "text-yellow-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type IBoxVariants = VariantProps<typeof boxVariants>;
type IIconVariants = VariantProps<typeof iconVariants>;

interface DataCardProps extends IBoxVariants, IIconVariants {
  title: string;
  value?: number;
  percentageChange?: number;
  icon: LucideIcon;
  dateRange: string;
}

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
        <div className="space-y-2">
          <CardTitle className="line-clamp-1 text-2xl">{title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {dateRange}
          </CardDescription>
        </div>
        <div className={cn(boxVariants({ variant }))}>
          <Icon className={cn(iconVariants({ variant }))} />
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="line-clamp-1 break-all">
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
            "text-muted-foreground",
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

export const DataCardLoading = () => {
  return (
    <Card className="h-[192px] animate-pulse border-none drop-shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <div className="h-6 w-24 animate-pulse bg-gray-200/80" />
          <div className="h-4 w-40 animate-pulse bg-gray-200/80" />
        </div>
        <div className="size-12 animate-pulse bg-gray-200/80" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-6 w-24 shrink-0 animate-pulse bg-gray-200/80" />
        <div className="h-4 w-40 shrink-0 animate-pulse bg-gray-200/80" />
      </CardContent>
    </Card>
  );
};
