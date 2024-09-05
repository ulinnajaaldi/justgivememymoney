import React from "react";

import { InfoIcon, MinusCircleIcon, PlusCircleIcon } from "lucide-react";
import CurrencyInput from "react-currency-input-field";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

type InputAmmountProps = {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
};

const InputAmmount = React.forwardRef<HTMLInputElement, InputAmmountProps>(
  (props, ref) => {
    const { value, onChange, disabled, placeholder } = props;

    const parseValue = parseFloat(value);
    const isIncome = parseValue > 0;
    const isOutcome = parseValue < 0;

    const onReverseValue = () => {
      if (!value) return;

      const newValue = parseFloat(value) * -1;
      onChange(newValue.toString());
    };

    return (
      <div className="relative">
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onReverseValue}
                className={cn(
                  "absolute left-1.5 top-1.5 flex items-center justify-center rounded-md bg-slate-400 p-2 transition hover:bg-slate-500",
                  isIncome && "bg-emerald-500 hover:bg-emerald-600",
                  isOutcome && "bg-red-500 hover:bg-red-600",
                )}
              >
                {!parseValue && <InfoIcon className="size-3 text-white" />}
                {isIncome && <PlusCircleIcon className="size-3 text-white" />}
                {isOutcome && <MinusCircleIcon className="size-3 text-white" />}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Use [+] for income and [-] for outcome
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <CurrencyInput
          ref={ref}
          prefix="IDR "
          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-10 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={placeholder}
          value={value}
          onValueChange={onChange}
          disabled={disabled}
          decimalsLimit={2}
          decimalScale={2}
          groupSeparator="."
          decimalSeparator=","
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {isIncome && "This will count as income"}
          {isOutcome && "This will count as outcome"}
        </p>
      </div>
    );
  },
);

InputAmmount.displayName = "InputAmmount";

export default InputAmmount;
