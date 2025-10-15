import React from "react";

import ColorPickerCustom from "@/components/common/color-picker";
import FormDrawer from "@/components/common/form-drawer";
import IconPicker from "@/components/common/icon-picker";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useCategories } from "../hook";

const FormAddCategory = () => {
  const { form, handleSubmit, mutation, isWithIcon, setIsWithIcon } =
    useCategories();

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
                      disabled={mutation.isPending}
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

            <div className="flex items-center space-x-2">
              <Label htmlFor="airplane-mode">With Icons?</Label>
              <Switch
                id="airplane-mode"
                checked={isWithIcon}
                onCheckedChange={(checked) => setIsWithIcon(checked)}
              />
            </div>

            {isWithIcon && (
              <>
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <IconPicker
                          value={field.value}
                          onChange={field.onChange}
                          color={form.watch("icon_color")}
                          disabled={mutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon_color"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Icon Color</FormLabel>
                      <FormControl>
                        <ColorPickerCustom
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button type="submit" disabled={mutation.isPending}>
              Create category
            </Button>
          </form>
        </Form>
      </div>
    </FormDrawer>
  );
};

export default FormAddCategory;
