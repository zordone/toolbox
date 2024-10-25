import React, { ComponentProps, FC } from "react";
import BasicField from "./BasicField";
import { displayName } from "../utils";
import { cssFieldStyle, CssFieldStyteProps } from "../common/styledCss";
import styled from "styled-components";

const Container = displayName(
  "Container",
  styled.div<CssFieldStyteProps>`
    ${cssFieldStyle}
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
  `
);

const BooleanField: FC<ComponentProps<typeof BasicField>> = (props) => (
  <Container>
    <BasicField
      {...props}
      type="checkbox"
      onValidate={(text: string) => ({ value: text === "true", error: null })}
    />
    <span>{props.state ? "Yes" : "No"}</span>
  </Container>
);

export default BooleanField;
