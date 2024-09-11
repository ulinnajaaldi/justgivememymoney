import dynamic from "next/dynamic";

export const ChartAreaVariant = dynamic(() => import("./chart-area-variant"));
export const ChartBarVariant = dynamic(() => import("./chart-bar-variant"));
export const ChartLineVariant = dynamic(() => import("./chart-line-variant"));
export const ChartPieVariant = dynamic(() => import("./chart-pie-variant"));
export const ChartRadarVariant = dynamic(() => import("./chart-radar-variant"));
