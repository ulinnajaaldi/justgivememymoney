"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";

import {
  useBulkDeleteCategory,
  useCreateCategory,
  useDeleteCategory,
  useEditCategory,
  useGetCategories,
  useGetCategory,
} from "@/useCases/Category";

import { useConfirm } from "@/hook/useConfirm";
import useDrawer from "@/hook/useDrawer";

import { formSchema, FormValues } from "../types";

interface CategoriesProps {
  form: UseFormReturn<FormValues>;
  handleSubmit: (values: FormValues) => void;
  mutation: ReturnType<typeof useCreateCategory>;
  categoriesQuery: ReturnType<typeof useGetCategories>;
  isFormDeletePending: boolean;
  deleteCategory: ReturnType<typeof useBulkDeleteCategory>;
  ConfirmDelete: React.FC;
  isFormEditPending: boolean;
  handleDelete: () => void;
  handleEditSubmit: (values: FormValues) => void;
  categoryQuery: ReturnType<typeof useGetCategory>;
  editMutation: ReturnType<typeof useEditCategory>;
  deleteMutation: ReturnType<typeof useDeleteCategory>;
  isWithIcon: boolean;
  setIsWithIcon: React.Dispatch<React.SetStateAction<boolean>>;
}

const Categories = createContext<CategoriesProps | undefined>(undefined);

export const CategoriesStore: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { closeDrawer, id } = useDrawer();

  const [ConfirmDelete, confirm] = useConfirm(
    "Are you sure",
    "You are about to perform a delete operation. This action cannot be undone.",
  );
  const [isWithIcon, setIsWithIcon] = useState(false);

  const mutation = useCreateCategory();
  const editMutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id);
  const categoryQuery = useGetCategory(id);
  const categoriesQuery = useGetCategories();
  const deleteCategory = useBulkDeleteCategory();

  const isFormEditPending = editMutation.isPending || deleteMutation.isPending;

  const isFormDeletePending =
    categoriesQuery.isLoading || deleteCategory.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (categoryQuery.data) {
      form.reset({
        name: categoryQuery.data.name,
        icon: categoryQuery.data.icon || "",
        icon_color: categoryQuery.data.iconColor || "",
      });
      setIsWithIcon(!!categoryQuery.data.icon);
    } else {
      form.reset({
        name: "",
        icon: "",
        icon_color: "",
      });
      setIsWithIcon(false);
    }
  }, [categoryQuery.data, form]);

  const handleSubmit = (values: FormValues) => {
    mutation.mutate(
      {
        name: values.name,
        icon: isWithIcon ? values.icon : undefined,
        iconColor: isWithIcon ? values.icon_color : undefined,
      },
      {
        onSuccess: () => {
          closeDrawer();
          form.reset({
            name: "",
          });
        },
      },
    );
  };

  const handleEditSubmit = (values: FormValues) => {
    editMutation.mutate(
      {
        name: values.name,
        icon: isWithIcon ? values.icon : undefined,
        iconColor: isWithIcon ? values.icon_color : undefined,
      },
      {
        onSuccess: () => {
          closeDrawer();
          form.reset({
            name: "",
          });
        },
      },
    );
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          closeDrawer();
          form.reset();
        },
      });
    }
  };

  return (
    <Categories.Provider
      value={{
        form,
        handleSubmit,
        mutation,
        categoriesQuery,
        isFormDeletePending,
        deleteCategory,
        ConfirmDelete,
        isFormEditPending,
        handleDelete,
        handleEditSubmit,
        categoryQuery,
        editMutation,
        deleteMutation,
        isWithIcon,
        setIsWithIcon,
      }}
    >
      {children}
    </Categories.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(Categories);
  if (context === undefined) {
    throw new Error("useCategories must be used within a Categories");
  }
  return context;
};
