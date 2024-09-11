import React from "react";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type { ChartProps } from "../types";

const ChartAreaVariant: React.FC<ChartProps> = ({ data, chartConfig }) => {
  return (
    <ChartContainer
      config={chartConfig as ChartConfig}
      className="aspect-auto h-[350px] w-full"
    >
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-income)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-income)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-expenses)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-expenses)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => format(value, "dd MMM", { locale: id })}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) =>
                format(value, "MMM dd, y", { locale: id })
              }
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="income"
          type="monotone"
          fill="url(#fillIncome)"
          stroke="var(--color-income)"
          stackId="a"
        />
        <Area
          dataKey="expenses"
          type="monotone"
          fill="url(#fillExpenses)"
          stroke="var(--color-expenses)"
          stackId="a"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
};

export default ChartAreaVariant;
