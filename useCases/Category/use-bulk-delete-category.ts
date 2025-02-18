import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

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
    onSuccess: () => {
      toast.success("Categories deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to delete categories");
    },
  });

  return mutation;
};

export default useBulkDeleteCategory;
