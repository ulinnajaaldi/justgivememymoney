import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

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
    onSuccess: () => {
      toast.success("Transaction created");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to create transactions");
    },
  });

  return mutation;
};

export default useBulkCreateTransaction;
