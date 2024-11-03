import React from "react";
import BasicField, { BasicFieldProps } from "./BasicField";

interface RatioFieldProps extends Omit<BasicFieldProps<string>, "onValidate"> {
  onValidate?: BasicFieldProps<string>["onValidate"];
}

const defaultOnValidate = (text: string) => {
  const match = text.match(/^(\d+):(\d+)$/);
  const value = match ? `${match[1]}:${match[2]}` : "";
  const error = !match ? "Should be in XXX:YYY format" : null;
  return { value, error };
};

const RatioField = ({
  onValidate = defaultOnValidate,
  ...rest
}: RatioFieldProps) => (
  <BasicField<string> {...rest} type="text" onValidate={onValidate} />
);

export default RatioField;
