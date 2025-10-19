import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

import { ACCOUNT_QKEY } from ".";
import { SUMMARY_QKEY } from "../Summary";
import { TRANSACTION_QKEY } from "../Transactions";

type DeleteAccountResType = InferResponseType<
  (typeof client.api.accounts)[":id"]["$delete"]
>;
const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<DeleteAccountResType, Error>({
    mutationFn: async () => {
      const response = await client.api.accounts[":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QKEY.ALL });
      queryClient.invalidateQueries({
        queryKey: SUMMARY_QKEY.ALL_WITHOUT_FILTER,
      });
      queryClient.invalidateQueries({
        queryKey: TRANSACTION_QKEY.ALL_WITHOUT_FILTER,
      });
    },
    onError: (error: Error) => {
      toast.error(error.name || "Failed to delete account");
    },
  });

  return mutation;
};

export default useDeleteAccount;
