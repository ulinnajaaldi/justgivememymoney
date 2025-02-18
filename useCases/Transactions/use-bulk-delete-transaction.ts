import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

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
    onSuccess: () => {
      toast.success("Transaction deleted");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to delete transactions");
    },
  });

  return mutation;
};

export default useBulkDeleteTransaction;
