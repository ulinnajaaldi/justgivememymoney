import React from "react";

import { Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const TransactionsLoader = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-muted-foreground">Transactions</CardTitle>
          <Skeleton className="h-8 w-[160px]" />
        </div>
      </CardHeader>
      <CardContent className="flex h-[350px] items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" />
      </CardContent>
    </Card>
  );
};

export const CategoriesLoader = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-muted-foreground">Categories</CardTitle>
          <Skeleton className="h-8 w-[160px]" />
        </div>
      </CardHeader>
      <CardContent className="flex h-[350px] items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" />
      </CardContent>
    </Card>
  );
};
export const CardLoader = () => {
  return (
    <Card className="h-[192px]">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="size-12" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-6 w-24 shrink-0" />
        <Skeleton className="h-4 w-40 shrink-0" />
      </CardContent>
    </Card>
  );
};
