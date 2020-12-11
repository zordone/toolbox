import React from "react";
import styled from "styled-components";
import { displayName } from "../utils";
import SplitPane from "react-split-pane";

const RelativeContainer = displayName(
  "RelativeContainer",
  styled.div`
    height: 100%;
    position: relative;
  `
);

const SplitterContainer = displayName(
  "SplitterContainer",
  styled(SplitPane)`
    width: 100%;
    > span.Resizer:before {
      content: "";
      height: 10%;
      width: 2px;
      border-left: 1px solid currentColor;
      border-right: 1px solid currentColor;
    }
    > span.Resizer {
      width: 0.5rem;
      cursor: col-resize;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff2;
    }
    > span.Resizer:hover {
      color: #fff6;
    }
  `
);

export const SplitterPane = displayName(
  "SplitterPane",
  styled.div`
    display: grid;
    height: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: 0fr 1fr;
    gap: var(--gap-size);
  `
);

const Splitter = ({ children, ...rest }) => (
  <RelativeContainer>
    <SplitterContainer {...rest}>{children}</SplitterContainer>
  </RelativeContainer>
);

export default Splitter;
