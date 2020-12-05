import { css } from "styled-components";

export const cssGridArea = css`
  ${({ area }) => area && `grid-area: ${area};`}
`;

export const cssFieldStyle = css`
  background: var(--input-bg);
  color: var(--input-color);
  border: none;
  outline: none;
  padding: 0.2rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  :focus {
    outline: none;
    border-color: 0.1rem solid var(--focus-outline);
    box-shadow: 0 0 0.3rem var(--focus-outline);
  }
  ${({ readOnly }) =>
    readOnly &&
    `
    background: var(--input-bg-readonly);
    color: var(--input-fg-readonly);
  `}
`;
