import React from "react";
import BasicField, { BasicFieldProps } from "./BasicField";

interface FloatFieldProps extends Omit<BasicFieldProps<number>, "onValidate"> {
  onValidate?: BasicFieldProps<number>["onValidate"];
}

const defaultOnValidate = (text: string) => {
  const value = parseFloat(text);
  const error = isNaN(value) ? "Not a valid float" : null;
  return { value, error };
};

const FloatField = ({
  onValidate = defaultOnValidate,
  ...rest
}: FloatFieldProps) => (
  <BasicField<number> {...rest} type="number" onValidate={onValidate} />
);

export default FloatField;
