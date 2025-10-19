import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

import { TRANSACTION_QKEY } from ".";
import { SUMMARY_QKEY } from "../Summary";

type CreateTransactionResType = InferResponseType<
  typeof client.api.transactions.$post
>;
type CreateTransactionReqType = InferRequestType<
  typeof client.api.transactions.$post
>["json"];

const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateTransactionResType,
    Error,
    CreateTransactionReqType
  >({
    mutationFn: async (json) => {
      const response = await client.api.transactions.$post({ json });
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

export default useCreateTransaction;
