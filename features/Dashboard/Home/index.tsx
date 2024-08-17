import React from "react";

import { UserButton } from "@clerk/nextjs";

const DashboardHomeFeature: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <UserButton />
    </div>
  );
};

export default DashboardHomeFeature;
