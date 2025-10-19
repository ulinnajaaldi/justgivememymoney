"use client";

import React from "react";

import { LoaderCircle, PlusIcon } from "lucide-react";

import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import useDrawer from "@/hook/useDrawer";

import { columns, FormAddAccount, FormEditAccount } from "./components";
import { useAccounts } from "./hook";

const AccountsFeature = () => {
  const { openDrawer } = useDrawer();

  const { form, accountsQuery, deleteAccount } = useAccounts();

  return (
    <main className="custom-container mt-5">
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
        <FormAddAccount />
        <FormEditAccount />
      </div>
      <Separator className="mt-5 mb-1" />
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
          disabled={deleteAccount.isPending}
        />
      )}
    </main>
  );
};

export default AccountsFeature;
