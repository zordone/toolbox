import { Allotment } from "allotment";
import "allotment/dist/style.css";
import React, { ComponentProps, FC, ReactNode } from "react";
import styled from "styled-components";
import { displayName } from "../utils";

const Splitter = displayName(
  "Splitter",
  styled(Allotment)`
    --focus-border: var(--selection);
    --separator-border: #fff1;
    --sash-size: 10px;
    --sash-hover-size: 10px;
  `
);

interface StyledPaneProps extends ComponentProps<typeof Allotment.Pane> {
  $paddingSide?: "left" | "right" | "top" | "bottom";
}

const StyledPane = displayName(
  "StyledPane",
  styled(Allotment.Pane)<StyledPaneProps>`
    display: grid;
    height: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: 0fr 1fr;
    gap: var(--gap-size);

    ${({ $paddingSide }) => $paddingSide && `padding-${$paddingSide}: 5px;`}
  `
);

interface SplitterPaneProps {
  children?: ReactNode;
  paddingSide?: "left" | "right" | "top" | "bottom";
}

export const SplitterPane: FC<SplitterPaneProps> = ({
  children,
  paddingSide,
}) => <StyledPane $paddingSide={paddingSide}>{children}</StyledPane>;

export default Splitter;
