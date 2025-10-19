import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

import { TRANSACTION_QKEY } from ".";
import { SUMMARY_QKEY } from "../Summary";

type BulkCreateTransactionResType = InferResponseType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>;
type BulkCreateTransactionReqType = InferRequestType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>["json"];

const useBulkCreateTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    BulkCreateTransactionResType,
    Error,
    BulkCreateTransactionReqType
  >({
    mutationFn: async (json) => {
      const response = await client.api.transactions["bulk-create"].$post({
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
      toast.error(error.name || "Failed to create transactions");
    },
  });

  return mutation;
};

export default useBulkCreateTransaction;
