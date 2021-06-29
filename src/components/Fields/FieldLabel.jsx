import styled from "styled-components";
import { cssGridArea } from "../styledCss";
import { displayName } from "../../utils";

const FieldLabel = displayName(
  "FieldLabel",
  styled.span`
    ${cssGridArea}
    align-self: center;
  `
);

export default FieldLabel;
