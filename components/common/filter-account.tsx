import React from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetAccounts } from "@/useCases/Account";

const FilterAccount = () => {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;
  const account = params.get("accountId") || "all";

  const { data: dataAccount, isLoading: isLoadingAccount } = useGetAccounts();

  const onChange = (value: string) => {
    const query = {
      accountId: value === "all" ? "" : value,
      from,
      to,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      {
        skipEmptyString: true,
        skipNull: true,
      },
    );

    router.push(url);
  };

  return (
    <Select
      value={account}
      onValueChange={onChange}
      disabled={isLoadingAccount}
    >
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Select Account" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Account</SelectItem>
        {dataAccount?.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterAccount;
