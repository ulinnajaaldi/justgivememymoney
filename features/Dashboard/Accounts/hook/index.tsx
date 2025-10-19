"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

import { formSchema, FormValues } from "../types";

interface AccountsProps {
  form: ReturnType<typeof useForm<FormValues>>;
  handleSubmit: (values: FormValues) => void;
  mutation: ReturnType<typeof useCreateAccount>;
  accountsQuery: ReturnType<typeof useGetAccounts>;
  deleteAccount: ReturnType<typeof useBulkDeleteAccount>;
  ConfirmDelete: React.FC;
  handleDelete: () => void;
  handleEditSubmit: (values: FormValues) => void;
  accountQuery: ReturnType<typeof useGetAccount>;
  editMutation: ReturnType<typeof useEditAccount>;
  deleteMutation: ReturnType<typeof useDeleteAccount>;
  isWithIcon: boolean;
  setIsWithIcon: React.Dispatch<React.SetStateAction<boolean>>;
}

const Accounts = createContext<AccountsProps | undefined>(undefined);

export const AccountsStore: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { closeDrawer, id } = useDrawer();

  const [ConfirmDelete, confirm] = useConfirm(
    "Are you sure",
    "You are about to perform a delete operation. This action cannot be undone.",
  );
  const [isWithIcon, setIsWithIcon] = useState<boolean>(false);

  const mutation = useCreateAccount();
  const editMutation = useEditAccount(id!);
  const deleteMutation = useDeleteAccount(id);
  const accountQuery = useGetAccount(id!);
  const accountsQuery = useGetAccounts();
  const deleteAccount = useBulkDeleteAccount();

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
        icon: accountQuery.data.icon || "",
        icon_color: accountQuery.data.iconColor || "",
      });
      setIsWithIcon(!!accountQuery.data.icon);
    } else {
      form.reset({
        name: "",
        icon: "",
        icon_color: "",
      });
      setIsWithIcon(false);
    }
  }, [accountQuery.data, form]);

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
          form.reset();
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
    <Accounts.Provider
      value={{
        form,
        isWithIcon,
        setIsWithIcon,
        handleSubmit,
        ConfirmDelete,
        handleEditSubmit,
        handleDelete,
        mutation,
        editMutation,
        deleteMutation,
        accountQuery,
        accountsQuery,
        deleteAccount,
      }}
    >
      {children}
    </Accounts.Provider>
  );
};

export const useAccounts = () => {
  const context = useContext(Accounts);
  if (context === undefined) {
    throw new Error("useAccounts must be used within a Accounts");
  }
  return context;
};
