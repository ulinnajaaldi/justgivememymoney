import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type CreateCategoryResType = InferResponseType<
  typeof client.api.categories.$post
>;
type CreateCategoryReqType = InferRequestType<
  typeof client.api.categories.$post
>["json"];

const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateCategoryResType,
    Error,
    CreateCategoryReqType
  >({
    mutationFn: async (json) => {
      const response = await client.api.categories.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed to create category");
    },
  });

  return mutation;
};

export default useCreateCategory;
