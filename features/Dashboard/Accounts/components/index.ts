import dynamic from "next/dynamic";

import { columns } from "./table-column";

export const FormAddAccount = dynamic(() => import("./form-add-account"));
export const FormEditAccount = dynamic(() => import("./form-edit-account"));
export const TableAction = dynamic(() => import("./table-action"));

export { columns };
