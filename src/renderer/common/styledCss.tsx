import { css } from "styled-components";

export interface CssGridAreaProps {
  $area?: string;
}

export const cssGridArea = css<CssGridAreaProps>`
  ${({ $area }) => $area && `grid-area: ${$area};`}
`;

export interface CssFocusStyleProps {
  $chromeless?: boolean;
}

export const cssFocusStyle = css<CssFocusStyleProps>`
  outline: none;

  &:focus-visible {
    ${({ $chromeless }) =>
      !$chromeless &&
      `      
        /* also change it in CodeEditor */
        outline: 1px solid var(--focus-outline);
        outline-offset: -1px;
    `}
  }
`;

export interface CssFieldStyleProps extends CssFocusStyleProps {
  // this on is intentionally not transient, as the native props is also called readOnly
  readOnly?: boolean;
}

export const cssFieldStyle = css<CssFieldStyleProps>`
  background: var(--input-bg);
  color: var(--input-fg);
  border: none;
  outline: none;
  padding: 0.2rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  box-sizing: border-box;
  resize: none;

  ${cssFocusStyle};

  ${({ readOnly }) =>
    readOnly &&
    `
    background: var(--input-bg-readonly);
    color: var(--input-fg-readonly);
  `}
`;

export const cssShadow = css`
  box-shadow: 0 0 1rem #0006;
`;
