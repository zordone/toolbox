import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { noop, displayName, stopPropagation } from "../../utils";
import { cssFieldStyle, cssGridArea } from "../styledCss";

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
    ${({ isDropOk }) =>
      isDropOk === undefined
        ? ""
        : `box-shadow: 0 0 0 1px inset var(--${
            isDropOk ? "ok" : "error"
          }-outline);`}
  `
);

const defaultValidator = (text) => ({ error: null, value: text });

const BasicField = ({
  type = "text",
  state = "",
  setState = noop,
  readOnly = false,
  monoSpace = false,
  onValidate = defaultValidator,
  onChange = noop,
  inputRef,
  ...rest
}) => {
  const [error, setError] = useState();
  const [inputValue, setInputValue] = useState(state);

  useEffect(() => {
    setInputValue(state);
  }, [state]);

  const onChangeInternal = useCallback(
    (event) => {
      const text = event.target.value;
      const { value, error } = onValidate(text);
      setInputValue(text);
      setError(error);
      if (!error) {
        setState(value);
      }
      onChange(value);
    },
    [setState, onValidate, onChange]
  );

  return (
    <Input
      ref={inputRef}
      type={type}
      value={inputValue}
      onChange={onChangeInternal}
      error={error}
      readOnly={readOnly}
      monoSpace={monoSpace}
      onPaste={stopPropagation}
      {...rest}
    />
  );
};

export default BasicField;
