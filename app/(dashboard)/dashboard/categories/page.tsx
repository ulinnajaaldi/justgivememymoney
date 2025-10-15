import React from "react";

import { Metadata } from "next";

import CategoriesFeature from "@/features/Dashboard/Categories";
import { CategoriesStore } from "@/features/Dashboard/Categories/hook";

export const metadata: Metadata = {
  title: "Categories Management",
};

const CategoriesPage: React.FC = () => {
  return (
    <CategoriesStore>
      <CategoriesFeature />
    </CategoriesStore>
  );
};

export default CategoriesPage;
