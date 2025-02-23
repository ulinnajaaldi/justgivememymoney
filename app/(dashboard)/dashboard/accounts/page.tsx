import React from "react";

import { Metadata } from "next";

import AccountsFeature from "@/features/Dashboard/Accounts";

export const metadata: Metadata = {
  title: "Account Management",
};

const AccountsPage: React.FC = () => {
  return <AccountsFeature />;
};

export default AccountsPage;
