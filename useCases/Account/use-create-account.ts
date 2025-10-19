import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

import { ACCOUNT_QKEY } from ".";

type CreateAccountResType = InferResponseType<typeof client.api.accounts.$post>;
type CreateAccountReqType = InferRequestType<
  typeof client.api.accounts.$post
>["json"];

const useCreateAccount = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateAccountResType,
    Error,
    CreateAccountReqType
  >({
    mutationFn: async (json) => {
      const response = await client.api.accounts.$post({ json });
      return await response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QKEY.ALL });
    },
    onError: (error: Error) => {
      toast.error(error.name || "Failed to create account");
    },
  });

  return mutation;
};

export default useCreateAccount;
