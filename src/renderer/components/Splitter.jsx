import React from "react";
import styled from "styled-components";
import { displayName } from "../utils";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

const Splitter = displayName(
  "Splitter",
  styled(Allotment)`
    --focus-border: var(--selection);
    --separator-border: #fff1;
    --sash-size: 10px;
    --sash-hover-size: 10px;
  `
);

const StyledPane = displayName(
  "StyledPane",
  styled(Allotment.Pane)`
    display: grid;
    height: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: 0fr 1fr;
    gap: var(--gap-size);

    ${({ $paddingSide }) => $paddingSide && `padding-${$paddingSide}: 5px;`}
  `
);

export const SplitterPane = ({
  paddingSide,
  vertical,
  preferredSize,
  children,
}) => {
  return (
    <StyledPane
      vertical={vertical}
      preferredSize={preferredSize}
      $paddingSide={paddingSide}
    >
      {children}
    </StyledPane>
  );
};

export default Splitter;
