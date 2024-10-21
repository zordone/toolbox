import { css } from "styled-components";

export const cssGridArea = css`
  ${({ $area }) => $area && `grid-area: ${$area};`}
`;

export const cssFieldStyle = css`
  background: var(--input-bg);
  color: var(--input-fg);
  border: none;
  outline: none;
  padding: 0.2rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  box-sizing: border-box;

  :focus,
  :focus-within {
    outline: none;
    ${({ chromeless }) =>
      !chromeless &&
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
