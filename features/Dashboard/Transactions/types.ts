import type { UseFormReturn } from "react-hook-form";

import { FormValues } from ".";

export type FormAddTransactionProps = {
  form: UseFormReturn<FormValues, any, undefined>;
  handleSubmit: (data: any) => void;
  disabled: boolean;
  isLoading: boolean;
  onCreateAccount: (value: string) => void;
  accountOptions: {
    label: string;
    value: string;
  }[];
  onCreateCategory: (value: string) => void;
  categoryOptions: {
    label: string;
    value: string;
  }[];
};

export type FormEditTransactionProps = {
  form: UseFormReturn<any>;
  disabled: boolean;
  isLoading: boolean;
  handleEditSubmit: (data: any) => void;
  handleDelete: () => void;
  ConfirmDelete: () => JSX.Element;
  onCreateAccount: (value: string) => void;
  accountOptions: {
    label: string;
    value: string;
  }[];
  onCreateCategory: (value: string) => void;
  categoryOptions: {
    label: string;
    value: string;
  }[];
};
