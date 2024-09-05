import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

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
    onSuccess: () => {
      toast.success("Transaction created");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to create transactions");
    },
  });

  return mutation;
};

export default useCreateTransaction;
