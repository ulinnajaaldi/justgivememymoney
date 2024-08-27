import type { UseFormReturn } from "react-hook-form";

export type FormAddCategoryProps = {
  form: UseFormReturn<any>;
  handleSubmit: (data: any) => void;
  disabled: boolean;
};

export type FormEditCategoryProps = {
  form: UseFormReturn<any>;
  disabled: boolean;
  isLoading: boolean;
  handleEditSubmit: (data: any) => void;
  handleDelete: () => void;
  ConfirmDelete: () => JSX.Element;
};
