"use client";

import React, { useState } from "react";

import { AreaChartIcon, BarChart3, FileSearch, LineChart } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ChartAreaVariant,
  ChartBarVariant,
  ChartLineVariant,
} from "../components";
import { chartConfig } from "../config";
import { TransactionSectionProps } from "../types";

const TransactionSection: React.FC<TransactionSectionProps> = ({ data }) => {
  const [chartType, setChartType] = useState<string>("area");

  const onChartTypeChange = (value: string) => {
    setChartType(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="xs:flex-row xs:items-center flex flex-col items-start justify-between gap-2 sm:gap-0">
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
          <div className="flex h-[350px] flex-col items-center justify-center text-muted-foreground">
            <FileSearch className="size-6" />
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

export default TransactionSection;
