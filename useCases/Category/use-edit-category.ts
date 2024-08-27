import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type EditCategoryResType = InferResponseType<
  (typeof client.api.categories)[":id"]["$patch"]
>;
type EditCategoryReqType = InferRequestType<
  (typeof client.api.categories)[":id"]["$patch"]
>["json"];

const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<EditCategoryResType, Error, EditCategoryReqType>(
    {
      mutationFn: async (json) => {
        const response = await client.api.categories[":id"]["$patch"]({
          param: { id },
          json,
        });
        return await response.json();
      },
      onSuccess: () => {
        toast.success("Category updated");
        queryClient.invalidateQueries({ queryKey: ["category", { id }] });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        // TODO: Invalidate summary and transactions
      },
      onError: () => {
        toast.error("Failed to update category");
      },
    },
  );

  return mutation;
};

export default useEditCategory;
