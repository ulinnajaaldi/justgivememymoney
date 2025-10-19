export { default as useGetSummary } from "./use-get-summary";

export const SUMMARY_QKEY = {
  ALL: (from: string, to: string, accountId: string) => [
    "summary",
    { from, to, accountId },
  ],
  ALL_WITHOUT_FILTER: ["summary"],
};
