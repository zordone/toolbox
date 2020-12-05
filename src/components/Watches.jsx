import React from "react";
import styled from "styled-components";
import { displayName } from "../utils";
import { cssFieldStyle, cssGridArea } from "./styledCss";
import { IconButton } from "./Buttons";
import JsonViewer from "./JsonViewer";

const WatchesScroller = displayName(
  "WatchesScroller",
  styled.div`
    ${cssGridArea}
    position: relative;
    overflow: scroll;
    position: relative;
    height: 100%;
    border-radius: var(--border-radius);
  `
);

const WatchesContent = displayName(
  "WatchesContent",
  styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gap-size);
  `
);

const Watch = displayName(
  "Watch",
  styled.div`
    ${cssFieldStyle}
    display: grid;
    grid-template-columns: 1fr 0fr;
    grid-template-rows: 0fr 1fr;
    grid-template-areas:
      "label remove"
      "value value";
    gap: 0.4rem;
  `
);

const WatchLabel = displayName(
  "WatchLabel",
  styled.div`
    grid-area: label;
    font-size: 0.8rem;
    color: var(--main-fg);
  `
);

const WatchValue = displayName(
  "WatchValue",
  styled.div`
    grid-area: value;
    font-weight: 900;
    white-space: pre;
    font-size: 0.8rem;
    max-height: 8rem;
    overflow: scroll;
    color: ${({ isError }) => (isError ? "red" : "var(--input-color)")};
  `
);

const WatchRemove = displayName(
  "WatchRemove",
  styled(IconButton).attrs({
    area: "remove",
    iconStyle: "far",
    icon: "fa-trash-alt",
    chromeless: true,
  })`
    font-size: 0.7rem;
  `
);

const WatchList = ({ watches, onRemove }) => (
  <WatchesScroller>
    <WatchesContent>
      {watches.map(({ expr, value, isError }) => (
        <Watch key={expr} readOnly={true}>
          <WatchLabel>{expr}</WatchLabel>
          <WatchRemove
            onClick={() => onRemove(expr)}
            title="Remove this watch"
          />
          {typeof value === "object" && !isError ? (
            <JsonViewer src={value} />
          ) : (
            <WatchValue isError={isError} children={JSON.stringify(value)} />
          )}
        </Watch>
      ))}
    </WatchesContent>
  </WatchesScroller>
);

export default WatchList;
