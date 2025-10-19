import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

import { TRANSACTION_QKEY } from ".";
import { SUMMARY_QKEY } from "../Summary";

type BulkDeleteTransactionResType = InferResponseType<
  (typeof client.api.transactions)["bulk-delete"]["$post"]
>;
type BulkDeleteTransactionReqType = InferRequestType<
  (typeof client.api.transactions)["bulk-delete"]["$post"]
>["json"];

const useBulkDeleteTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    BulkDeleteTransactionResType,
    Error,
    BulkDeleteTransactionReqType
  >({
    mutationFn: async (json) => {
      const response = await client.api.transactions["bulk-delete"].$post({
        json,
      });
      return await response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: TRANSACTION_QKEY.ALL_WITHOUT_FILTER,
      });
      queryClient.invalidateQueries({
        queryKey: SUMMARY_QKEY.ALL_WITHOUT_FILTER,
      });
    },
    onError: (error: Error) => {
      toast.error(error.name || "Failed to delete transactions");
    },
  });

  return mutation;
};

export default useBulkDeleteTransaction;
