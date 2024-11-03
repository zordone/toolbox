import React from "react";
import styled from "styled-components";
import BasicField, { BasicFieldProps } from "./BasicField";
import { displayName } from "../utils";
import { cssFieldStyle, CssFieldStyleProps } from "../common/styledCss";

const Container = displayName(
  "Container",
  styled.div<CssFieldStyleProps>`
    ${cssFieldStyle};
    display: flex;
    align-items: center;
    gap: 0.2rem;

    & input {
      width: 1rem;
      height: 1rem;
      display: inline-block;
      accent-color: var(--input-fg);
      margin: 0;

      &:not(:checked) {
        opacity: 0.1;
      }
    }
  `,
);

interface BooleanFieldProps
  extends Omit<BasicFieldProps<boolean>, "onValidate"> {
  onValidate?: (text: string) => { value: boolean; error: string | null };
}

const defaultOnValidate = (text: string) => ({
  value: text === "true",
  error: null,
});

const BooleanField = ({
  onValidate = defaultOnValidate,
  state,
  ...rest
}: BooleanFieldProps) => (
  <Container>
    <BasicField<boolean>
      {...rest}
      type="checkbox"
      onValidate={onValidate}
      state={state}
    />
    <span>{state ? "Yes" : "No"}</span>
  </Container>
);

export default BooleanField;
