"use client";

import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { insertAccountsSchema } from "@/server/schema";

import {
  useBulkDeleteAccount,
  useCreateAccount,
  useDeleteAccount,
  useEditAccount,
  useGetAccount,
  useGetAccounts,
} from "@/useCases/Account";

import { useConfirm } from "@/hook/useConfirm";
import useDrawer from "@/hook/useDrawer";

import { columns, FormAddAccount, FormEditAccount } from "./components";

const formSchema = insertAccountsSchema.pick({
  name: true,
});

type FormValues = z.infer<typeof formSchema>;

const AccountsFeature = () => {
  const { openDrawer, closeDrawer, id } = useDrawer();

  const [ConfirmDelete, confirm] = useConfirm(
    "Are you sure",
    "You are about to delete the account. This action will delete all associated transactions and cannot be undone.",
  );

  const mutation = useCreateAccount();
  const editMutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);
  const accountQuery = useGetAccount(id);
  const accountsQuery = useGetAccounts();
  const deleteAccount = useBulkDeleteAccount();

  const isFormEditPending = editMutation.isPending || deleteMutation.isPending;

  const isFormDeletePending =
    accountsQuery.isLoading || deleteAccount.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (accountQuery.data) {
      form.reset({
        name: accountQuery.data.name,
      });
    }
  }, [accountQuery.data, form]);

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
          Accounts Management
        </h1>
        <Button
          size="sm"
          onClick={() => {
            openDrawer("add-account");
            form.reset({
              name: "",
            });
          }}
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Add New
        </Button>
        <FormAddAccount
          form={form}
          handleSubmit={handleSubmit}
          disabled={mutation.isPending}
        />
        <FormEditAccount
          ConfirmDelete={ConfirmDelete}
          disabled={isFormEditPending}
          form={form}
          handleDelete={handleDelete}
          handleEditSubmit={handleEditSubmit}
          isLoading={accountQuery.isLoading}
        />
      </div>
      <Separator className="mb-1 mt-5" />
      {accountsQuery.isLoading ? (
        <div className="flex h-[20vh] animate-pulse items-center justify-center rounded-md bg-neutral-100">
          <LoaderCircle className="size-6 animate-spin text-neutral-800" />
        </div>
      ) : (
        <DataTable
          filterKey="name"
          columns={columns}
          data={accountsQuery.data || []}
          onDelete={(row) => {
            const ids = row.map((r) => r.original.id);
            deleteAccount.mutate({ ids });
          }}
          disabled={isFormDeletePending}
        />
      )}
    </main>
  );
};

export default AccountsFeature;
