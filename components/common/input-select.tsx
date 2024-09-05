import React, { useMemo } from "react";

import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";

type InputSelectProps = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: { label: string; value: string }[];
  value?: string | null | undefined;
  placeholder?: string;
  disabled?: boolean;
};

const InputSelect: React.FC<InputSelectProps> = (props) => {
  const {
    onChange,
    onCreate,
    options = [],
    value,
    placeholder,
    disabled,
  } = props;

  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    if (!option) return;

    onChange(option.value);
  };

  const formattedValue = useMemo(() => {
    if (!value) return null;

    return options.find((option) => option.value === value);
  }, [value, options]);

  return (
    <CreatableSelect
      placeholder={placeholder}
      isDisabled={disabled}
      className="h-10 text-sm"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#e2e8f0",
          ":hover": {
            borderColor: "#e2e8f0",
          },
        }),
      }}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
    />
  );
};

export default InputSelect;
