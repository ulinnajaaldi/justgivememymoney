import dynamic from "next/dynamic";

export const CurrentSection = dynamic(() => import("./CurrentSection"));
export const SpendingSection = dynamic(() => import("./SpendingSection"));
