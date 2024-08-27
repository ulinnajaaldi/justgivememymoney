import dynamic from "next/dynamic";

import { columns } from "./table-column";

export const FormAddCategory = dynamic(() => import("./form-add-category"));
export const FormEditCategory = dynamic(() => import("./form-edit-category"));
export const TableAction = dynamic(() => import("./table-action"));

export { columns };
