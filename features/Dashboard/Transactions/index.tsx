"use client";

import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { insertTransactionsSchema } from "@/server/schema";

import { useCreateAccount, useGetAccounts } from "@/useCases/Account";
import { useCreateCategory, useGetCategories } from "@/useCases/Category";
import { useGetTransaction, useGetTransactions } from "@/useCases/Transactions";
import useBulkDeleteTransaction from "@/useCases/Transactions/use-bulk-delete-transaction";
import useCreateTransaction from "@/useCases/Transactions/use-create-transaction";
import useDeleteTransaction from "@/useCases/Transactions/use-delete-transaction";
import useEditTransaction from "@/useCases/Transactions/use-edit-transaction";

import { useConfirm } from "@/hook/useConfirm";
import useDrawer from "@/hook/useDrawer";

import { convertAmountToMiliUnit } from "@/lib/utils";

import { columns, FormAddTransaction, FormEditTransaction } from "./components";

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  paye: z.string().min(1),
  amount: z.string().min(1),
  notes: z.string().nullable().optional(),
});

const apiFormSchema = insertTransactionsSchema.omit({ id: true });

export type FormValues = z.infer<typeof formSchema>;
export type APIFormValues = z.infer<typeof apiFormSchema>;

const TransactionsFeature = () => {
  const { openDrawer, closeDrawer, id } = useDrawer();

  const [ConfirmDelete, confirm] = useConfirm(
    "Are you sure",
    "You are about to perform a delete operation. This action cannot be undone.",
  );

  const mutation = useCreateTransaction();
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);
  const transactionQuery = useGetTransaction(id);
  const transactionsQuery = useGetTransactions();

  const deleteTransaction = useBulkDeleteTransaction();

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isFormEditPending = editMutation.isPending || deleteMutation.isPending;

  const isFormAddPending =
    mutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isFormDeletePending =
    transactionsQuery.isLoading || deleteTransaction.isPending;

  const isFormLoading =
    categoryQuery.isLoading ||
    accountQuery.isLoading ||
    transactionQuery.isLoading;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountId: "",
      amount: "",
      categoryId: "",
      date: new Date(),
      notes: "",
      paye: "",
    },
  });

  useEffect(() => {
    if (transactionQuery.data) {
      form.reset({
        accountId: transactionQuery.data.accountId,
        amount: transactionQuery.data.amount.toString(),
        categoryId: transactionQuery.data.categoryId,
        date: new Date(transactionQuery.data.date),
        notes: transactionQuery.data.notes,
        paye: transactionQuery.data.paye,
      });
    }
  }, [transactionQuery.data, form]);

  const handleSubmit = (values: FormValues) => {
    const amount = parseFloat(values.amount);
    const ammountInMiliUnit = convertAmountToMiliUnit(amount);

    mutation.mutate(
      {
        ...values,
        amount: ammountInMiliUnit,
        categoryId: values.categoryId ?? "",
      },
      {
        onSuccess: () => {
          closeDrawer();
          form.reset();
        },
      },
    );
  };

  const handleEditSubmit = (values: FormValues) => {
    const amount = parseFloat(values.amount);
    const ammountInMiliUnit = convertAmountToMiliUnit(amount);

    editMutation.mutate(
      {
        ...values,
        amount: ammountInMiliUnit,
        categoryId: values.categoryId ?? "",
      },
      {
        onSuccess: () => {
          closeDrawer();
          form.reset();
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
    <main className="container mt-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold sm:text-2xl md:text-3xl">
          Transcations History
        </h1>
        <Button
          size="sm"
          onClick={() => {
            openDrawer("add-transactions");
            form.reset({
              accountId: "",
              amount: "",
              categoryId: "",
              date: new Date(),
              notes: "",
              paye: "",
            });
          }}
          disabled={isFormAddPending || isFormLoading}
        >
          {isFormLoading ? (
            <>
              <LoaderCircle className="mr-2 size-5 animate-spin" />
              Loading
            </>
          ) : (
            <>
              <PlusIcon className="mr-2 size-5" />
              Add New
            </>
          )}
        </Button>
        <FormAddTransaction
          form={form}
          handleSubmit={handleSubmit}
          disabled={mutation.isPending}
          isLoading={isFormLoading}
          onCreateAccount={onCreateAccount}
          accountOptions={accountOptions}
          onCreateCategory={onCreateCategory}
          categoryOptions={categoryOptions}
        />
        <FormEditTransaction
          ConfirmDelete={ConfirmDelete}
          disabled={isFormEditPending}
          form={form}
          handleDelete={handleDelete}
          handleEditSubmit={handleEditSubmit}
          isLoading={transactionQuery.isLoading}
          accountOptions={accountOptions}
          categoryOptions={categoryOptions}
          onCreateAccount={onCreateAccount}
          onCreateCategory={onCreateCategory}
        />
      </div>
      <Separator className="mb-1 mt-5" />
      {transactionsQuery.isLoading ? (
        <div className="flex h-[20vh] animate-pulse items-center justify-center rounded-md bg-neutral-100">
          <LoaderCircle className="size-6 animate-spin text-neutral-800" />
        </div>
      ) : (
        <DataTable
          filterKey="paye"
          columns={columns}
          data={transactionsQuery.data || []}
          onDelete={(row) => {
            const ids = row.map((r) => r.original.id);
            deleteTransaction.mutate({ ids });
          }}
          disabled={isFormDeletePending}
        />
      )}
    </main>
  );
};

export default TransactionsFeature;
