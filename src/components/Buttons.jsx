import copyToClipboard from "copy-to-clipboard";
import React, { useCallback } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import Icon from "../components/Icon";
import { displayName, capitalize, noop } from "../utils";
import { cssFieldStyle, cssGridArea } from "./styledCss";

const StyledButton = displayName(
  "Button",
  styled.button`
    ${cssFieldStyle}
    ${cssGridArea}
    border: none;
    cursor: pointer;
    font-size: inherit;
    padding: 0.2rem 0.5rem;
    color: ${({ $isOn }) => ($isOn ? "var(--input-fg)" : "currentColor")};
    ${({ $chromeless }) =>
      $chromeless &&
      `
      && {
        background: none; 
        padding: unset;
        border: none;
        box-shadow: none;
      }
    `}
    ${({ $fullWidth }) => $fullWidth && `width: 100%;`}
  `
);

const Button = ({ isOn, chromeless, fullWidth, children, ...rest }) => (
  <StyledButton
    $isOn={isOn}
    $chromeless={chromeless}
    $fullWidth={fullWidth}
    {...rest}
  >
    {children}
  </StyledButton>
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

export const OnOfffButton = ({ state, setState, ...rest }) => {
  const isOn = !!state;
  return (
    <IconButton
      icon={isOn ? "fa-toggle-on" : "fa-toggle-off"}
      isOn={isOn}
      onClick={() => setState(!state)}
      title="Toggle On / Off`"
      {...rest}
    />
  );
};

export const OpenButton = ({
  fieldName,
  setName,
  setContent,
  dialogOptions,
  ...rest
}) => {
  const open = useCallback(() => {
    window.electronApi
      ?.showOpenDialog(dialogOptions)
      .then(({ name, content }) => {
        if (content !== null) {
          setName(name);
          setContent(content);
          toast.success(capitalize(`File loaded.`));
        }
      })
      .catch(noop);
  }, [dialogOptions, setContent, setName]);
  return (
    <IconButton
      icon="fa-folder-open"
      onClick={open}
      title={`Open ${fieldName} file`}
      {...rest}
    />
  );
};

export const SaveButton = ({ fieldName, content, dialogOptions, ...rest }) => {
  const save = useCallback(() => {
    window.electronApi
      ?.showSaveDialog(content, dialogOptions)
      .then(({ name }) => {
        if (name) {
          toast.success(capitalize(`File saved to: ${name}`));
        }
      })
      .catch(noop);
  }, [content, dialogOptions]);
  return (
    <IconButton
      icon="fa-save"
      onClick={save}
      title={`Save ${fieldName} file`}
      {...rest}
    />
  );
};
