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
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

const SpendingSection: React.FC<DataChartProps> = ({ data }) => {
  const [chartType, setChartType] = React.useState<string>("pie");

  const onChartTypeChange = (value: string) => {
    setChartType(value);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="xs:flex-row xs:items-center flex flex-col items-start justify-between gap-2 sm:gap-0">
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
          <div className="xs:h-[350px] text-muted-foreground flex h-full flex-col items-center justify-center">
            <FileSearch className="size-6" />
            <p>No data for this period</p>
          </div>
        ) : (
          <div className="xs:h-[350px] h-full">
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
