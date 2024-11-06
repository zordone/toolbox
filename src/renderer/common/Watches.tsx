import copyToClipboard from "copy-to-clipboard";
import React, { FC } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { capitalize, displayName } from "../utils";
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
    height: 100%;
    border-radius: var(--border-radius);
    overflow: scroll;
    scroll-behavior: smooth;
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
      "label copy  remove" 0fr
      "value value value" 1fr
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
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  `,
);

const WatchScroller = displayName(
  "WatchScroller",
  styled.div`
    grid-area: value;
    overflow-x: scroll;
  `,
);
interface WatchValueProps {
  $isError: boolean;
}

const WatchValue = displayName(
  "WatchValue",
  styled.div<WatchValueProps>`
    font-weight: 900;
    white-space: pre;
    font-size: 0.8rem;
    max-height: 8rem;
    overflow: scroll;
    color: ${({ $isError }) => ($isError ? "red" : "var(--input-fg)")};
  `,
);

interface WatchButtonProps {
  $isDanger?: boolean;
}

const WatchButton = displayName(
  "WatchButton",
  styled(IconButton).attrs(() => ({
    tabIndex: -1,
  }))<WatchButtonProps>`
    font-size: 0.7rem;
    opacity: 0.5;

    &:hover {
      color: ${({ $isDanger }) => ($isDanger ? "red" : "var(--main-fg)")};
      opacity: 0.7;
    }
  `,
);

const formatValue = (value: unknown) => {
  if (value === null) return "null";
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

const onCopy = (value: unknown) => {
  copyToClipboard(JSON.stringify(value));
  toast.success(capitalize(`Value copied to clipboard.`));
};

const WatchList: FC<WatchListProps> = ({ onRemove, watches }) => (
  <WatchesScroller>
    <WatchesContent>
      {watches.map(({ expr, value, isError }) => (
        <Watch key={expr} readOnly={true}>
          <WatchLabel>{expr}</WatchLabel>
          <WatchButton
            area="copy"
            chromeless
            icon="fa-copy"
            iconStyle="far"
            onClick={() => onCopy(value)}
            title="Copy this watch"
          />
          <WatchButton
            $isDanger
            area="remove"
            chromeless
            icon="fa-trash-alt"
            iconStyle="far"
            onClick={() => onRemove(expr)}
            title="Remove this watch"
          />
          <WatchScroller>
            {typeof value === "object" && value !== null && !isError ? (
              <JsonViewer data={value} />
            ) : (
              <WatchValue $isError={isError}>{formatValue(value)}</WatchValue>
            )}
          </WatchScroller>
        </Watch>
      ))}
    </WatchesContent>
  </WatchesScroller>
);

export default WatchList;
