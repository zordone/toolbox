import { displayName } from "../utils";
import styled from "styled-components";
import { cssGridArea, CssGridAreaProps } from "./styledCss";

export const Footer = displayName(
  "Footer",
  styled.div<CssGridAreaProps>`
    ${cssGridArea};
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
  `
);
