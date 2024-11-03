import React from "react";
import BasicField, { BasicFieldProps } from "./BasicField";

interface IntegerFieldProps
  extends Omit<BasicFieldProps<number>, "onValidate"> {
  onValidate?: BasicFieldProps<number>["onValidate"];
}

const defaultOnValidate = (text: string) => {
  const value = parseInt(text, 10);
  const error = isNaN(value) ? "Not a valid integer" : null;
  return { value, error };
};

const IntegerField = ({
  onValidate = defaultOnValidate,
  ...rest
}: IntegerFieldProps) => (
  <BasicField<number> {...rest} type="number" onValidate={onValidate} />
);

export default IntegerField;
