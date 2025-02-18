import { VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

import type { ChartConfig } from "@/components/ui/chart";

import { boxVariants, iconVariants } from "./config";

export type IBoxVariants = VariantProps<typeof boxVariants>;
export type IIconVariants = VariantProps<typeof iconVariants>;

export interface DataCardProps extends IBoxVariants, IIconVariants {
  title: string;
  value?: number;
  percentageChange?: number;
  icon?: React.ReactNode;
  dateRange: string;
}

export type ChartProps = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
  chartConfig: ChartConfig;
};

export type TransactionSectionProps = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export type ChartPropsCategory = {
  data?: {
    name: string;
    value: number;
  }[];
  chartConfig: ChartConfig;
};

export type CurrentSectionProps = {
  data:
    | {
        incomeAmmount: number;
        expensesAmmount: number;
        remainingAmmount: number;
        categories: {
          value: number;
          name: string;
        }[];
        days: {
          income: number;
          expenses: number;
          date: string;
        }[];
        remainingChange: number;
        incomeChange: number;
        expensesChange: number;
      }
    | undefined;
};
