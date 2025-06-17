import copyToClipboard from "copy-to-clipboard";
import React, { FC, ReactNode } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { registerTool, ToolProps } from "../toolStore";
import { Table } from "../templates/Table";
import { data } from "./reactEventsData";
import { displayName } from "../utils";

const Example = displayName(
  "Example",
  styled.pre`
    white-space: pre-wrap;
    font-size: 0.5rem;
  `
);

const eventLink = (event: string, className: string): ReactNode | string =>
  className === "React-only" ? (
    event
  ) : (
    <a
      key={event}
      href={`https://developer.mozilla.org/en-US/docs/Web/API/${className}/${event.slice(2).toLowerCase()}_event`}
      target="_blank"
      rel="noreferrer"
    >
      {event}
    </a>
  );

const colWidths = [0, 0, 0, 0, 1];

const headers = [
  "Category",
  "Event (mdn)",
  "Event Type",
  "Handler Type",
  "Example",
];

const rows: [string, ReactNode | string, string, string, ReactNode][] =
  data.map(([category, event, eventType, handlerType, example, className]) => [
    category,
    eventLink(event, className),
    eventType,
    handlerType,
    <Example key={`pre-${event}`}>{example}</Example>,
  ]);

// pre-calculate search terms
const search = data.map(
  ([category, event, eventType, handlerType, _example, _className]) =>
    [category, event, eventType, handlerType]
      .join(" ")
      .replaceAll(/\bReact\./g, "")
      .replaceAll(/\bT\b/g, "")
      .replaceAll(/\W/g, " ")
      .replaceAll(/\s+/g, " ")
      .toLowerCase()
);

// copy the original character or other cell text
const copyCell = (row: number, col: number) => {
  const cell = data[row][col];
  if (!cell) return;
  const copy = cell;
  const show = headers[col];
  if (!copy) return;
  copyToClipboard(copy);
  toast.success(`${show} copied to clipboard.`);
};

// copy the example from the first row after filtering
const copyExample = (row: number) => {
  copyCell(row, 4);
};

const ReactEvents: FC<ToolProps> = () => (
  <Table
    colWidths={colWidths}
    tool={ReactEvents}
    headers={headers}
    rows={rows}
    search={search}
    onCellClick={copyCell}
    onRowEnter={copyExample}
  />
);

// disabled for now. never needed it since it was created.

// registerTool({
//   component: ReactEvents,
//   name: "ReactEvents",
//   description: "React events table.",
// });
