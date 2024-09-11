import React from "react";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { ChartProps } from "../types";

const ChartBarVariant: React.FC<ChartProps> = ({ data, chartConfig }) => {
  return (
    <ChartContainer
      config={chartConfig as ChartConfig}
      className="aspect-auto h-[350px] w-full"
    >
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
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
        <Bar dataKey="income" fill="var(--color-income)" radius={2} />
        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={2} />
      </BarChart>
    </ChartContainer>
  );
};

export default ChartBarVariant;
