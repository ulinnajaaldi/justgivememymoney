export { default as useGetCategories } from "./use-get-categories";
export { default as useGetCategory } from "./use-get-category";
export { default as useCreateCategory } from "./use-create-category";
export { default as useEditCategory } from "./use-edit-category";
export { default as useDeleteCategory } from "./use-delete-category";
export { default as useBulkDeleteCategory } from "./use-bulk-delete-category";

export const CATEGORY_QKEY = {
  ALL: ["categories"],
  DETAIL: (id: string) => ["category", { id }],
};
