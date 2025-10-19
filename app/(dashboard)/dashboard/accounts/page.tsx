import React from "react";

import { Metadata } from "next";

import AccountsFeature from "@/features/Dashboard/Accounts";
import { AccountsStore } from "@/features/Dashboard/Accounts/hook";

export const metadata: Metadata = {
  title: "Account Management",
};

const AccountsPage: React.FC = () => {
  return (
    <AccountsStore>
      <AccountsFeature />
    </AccountsStore>
  );
};

export default AccountsPage;
