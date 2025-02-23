import React from "react";

import { Metadata } from "next";

import SettingsFeature from "@/features/Dashboard/Settings";

export const metadata: Metadata = {
  title: "Settings",
};

const SettingsPage: React.FC = () => {
  return <SettingsFeature />;
};

export default SettingsPage;
