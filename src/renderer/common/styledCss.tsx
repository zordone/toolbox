import { css } from "styled-components";

export interface CssGridAreaProps {
  $area?: string;
}

export const cssGridArea = css<CssGridAreaProps>`
  ${({ $area }) => $area && `grid-area: ${$area};`}
`;

export interface CssFieldStyleProps {
  $chromeless?: boolean;
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

  :focus,
  :focus-within {
    outline: none;
    ${({ $chromeless }) =>
      !$chromeless &&
      `
      border-color: 0.1rem solid var(--focus-outline);
      box-shadow: 0 0 0.3rem var(--focus-outline);
    `}
  }

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
