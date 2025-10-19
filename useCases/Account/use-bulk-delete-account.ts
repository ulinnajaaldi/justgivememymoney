import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

import { ACCOUNT_QKEY } from ".";
import { SUMMARY_QKEY } from "../Summary";
import { TRANSACTION_QKEY } from "../Transactions";

type BulkDeleteAccountResType = InferResponseType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>;
type BulkDeleteAccountReqType = InferRequestType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>["json"];

const useBulkDeleteAccount = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    BulkDeleteAccountResType,
    Error,
    BulkDeleteAccountReqType
  >({
    mutationFn: async (json) => {
      const response = await client.api.accounts["bulk-delete"].$post({ json });
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
    onError: () => {
      toast.error("Failed to delete accounts");
    },
  });

  return mutation;
};

export default useBulkDeleteAccount;
