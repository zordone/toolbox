import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { noop, displayName } from "../utils";
import { cssFieldStyle, cssGridArea } from "./styledCss";

const Input = displayName(
  "Input",
  styled.input.attrs(({ readOnly, error }) => ({
    readonly: readOnly,
    title: error || null,
    spellCheck: false,
  }))`
    ${cssFieldStyle}
    ${cssGridArea}
    ${({ error }) =>
      error &&
      `
      :focus {
        outline: none;
        border-color: 0.1rem solid var(--error-outline);
        box-shadow: 0 0 0.3rem var(--error-outline);
      }
    `}
    ${({ monoSpace }) =>
      monoSpace &&
      `
      font-family: monospace;
    `}
    ${({ fullWidth }) =>
      fullWidth &&
      `
      width: 100%;
    `}
  `
);

const defaultValidator = (text) => ({ error: null, value: text });

const stopPropagation = (event) => {
  event.stopPropagation();
};

export const BasicField = ({
  type = "text",
  state = "",
  setState = noop,
  readOnly = false,
  monoSpace = false,
  onValidate = defaultValidator,
  inputRef,
  ...rest
}) => {
  const [error, setError] = useState();
  const [inputValue, setInputValue] = useState(state);

  useEffect(() => {
    setInputValue(state);
  }, [state]);

  const onChange = useCallback(
    (event) => {
      const text = event.target.value;
      const { value, error } = onValidate(text);
      setInputValue(text);
      setError(error);
      if (!error) {
        setState(value);
      }
    },
    [setState, onValidate]
  );

  return (
    <Input
      ref={inputRef}
      type={type}
      value={inputValue}
      onChange={onChange}
      error={error}
      readOnly={readOnly}
      monoSpace={monoSpace}
      onPaste={stopPropagation}
      {...rest}
    />
  );
};

export const TextField = (props) => <BasicField {...props} type="text" />;

export const TextArea = (props) => <BasicField {...props} as="textarea" />;

export const NumberField = (props) => (
  <BasicField
    {...props}
    type="number"
    onValidate={(text) => {
      const value = parseInt(text, 10);
      const error = isNaN(value) ? "Not a valid number" : null;
      return { value, error };
    }}
  />
);

export const RatioField = (props) => (
  <BasicField
    {...props}
    type="text"
    onValidate={(text) => {
      const match = text.match(/^(\d+):(\d+)$/);
      const value = match ? `${match[1]}:${match[2]}` : "";
      const error = !match ? "Should be in XXX:YYY format" : null;
      return { value, error };
    }}
  />
);

export const FieldLabel = displayName(
  "FieldLabel",
  styled.span`
    ${cssGridArea}
    align-self: center;
  `
);
