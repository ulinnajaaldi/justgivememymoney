"use client";

import React from "react";

import { Edit, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDeleteAccount } from "@/useCases/Account";

import { useConfirm } from "@/hook/useConfirm";
import useDrawer from "@/hook/useDrawer";

type TableActionProps = {
  id?: string;
};

const TableAction: React.FC<TableActionProps> = ({ id }) => {
  const { openDrawer, closeDrawer } = useDrawer();

  const deleteMutation = useDeleteAccount(id);

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          closeDrawer();
        },
      });
    }
  };

  const [ConfirmDelete, confirm] = useConfirm(
    "Are you sure",
    "You are about to perform a delete operation. This action cannot be undone.",
  );

  return (
    <>
      <ConfirmDelete />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="size-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-24">
          <DropdownMenuItem
            onClick={() => {
              openDrawer("edit-account", id);
            }}
            className="w-full"
          >
            <Edit className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              handleDelete();
            }}
            className="w-full"
          >
            <Trash className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default TableAction;
