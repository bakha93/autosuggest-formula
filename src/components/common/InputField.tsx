import React, { ChangeEvent } from "react";

type Props = {
  value: string;
  onChange: (e?: ChangeEvent<HTMLInputElement>) => void;
  type: string;
  placeholder: string;
  onEnterPress: (e?: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const InputField = ({
  value,
  onChange,
  type,
  placeholder,
  onEnterPress,
}: Props) => {
  return (
    <input
      type={type}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          onEnterPress(e);
        }
      }}
      className="block w-full p-2 text-gray-900 border-0 text-md outline-0"
    />
  );
};
