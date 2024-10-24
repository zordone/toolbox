import styled from "styled-components";
import { cssGridArea, CssGridAreaProps } from "../common/styledCss";
import { displayName } from "../utils";

const FieldLabel = displayName(
  "FieldLabel",
  styled.span<CssGridAreaProps>`
    ${cssGridArea}
    align-self: center;
  `
);

export default FieldLabel;
