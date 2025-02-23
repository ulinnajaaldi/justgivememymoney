import React from "react";

import { Metadata } from "next";

import CategoriesFeature from "@/features/Dashboard/Categories";

export const metadata: Metadata = {
  title: "Categories Management",
};

const CategoriesPage: React.FC = () => {
  return <CategoriesFeature />;
};

export default CategoriesPage;
