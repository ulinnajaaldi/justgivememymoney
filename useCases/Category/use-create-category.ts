import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

import { CATEGORY_QKEY } from ".";

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
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: CATEGORY_QKEY.ALL });
    },
    onError: (error: Error) => {
      toast.error(error.name || "Failed to create category");
    },
  });

  return mutation;
};

export default useCreateCategory;
