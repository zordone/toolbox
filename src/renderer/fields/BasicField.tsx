import React, {
  ChangeEventHandler,
  Dispatch,
  FC,
  InputHTMLAttributes,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import {
  cssFieldStyle,
  CssFieldStyleProps,
  cssGridArea,
  CssGridAreaProps,
} from "../common/styledCss";
import { displayName, noop, stopPropagation } from "../utils";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    CssGridAreaProps,
    CssFieldStyleProps {
  $error?: string;
  $fullWidth?: boolean;
  $isDropOk?: boolean;
  $monoSpace?: boolean;
}

const Input = displayName(
  "Input",
  styled.input.attrs<InputProps>(({ $error }) => ({
    title: $error || null,
    spellCheck: false,
  }))<InputProps>`
    ${cssFieldStyle}
    ${cssGridArea}
    ${({ $error }) =>
      $error &&
      `
      :focus {
        outline: none;
        border-color: 0.1rem solid var(--error-outline);
        box-shadow: 0 0 0.3rem var(--error-outline);
      }
    `}
    ${({ $monoSpace }) =>
      $monoSpace &&
      `
      font-family: monospace;
    `}
    ${({ $fullWidth }) =>
      $fullWidth &&
      `
      width: 100%;
    `}
    ${({ $isDropOk }) =>
      $isDropOk === undefined
        ? ""
        : `box-shadow: 0 0 0 1px inset var(--${
            $isDropOk ? "ok" : "error"
          }-outline);`}
  `
);

type Value = string | number | boolean;
type Validator = (value: string) => { error: string | null; value: Value };

interface BasicFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  area?: string;
  as?: "textarea" | "checkbox";
  fullWidth?: boolean;
  inputRef?: MutableRefObject<HTMLInputElement>;
  isDropOk?: boolean;
  monoSpace?: boolean;
  onChange?: (newValue: Value) => void;
  onValidate?: Validator;
  readOnly?: boolean;
  rows?: number;
  setState?: Dispatch<SetStateAction<Value>>;
  state?: Value;
}

const defaultValidator: Validator = (text) => ({ error: null, value: text });

const BasicField: FC<BasicFieldProps> = ({
  area,
  fullWidth = false,
  inputRef,
  isDropOk,
  monoSpace = false,
  onChange = noop,
  onValidate = defaultValidator,
  readOnly = false,
  setState = noop,
  state = "",
  type = "text",
  ...rest
}) => {
  const [error, setError] = useState<string | null>();
  const [inputValue, setInputValue] = useState(state);

  useEffect(() => {
    setInputValue(state);
  }, [state]);

  const onChangeInternal: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const { type, checked, value } = event.target;
      const text = type === "checkbox" ? checked.toString() : value;
      const { value: validatedValue, error } = onValidate(text);
      setInputValue(text);
      setError(error);
      if (!error) {
        setState(validatedValue);
      }
      onChange(validatedValue);
    },
    [setState, onValidate, onChange]
  );

  return (
    <Input
      $area={area}
      $error={error}
      $fullWidth={fullWidth}
      $isDropOk={isDropOk}
      $monoSpace={monoSpace}
      onChange={onChangeInternal}
      onPaste={stopPropagation}
      readOnly={readOnly}
      ref={inputRef}
      type={type}
      value={inputValue.toString()}
      checked={inputValue === true}
      {...rest}
    />
  );
};

export default BasicField;
