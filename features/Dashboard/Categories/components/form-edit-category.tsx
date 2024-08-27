import React from "react";

import { Trash2 } from "lucide-react";

import FormDrawer from "@/components/common/form-drawer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { FormEditCategoryProps } from "../types";

const FormEditCategory: React.FC<FormEditCategoryProps> = (props) => {
  const {
    form,
    disabled,
    isLoading,
    handleEditSubmit,
    handleDelete,
    ConfirmDelete,
  } = props;

  return (
    <FormDrawer
      type="edit-category"
      title="Edit Category"
      description="Edit the category to track your transactions"
    >
      <div>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-4/12 rounded-sm bg-gray-200/80" />
            <div className="w-12/12 h-9 rounded-sm bg-gray-200/80" />
            <div className="w-12/12 h-9 rounded-sm bg-gray-200/80" />
            <div className="w-12/12 h-9 rounded-sm bg-gray-200/80" />
          </div>
        ) : (
          <>
            <ConfirmDelete />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleEditSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="e.g. Food, Bank, etc."
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-3">
                  <Button type="submit" disabled={disabled}>
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    onClick={handleDelete}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </div>
    </FormDrawer>
  );
};

export default FormEditCategory;
