import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  icon: z.string().optional(),
  icon_color: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export type FormAddAccountProps = {
  form: UseFormReturn<FormValues>;
  handleSubmit: (data: FormValues) => void;
  disabled: boolean;
};

export type FormEditAccountProps = {
  form: UseFormReturn<FormValues>;
  disabled: boolean;
  isLoading: boolean;
  handleEditSubmit: (data: FormValues) => void;
  handleDelete: () => void;
  ConfirmDelete: () => any;
};
