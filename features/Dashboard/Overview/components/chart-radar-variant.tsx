import React from "react";

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

import { formatCurrency, formatPercentage } from "@/lib/utils";

import type { ChartPropsCategory } from "../types";

const COLOR = [
  "var(--color-chart-3)",
  "var(--color-chart-2)",
  "var(--color-chart-1)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const ChartRadarVariant: React.FC<ChartPropsCategory> = ({
  data,
  chartConfig,
}) => {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[350px]"
    >
      <RadarChart data={data}>
        <ChartTooltip
          cursor={false}
          content={({ payload }) => {
            if (!payload || !payload.length) return null;

            const { name, value } = payload[0].payload;

            return (
              <div className="rounded-lg bg-white p-2 shadow">
                <p className="border-b pb-[2px] text-sm font-semibold">
                  {name}
                </p>
                <div className="mt-1 flex space-x-2">
                  <p className="text-muted-foreground text-sm">Expenses</p>
                  <p className="text-muted-foreground text-sm font-medium">
                    {formatCurrency(value * -1)}
                  </p>
                </div>
              </div>
            );
          }}
        />

        <PolarGrid />
        <PolarAngleAxis fontSize={12} dataKey="name" />
        <PolarRadiusAxis
          angle={60}
          stroke="hsla(var(--foreground))"
          orientation="middle"
          axisLine={false}
        />
        <Radar
          dataKey="value"
          stroke="var(--color-chart-1)"
          fill="var(--color-chart-1)"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ChartContainer>
  );
};

export default ChartRadarVariant;
