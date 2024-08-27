"use client";

import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { insertCategoriesSchema } from "@/server/schema";

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

import { columns, FormAddCategory, FormEditCategory } from "./components";

const formSchema = insertCategoriesSchema.pick({
  name: true,
});

type FormValues = z.infer<typeof formSchema>;

const CategoriesFeature = () => {
  const { openDrawer, closeDrawer, id } = useDrawer();

  const [ConfirmDelete, confirm] = useConfirm(
    "Are you sure",
    "You are about to perform a delete operation. This action cannot be undone.",
  );

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
      });
    }
  }, [categoryQuery.data, form]);

  const handleSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        closeDrawer();
        form.reset();
      },
    });
  };

  const handleEditSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        closeDrawer();
        form.reset();
      },
    });
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
    <main className="container mt-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold sm:text-2xl md:text-3xl">
          Categories Management
        </h1>
        <Button
          size="sm"
          onClick={() => {
            openDrawer("add-category");
            form.reset({
              name: "",
            });
          }}
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Add New
        </Button>
        <FormAddCategory
          form={form}
          handleSubmit={handleSubmit}
          disabled={mutation.isPending}
        />
        <FormEditCategory
          ConfirmDelete={ConfirmDelete}
          disabled={isFormEditPending}
          form={form}
          handleDelete={handleDelete}
          handleEditSubmit={handleEditSubmit}
          isLoading={categoryQuery.isLoading}
        />
      </div>
      <Separator className="mb-1 mt-5" />
      {categoriesQuery.isLoading ? (
        <div className="flex h-[20vh] animate-pulse items-center justify-center rounded-md bg-neutral-100">
          <LoaderCircle className="size-6 animate-spin text-neutral-800" />
        </div>
      ) : (
        <DataTable
          filterKey="name"
          columns={columns}
          data={categoriesQuery.data || []}
          onDelete={(row) => {
            const ids = row.map((r) => r.original.id);
            deleteCategory.mutate({ ids });
          }}
          disabled={isFormDeletePending}
        />
      )}
    </main>
  );
};

export default CategoriesFeature;
