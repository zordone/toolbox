import React, {
  ChangeEventHandler,
  Dispatch,
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
  $error?: string | null;
  $fullWidth?: boolean;
  $isDropOk?: boolean;
  $monoSpace?: boolean;
}

const Input = displayName(
  "Input",
  styled.input.attrs<InputProps>(({ $error }) => ({
    title: $error ?? undefined,
    spellCheck: false,
  }))<InputProps>`
    ${cssFieldStyle}
    ${cssGridArea}
    ${({ $error }) =>
      $error &&
      `
      &:focus {
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
  `,
);

type Value = string | number | boolean;

export interface BasicFieldProps<T extends Value>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  area?: string;
  as?: "textarea" | "checkbox";
  fullWidth?: boolean;
  inputRef?: MutableRefObject<HTMLInputElement>;
  isDropOk?: boolean;
  monoSpace?: boolean;
  onChange?: (newValue: T) => void;
  onValidate: (value: string) => { error: string | null; value: T };
  readOnly?: boolean;
  rows?: number;
  setState?: Dispatch<SetStateAction<T>> | ((value: T) => void);
  state?: T;
}

const BasicField = <T extends Value>({
  area,
  fullWidth = false,
  inputRef,
  isDropOk,
  monoSpace = false,
  onChange = noop,
  onValidate,
  readOnly = false,
  setState = noop,
  state,
  type = "text",
  ...rest
}: BasicFieldProps<T>) => {
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>(String(state ?? ""));

  useEffect(() => {
    setInputValue(String(state ?? ""));
  }, [state]);

  const onChangeInternal: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const { type, checked, value } = event.target;
      const text = type === "checkbox" ? checked.toString() : value;
      const { value: validatedValue, error } = onValidate(text);
      setInputValue(String(text));
      setError(error);
      if (!error) {
        setState(validatedValue);
      }
      onChange(validatedValue);
    },
    [setState, onValidate, onChange],
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
      value={String(inputValue)}
      checked={inputValue === "true"}
      {...rest}
    />
  );
};

export default BasicField;
