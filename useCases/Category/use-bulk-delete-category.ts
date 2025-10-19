import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

import { CATEGORY_QKEY } from ".";
import { SUMMARY_QKEY } from "../Summary";
import { TRANSACTION_QKEY } from "../Transactions";

type BulkDeleteCategoryResType = InferResponseType<
  (typeof client.api.categories)["bulk-delete"]["$post"]
>;
type BulkDeleteCategoryReqType = InferRequestType<
  (typeof client.api.categories)["bulk-delete"]["$post"]
>["json"];

const useBulkDeleteCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    BulkDeleteCategoryResType,
    Error,
    BulkDeleteCategoryReqType
  >({
    mutationFn: async (json) => {
      const response = await client.api.categories["bulk-delete"].$post({
        json,
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
      toast.error(error.name || "Failed to delete categories");
    },
  });

  return mutation;
};

export default useBulkDeleteCategory;
