import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type EditTransactionResType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$patch"]
>;
type EditTransactionReqType = InferRequestType<
  (typeof client.api.transactions)[":id"]["$patch"]
>["json"];

const useEditTransaction = (id?: string) => {
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
    onSuccess: () => {
      toast.success("Transaction updated");
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to update transaction");
    },
  });

  return mutation;
};

export default useEditTransaction;
