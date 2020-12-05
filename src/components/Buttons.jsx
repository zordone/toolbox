import copyToClipboard from "copy-to-clipboard";
import React, { useCallback } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import Icon from "../components/Icon";
import { displayName, capitalize } from "../utils";
import { cssFieldStyle, cssGridArea } from "./styledCss";

const Button = displayName(
  "Button",
  styled.button`
    ${cssFieldStyle}
    ${cssGridArea}
    border: none;
    cursor: pointer;
    font-size: inherit;
    padding: 0.2rem 1rem;
    color: ${({ isOn }) => (isOn ? "var(--input-color)" : "currentColor")};
    ${({ chromeless }) =>
      chromeless &&
      `
      background: none; 
      padding: unset;
    `}
  `
);

export default Button;

export const IconButton = ({ iconStyle, icon, ...rest }) => {
  return (
    <Button {...rest}>
      <Icon iconStyle={iconStyle} name={icon} />
    </Button>
  );
};

export const CopyButton = ({ name, state, ...rest }) => {
  const copy = useCallback(() => {
    copyToClipboard(state);
    toast.success(capitalize(`${name} copied to clipboard.`));
  }, [name, state]);
  return (
    <IconButton
      icon="fa-copy"
      onClick={copy}
      title={`Copy ${name} to clipboard`}
      {...rest}
    />
  );
};

export const PasteButton = ({ name, setState, ...rest }) => {
  const paste = useCallback(() => {
    navigator.clipboard.readText().then((text) => {
      setState(text);
      toast.success(capitalize(`Pasted into ${name}.`));
    });
  }, [name, setState]);
  return (
    <IconButton
      icon="fa-paste"
      onClick={paste}
      title={`Paste into ${name}`}
      {...rest}
    />
  );
};