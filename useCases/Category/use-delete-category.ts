import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

import { CATEGORY_QKEY } from ".";
import { SUMMARY_QKEY } from "../Summary";
import { TRANSACTION_QKEY } from "../Transactions";

type DeleteCategoryResType = InferResponseType<
  (typeof client.api.categories)[":id"]["$delete"]
>;
const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<DeleteCategoryResType, Error>({
    mutationFn: async () => {
      const response = await client.api.categories[":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: CATEGORY_QKEY.ALL });
      queryClient.invalidateQueries({
        queryKey: SUMMARY_QKEY.ALL_WITHOUT_FILTER,
      });
      queryClient.invalidateQueries({
        queryKey: TRANSACTION_QKEY.ALL_WITHOUT_FILTER,
      });
    },
    onError: (error: Error) => {
      toast.error(error.name || "Failed to delete category");
    },
  });

  return mutation;
};

export default useDeleteCategory;
