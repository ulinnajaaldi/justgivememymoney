import dynamic from "next/dynamic";

import { columns } from "./table-column";

export const FormAddTransaction = dynamic(
  () => import("./form-add-transaction"),
);
export const FormEditTransaction = dynamic(
  () => import("./form-edit-transaction"),
);
export const TableAction = dynamic(() => import("./table-action"));

export { columns };
