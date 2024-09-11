"use client";

import React from "react";

import { ChartPie, FileSearch, Hexagon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ChartPieVariant, ChartRadarVariant } from "../components";

export type DataChartProps = {
  data?: {
    name: string;
    value: number;
  }[];
};

const chartConfig = {
  spending: {
    label: "Spending",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const SpendingSection: React.FC<DataChartProps> = ({ data }) => {
  const [chartType, setChartType] = React.useState<string>("pie");

  const onChartTypeChange = (value: string) => {
    setChartType(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Categories</CardTitle>
          <Select value={chartType} onValueChange={onChartTypeChange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select Chart"
            >
              <SelectValue placeholder="Select Chart" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="pie" className="rounded-lg">
                <div className="flex items-center gap-1">
                  <ChartPie className="mr-2 inline size-4" />
                  <span>Pie Chart</span>
                </div>
              </SelectItem>
              <SelectItem value="radar" className="rounded-lg">
                <div className="flex items-center gap-1">
                  <Hexagon className="mr-2 inline size-4" />
                  <span>Radar Chart</span>
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
            {chartType === "pie" && (
              <ChartPieVariant data={data} chartConfig={chartConfig} />
            )}
            {chartType === "radar" && (
              <ChartRadarVariant data={data} chartConfig={chartConfig} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingSection;
