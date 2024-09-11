"use client";

import React from "react";

import { AreaChartIcon, BarChart3, FileSearch, LineChart } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ChartAreaVariant, ChartBarVariant, ChartLineVariant } from ".";
import { DataChartProps } from "../types";

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const ChartTransaction: React.FC<DataChartProps> = ({ data }) => {
  const [chartType, setChartType] = React.useState<string>("area");

  const onChartTypeChange = (value: string) => {
    setChartType(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transactions</CardTitle>
          <Select value={chartType} onValueChange={onChartTypeChange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select Chart"
            >
              <SelectValue placeholder="Select Chart" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="area" className="rounded-lg">
                <div className="flex items-center gap-1">
                  <AreaChartIcon className="mr-2 inline size-4" />
                  <span>Area Chart</span>
                </div>
              </SelectItem>
              <SelectItem value="bar" className="rounded-lg">
                <div className="flex items-center gap-1">
                  <BarChart3 className="mr-2 inline size-4" />
                  <span>Bar Chart</span>
                </div>
              </SelectItem>
              <SelectItem value="line" className="rounded-lg">
                <div className="flex items-center gap-1">
                  <LineChart className="mr-2 inline size-4" />
                  <span>Line Chart</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {data?.length === 0 ? (
          <div className="h-[350px]">
            <FileSearch className="size-6 text-muted-foreground" />
            <p>No data for this period</p>
          </div>
        ) : (
          <div className="h-[350px]">
            {chartType === "area" && (
              <ChartAreaVariant data={data} chartConfig={chartConfig} />
            )}
            {chartType === "bar" && (
              <ChartBarVariant data={data} chartConfig={chartConfig} />
            )}
            {chartType === "line" && (
              <ChartLineVariant data={data} chartConfig={chartConfig} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartTransaction;
