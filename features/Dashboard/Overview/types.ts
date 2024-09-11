import type { ChartConfig } from "@/components/ui/chart";

export type ChartProps = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
  chartConfig: ChartConfig;
};

export type DataChartProps = {
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
  dateRangeLabel: string;
};
