import React from "react";

import FormDrawer from "@/components/common/form-drawer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { FormAddCategoryProps } from "../types";

const FormAddCategory: React.FC<FormAddCategoryProps> = (props) => {
  const { form, handleSubmit, disabled } = props;

  return (
    <FormDrawer
      type="add-category"
      title="New Category"
      description="Create a new category to track your transactions"
    >
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
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
                  <FormDescription>
                    Enter the name of the category you want to create
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={disabled}>
              Create category
            </Button>
          </form>
        </Form>
      </div>
    </FormDrawer>
  );
};

export default FormAddCategory;
