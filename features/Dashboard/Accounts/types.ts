import type { UseFormReturn } from "react-hook-form";

export type FormAddAcountProps = {
  form: UseFormReturn<any>;
  handleSubmit: (data: any) => void;
  disabled: boolean;
};

export type FormEditAccountProps = {
  form: UseFormReturn<any>;
  disabled: boolean;
  isLoading: boolean;
  handleEditSubmit: (data: any) => void;
  handleDelete: () => void;
  ConfirmDelete: () => any;
};
