import copyToClipboard from "copy-to-clipboard";
import React, { FC, HTMLAttributes, ReactNode, useCallback } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { capitalize, displayName, noop } from "../utils";
import Icon from "./Icon";
import {
  cssFieldStyle,
  CssFieldStyleProps,
  cssGridArea,
  CssGridAreaProps,
} from "./styledCss";

interface StyledButtonProps extends CssGridAreaProps, CssFieldStyleProps {
  $fullWidth?: boolean;
  $isOn?: boolean;
}

const StyledButton = displayName(
  "Button",
  styled.button<StyledButtonProps>`
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

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  area?: string;
  children?: ReactNode;
  chromeless?: boolean;
  fullWidth?: boolean;
  isOn?: boolean;
}

const Button: FC<ButtonProps> = ({
  isOn,
  chromeless,
  fullWidth,
  children,
  area,
  ...rest
}) => (
  <StyledButton
    $area={area}
    $isOn={isOn}
    $chromeless={chromeless}
    $fullWidth={fullWidth}
    {...rest}
  >
    {children}
  </StyledButton>
);

export default Button;

interface IconButtonProps extends ButtonProps {
  iconStyle?: string;
  icon: string;
}

export const IconButton: FC<IconButtonProps> = ({
  iconStyle,
  icon,
  ...rest
}) => {
  return (
    <Button {...rest}>
      <Icon iconStyle={iconStyle} name={icon} />
    </Button>
  );
};

interface CopyButtonProps extends Omit<IconButtonProps, "icon"> {
  name: string;
  state: string;
}

export const CopyButton: FC<CopyButtonProps> = ({ name, state, ...rest }) => {
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

interface PasteButtonProps extends Omit<IconButtonProps, "icon"> {
  name: string;
  setState: (state: string) => void;
}

export const PasteButton: FC<PasteButtonProps> = ({
  name,
  setState,
  ...rest
}) => {
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

interface OnOffButtonProps extends Partial<IconButtonProps> {
  state: boolean;
  setState: (state: boolean) => void;
}

export const OnOffButton: FC<OnOffButtonProps> = ({
  state,
  setState,
  ...rest
}) => {
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

interface OpenButtonProps extends Partial<IconButtonProps> {
  dialogOptions: Electron.CrossProcessExports.OpenDialogOptions;
  fieldName: string;
  setContent: (content: string) => void;
  setName: (name: string) => void;
}

export const OpenButton: FC<OpenButtonProps> = ({
  dialogOptions,
  fieldName,
  setContent,
  setName,
  ...rest
}) => {
  const open = useCallback(() => {
    window.mainApi
      .showOpenDialog({ options: dialogOptions })
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

interface SaveButtonProps extends Partial<IconButtonProps> {
  content: string;
  dialogOptions: Electron.CrossProcessExports.SaveDialogOptions;
  fieldName: string;
}

export const SaveButton: FC<SaveButtonProps> = ({
  content,
  dialogOptions,
  fieldName,
  ...rest
}) => {
  const save = useCallback(() => {
    window.mainApi
      .showSaveDialog({ content, options: dialogOptions })
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
