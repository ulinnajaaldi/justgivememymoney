import React from "react";

import { Trash2 } from "lucide-react";

import ColorPickerCustom from "@/components/common/color-picker";
import FormDrawer from "@/components/common/form-drawer";
import IconPicker from "@/components/common/icon-picker";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useAccounts } from "../hook";

const FormEditAccount: React.FC = () => {
  const {
    form,
    accountQuery,
    editMutation,
    handleEditSubmit,
    handleDelete,
    ConfirmDelete,
    isWithIcon,
    setIsWithIcon,
  } = useAccounts();

  return (
    <FormDrawer
      type="edit-account"
      title="Edit Account"
      description="Edit the account to track your transactions"
    >
      <div>
        {accountQuery.isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-4/12 rounded-sm bg-gray-200/80" />
            <div className="h-9 w-12/12 rounded-sm bg-gray-200/80" />
            <div className="h-9 w-12/12 rounded-sm bg-gray-200/80" />
            <div className="h-9 w-12/12 rounded-sm bg-gray-200/80" />
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
                          disabled={editMutation.isPending}
                          placeholder="e.g. Cash, Bank, Credit Card"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
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
                              disabled={editMutation.isPending}
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

                <div className="flex flex-col gap-3">
                  <Button type="submit" disabled={editMutation.isPending}>
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={editMutation.isPending}
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

export default FormEditAccount;
