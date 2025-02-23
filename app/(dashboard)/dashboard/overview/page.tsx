import React from "react";

import { Metadata } from "next";

import OverviewFeature from "@/features/Dashboard/Overview";

export const metadata: Metadata = {
  title: "Overview Dashboard",
};

const OverviewPage: React.FC = () => {
  return <OverviewFeature />;
};

export default OverviewPage;
