import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

import { ACCOUNT_QKEY } from ".";
import { SUMMARY_QKEY } from "../Summary";
import { TRANSACTION_QKEY } from "../Transactions";

type EditAccountResType = InferResponseType<
  (typeof client.api.accounts)[":id"]["$patch"]
>;
type EditAccountReqType = InferRequestType<
  (typeof client.api.accounts)[":id"]["$patch"]
>["json"];

const useEditAccount = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<EditAccountResType, Error, EditAccountReqType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts[":id"]["$patch"]({
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QKEY.DETAIL(id) });
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QKEY.ALL });
      queryClient.invalidateQueries({
        queryKey: SUMMARY_QKEY.ALL_WITHOUT_FILTER,
      });
      queryClient.invalidateQueries({
        queryKey: TRANSACTION_QKEY.ALL_WITHOUT_FILTER,
      });
    },
    onError: () => {
      toast.error("Failed to update account");
    },
  });

  return mutation;
};

export default useEditAccount;
