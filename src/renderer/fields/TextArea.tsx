import React from "react";
import BasicField, { BasicFieldProps } from "./BasicField";

interface TextAreaProps extends Omit<BasicFieldProps<string>, "onValidate"> {
  onValidate?: BasicFieldProps<string>["onValidate"];
}

const defaultOnValidate = (text: string) => ({ value: text, error: null });

const TextArea = ({
  onValidate = defaultOnValidate,
  ...rest
}: TextAreaProps) => (
  <BasicField<string> {...rest} as="textarea" onValidate={onValidate} />
);

export default TextArea;
