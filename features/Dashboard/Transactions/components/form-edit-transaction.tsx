import React from "react";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Loader2, Trash2 } from "lucide-react";

import FormDrawer from "@/components/common/form-drawer";
import InputAmmount from "@/components/common/input-ammount";
import InputSelect from "@/components/common/input-select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

import { FormEditTransactionProps } from "../types";

const FormEditCategory: React.FC<FormEditTransactionProps> = (props) => {
  const {
    form,
    disabled,
    isLoading,
    handleEditSubmit,
    handleDelete,
    ConfirmDelete,
    onCreateAccount,
    accountOptions,
    onCreateCategory,
    categoryOptions,
  } = props;

  return (
    <FormDrawer
      type="edit-transaction"
      title="Edit Transaction"
      description="Edit the transaction details"
    >
      {isLoading ? (
        <div className="flex h-full w-full animate-pulse items-center justify-center rounded-lg bg-gray-100">
          <Loader2 className="size-5 animate-spin" />
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
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Pick a date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: id })
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={id}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account</FormLabel>
                    <InputSelect
                      placeholder="Select an account"
                      options={accountOptions}
                      onCreate={onCreateAccount}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={disabled}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <InputSelect
                      placeholder="Select an category"
                      options={categoryOptions}
                      onCreate={onCreateCategory}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={disabled}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="payee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payee</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabled}
                        placeholder="Add a payeee"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ammount</FormLabel>
                    <FormControl>
                      <InputAmmount
                        disabled={disabled}
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Optional Note"
                        className="max-h-[120px] min-h-[80px] resize-none"
                        rows={3}
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
    </FormDrawer>
  );
};

export default FormEditCategory;
