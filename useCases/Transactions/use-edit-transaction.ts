import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

import { TRANSACTION_QKEY } from ".";
import { SUMMARY_QKEY } from "../Summary";

type EditTransactionResType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$patch"]
>;
type EditTransactionReqType = InferRequestType<
  (typeof client.api.transactions)[":id"]["$patch"]
>["json"];

const useEditTransaction = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    EditTransactionResType,
    Error,
    EditTransactionReqType
  >({
    mutationFn: async (json) => {
      const response = await client.api.transactions[":id"]["$patch"]({
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: TRANSACTION_QKEY.DETAIL(id) });
      queryClient.invalidateQueries({
        queryKey: TRANSACTION_QKEY.ALL_WITHOUT_FILTER,
      });
      queryClient.invalidateQueries({
        queryKey: SUMMARY_QKEY.ALL_WITHOUT_FILTER,
      });
    },
    onError: (error: Error) => {
      toast.error(error.name || "Failed to update transaction");
    },
  });

  return mutation;
};

export default useEditTransaction;
