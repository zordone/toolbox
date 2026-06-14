import { displayName } from "../utils";
import styled from "styled-components";

interface ValueProps {
  $small?: boolean;
}

export const Value = displayName(
  "Value",
  styled.span<ValueProps>`
    font-weight: 700;
    font-size: ${({ $small }) => ($small ? 1 : 1.5)}rem;
  `,
);
