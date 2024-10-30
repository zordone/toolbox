import React, { FC } from "react";
import styled from "styled-components";
import { displayName } from "../utils";
import { IconButton } from "./Buttons";
import JsonViewer from "./JsonViewer";
import {
  cssFieldStyle,
  CssFieldStyleProps,
  cssGridArea,
  CssGridAreaProps,
} from "./styledCss";

const WatchesScroller = displayName(
  "WatchesScroller",
  styled.div<CssGridAreaProps>`
    ${cssGridArea};
    position: relative;
    overflow: scroll;
    height: 100%;
    border-radius: var(--border-radius);
  `,
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
  `,
);

const Watch = displayName(
  "Watch",
  styled.div<CssFieldStyleProps>`
    ${cssFieldStyle};
    display: grid;
    grid-template:
      "label remove" 0fr
      "value value" 1fr
      / 1fr 0fr;
    gap: 0.4rem;
  `,
);

const WatchLabel = displayName(
  "WatchLabel",
  styled.div`
    grid-area: label;
    font-size: 0.8rem;
    color: var(--main-fg);
  `,
);

interface WatchValueProps {
  $isError: boolean;
}

const WatchValue = displayName(
  "WatchValue",
  styled.div<WatchValueProps>`
    grid-area: value;
    font-weight: 900;
    white-space: pre;
    font-size: 0.8rem;
    max-height: 8rem;
    overflow: scroll;
    color: ${({ $isError }) => ($isError ? "red" : "var(--input-fg)")};
  `,
);

const WatchRemove = displayName(
  "WatchRemove",
  styled(IconButton)`
    font-size: 0.7rem;
    opacity: 0.5;

    &:hover {
      color: red;
      opacity: 0.7;
    }
  `,
);

const formatValue = (value: unknown) => {
  if (value === undefined) return "undefined";
  if (value === Infinity) return "Infinity";
  if (value === -Infinity) return "-Infinity";
  if (typeof value === "number" && isNaN(value)) return "NaN";
  return JSON.stringify(value);
};

export interface Watch {
  expr: string;
  isError: boolean;
  value: unknown;
}

interface WatchListProps {
  onRemove: (expr: string) => void;
  watches: Watch[];
}

const WatchList: FC<WatchListProps> = ({ onRemove, watches }) => (
  <WatchesScroller>
    <WatchesContent>
      {watches.map(({ expr, value, isError }) => (
        <Watch key={expr} readOnly={true}>
          <WatchLabel>{expr}</WatchLabel>
          <WatchRemove
            area="remove"
            chromeless
            icon="fa-trash-alt"
            iconStyle="far"
            onClick={() => onRemove(expr)}
            title="Remove this watch"
          />
          {typeof value === "object" && !isError ? (
            <JsonViewer data={value} />
          ) : (
            <WatchValue $isError={isError}>{formatValue(value)}</WatchValue>
          )}
        </Watch>
      ))}
    </WatchesContent>
  </WatchesScroller>
);

export default WatchList;
