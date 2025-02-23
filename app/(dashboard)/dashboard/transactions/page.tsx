import React from "react";

import { Metadata } from "next";

import TransactionsFeature from "@/features/Dashboard/Transactions";

export const metadata: Metadata = {
  title: "Transactions Management",
};

const TransactionsPage: React.FC = () => {
  return <TransactionsFeature />;
};

export default TransactionsPage;
