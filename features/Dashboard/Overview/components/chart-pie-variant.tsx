import React from "react";

import { Cell, Legend, Pie, PieChart } from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

import { formatCurrency, formatPercentage } from "@/lib/utils";

import type { ChartPropsCategory } from "../types";

const COLOR = [
  "hsl(var(--chart-3))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const ChartPieVariant: React.FC<ChartPropsCategory> = ({
  data,
  chartConfig,
}) => {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[350px]"
    >
      <PieChart>
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
                  <p className="text-sm text-muted-foreground">Expenses</p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {formatCurrency(value * -1)}
                  </p>
                </div>
              </div>
            );
          }}
        />

        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="left"
          iconType="circle"
          iconSize={10}
          content={({ payload }: any) => (
            <ul className="flex flex-col gap-1">
              {payload?.map((entry: any, index: number) => (
                <li
                  key={`${index}-${entry.value}`}
                  className="flex items-center space-x-2"
                >
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <div className="space-x-1">
                    <span className="text-sm text-muted-foreground">
                      {entry.value}
                    </span>
                    <span className="text-sm">
                      {formatPercentage(entry.payload.percent * 100)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={1}
        >
          {data?.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLOR[index % COLOR.length]} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};

export default ChartPieVariant;
