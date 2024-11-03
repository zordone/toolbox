import React from "react";
import BasicField, { BasicFieldProps } from "./BasicField";

interface TextFieldProps extends Omit<BasicFieldProps<string>, "onValidate"> {
  onValidate?: BasicFieldProps<string>["onValidate"];
}

const defaultOnValidate = (text: string) => ({ value: text, error: null });

const TextField = ({
  onValidate = defaultOnValidate,
  ...rest
}: TextFieldProps) => (
  <BasicField<string> type="text" onValidate={onValidate} {...rest} />
);

export default TextField;
