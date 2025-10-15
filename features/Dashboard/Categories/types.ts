import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  icon: z.string(),
  icon_color: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;

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
