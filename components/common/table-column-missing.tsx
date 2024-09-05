import React from "react";

import { TriangleAlert } from "lucide-react";

import useDrawer from "@/hook/useDrawer";

type TableColumnMissingProps = {
  id: string;
  title: string;
};

const TableColumnMissing: React.FC<TableColumnMissingProps> = ({
  id,
  title,
}) => {
  const { openDrawer } = useDrawer();

  return (
    <button
      onClick={() => {
        openDrawer("edit-transaction", id);
      }}
      className="flex items-center rounded-full text-red-600 hover:underline"
    >
      <TriangleAlert className="mr-2 size-4" />
      {title}
    </button>
  );
};

export default TableColumnMissing;
