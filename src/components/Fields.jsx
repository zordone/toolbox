import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { noop, displayName, stopPropagation, preventDefault } from "../utils";
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
    ${({ isDropOk }) =>
      isDropOk === undefined
        ? ""
        : `box-shadow: 0 0 0 1px inset var(--${
            isDropOk ? "ok" : "error"
          }-outline);`}
  `
);

const defaultValidator = (text) => ({ error: null, value: text });

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

export const IntegerField = (props) => (
  <BasicField
    {...props}
    type="number"
    onValidate={(text) => {
      const value = parseInt(text, 10);
      const error = isNaN(value) ? "Not a valid integer" : null;
      return { value, error };
    }}
  />
);

export const FloatField = (props) => (
  <BasicField
    {...props}
    type="number"
    onValidate={(text) => {
      const value = parseFloat(text, 10);
      const error = isNaN(value) ? "Not a valid float" : null;
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

export const FileField = ({
  name,
  placeholder = "Drop a file or URL here",
  setName = noop,
  content,
  setContent = noop,
  allowTypes = [],
  ...props
}) => {
  const [isDropOk, setIsDropOk] = useState();

  const getUrl = (event) => event.dataTransfer.getData("URL");

  const getItem = (event) => {
    const items = [...event.dataTransfer.items].filter((item) => {
      const isFile =
        item.kind === "file" &&
        (allowTypes.length === 0 || allowTypes.includes(item.type));
      const isUrl = item.kind === "string" && item.type === "text/uri-list";
      return isFile || isUrl;
    });
    return items[0];
  };

  const getFile = (event) => {
    const files = [...event.dataTransfer.files].filter(
      (file) => allowTypes.length === 0 || allowTypes.includes(file.type)
    );
    return files[0];
  };

  return (
    <BasicField
      {...props}
      state={name}
      type="text"
      placeholder={placeholder}
      readOnly
      fullWidth
      isDropOk={isDropOk}
      onDragOver={preventDefault}
      onDragEnter={(event) => {
        preventDefault(event);
        setIsDropOk(!!getItem(event));
      }}
      onDragLeave={(event) => {
        preventDefault(event);
        setIsDropOk(undefined);
      }}
      onDrop={(event) => {
        preventDefault(event);
        setIsDropOk(undefined);
        // url?
        const url = getUrl(event);
        if (url) {
          fetch(url)
            .then((res) => res.text())
            .then((content) => {
              setName(url);
              setContent(content);
            })
            .catch(console.error);
          return;
        }
        // file?
        const file = getFile(event);
        if (file) {
          file
            .text()
            .then((content) => {
              setName(file.name);
              setContent(content);
            })
            .catch(console.error);
          return;
        }
        // other
        console.warn("Unknown drop", event.dataTransfer);
      }}
    />
  );
};
