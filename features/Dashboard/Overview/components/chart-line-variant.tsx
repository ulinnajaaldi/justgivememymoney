import React from "react";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { ChartProps } from "../types";

const ChartLineVariant: React.FC<ChartProps> = ({ data, chartConfig }) => {
  return (
    <ChartContainer
      config={chartConfig as ChartConfig}
      className="aspect-auto h-[350px] w-full"
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
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
        <Line
          dataKey="income"
          type="linear"
          stroke="var(--color-income)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="expenses"
          type="linear"
          stroke="var(--color-expenses)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default ChartLineVariant;
