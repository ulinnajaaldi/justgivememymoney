import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

import { CATEGORY_QKEY } from ".";
import { SUMMARY_QKEY } from "../Summary";
import { TRANSACTION_QKEY } from "../Transactions";

type EditCategoryResType = InferResponseType<
  (typeof client.api.categories)[":id"]["$patch"]
>;
type EditCategoryReqType = InferRequestType<
  (typeof client.api.categories)[":id"]["$patch"]
>["json"];

const useEditCategory = (id: string) => {
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
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: CATEGORY_QKEY.DETAIL(id) });
        queryClient.invalidateQueries({ queryKey: CATEGORY_QKEY.ALL });
        queryClient.invalidateQueries({
          queryKey: SUMMARY_QKEY.ALL_WITHOUT_FILTER,
        });
        queryClient.invalidateQueries({
          queryKey: TRANSACTION_QKEY.ALL_WITHOUT_FILTER,
        });
      },
      onError: (error: Error) => {
        toast.error(error.name || "Failed to edit category");
      },
    },
  );

  return mutation;
};

export default useEditCategory;
