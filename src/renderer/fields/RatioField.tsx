import React from "react";
import BasicField, { BasicFieldProps } from "./BasicField";

interface RatioFieldProps extends Omit<BasicFieldProps<string>, "onValidate"> {
  onValidate?: BasicFieldProps<string>["onValidate"];
}

const reRatio = /^(\d+):(\d+)$/;

const defaultOnValidate = (text: string) => {
  const match = reRatio.exec(text);
  const value = match ? `${match[1]}:${match[2]}` : "";
  const error = !match ? "Should be in WIDTH:HEIGHT format" : null;
  return { value, error };
};

const RatioField = ({
  onValidate = defaultOnValidate,
  ...rest
}: RatioFieldProps) => (
  <BasicField<string> {...rest} type="text" onValidate={onValidate} />
);

export default RatioField;
