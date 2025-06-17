import copyToClipboard from "copy-to-clipboard";
import React, { FC, ReactNode } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { ascii } from "../common/ascii";
import { registerTool, ToolProps } from "../toolStore";
import { displayName, falsyToNull, htmlToText } from "../utils";
import { Table } from "../templates/Table";

const CharSpan = displayName(
  "CharSpan",
  styled.span`
    font-family: monospace;
    color: var(--input-fg);
  `,
);

// decimal to hexadecimal number
const hex = (dec: number) => dec.toString(16).padStart(2, "0");

const colWidths = [0, 0, 0, 0, 0, 0, 1];

const headers = [
  "Dec",
  "Hex",
  "Symbol / Char",
  "Unicode",
  "HTML Number",
  "HTML Name",
  "Description",
];

const rows: [string, string, ReactNode, string, string, string, string][] =
  ascii.map(([code, _char, symbol, number, name, description], rowIndex) => [
    String(code),
    hex(code),
    <CharSpan
      id={`${rowIndex}-char`}
      key={rowIndex}
      dangerouslySetInnerHTML={{ __html: symbol || number }}
      data-copy={htmlToText(number)}
      data-show={falsyToNull(symbol) ?? JSON.stringify(htmlToText(number))}
    />,
    `\\x${hex(code)}`,
    number,
    name,
    description,
  ]);

// pre-calculate search terms
const search = ascii.map(([code, char, symbol, number, name, description]) =>
  [symbol, char, code, hex(code), number, name, description]
    .join(" ")
    .toLowerCase(),
);

// copy the original character or other cell text
const copyCell = (row: number, col: number) => {
  let copy: string | undefined;
  let show: string | undefined;

  if (col === 2) {
    const charSpan = document.getElementById(`${row}-char`);
    if (!(charSpan instanceof HTMLElement)) return;
    ({ copy, show } = charSpan.dataset);
  } else {
    copy = rows[row][col] as string;
    show = JSON.stringify(copy);
  }

  if (!copy) return;
  copyToClipboard(copy);
  toast.success(`${show} copied to clipboard.`);
};

// copy the character from the first row after filtering
const copyChar = (row: number) => {
  copyCell(row, 2);
};

const AsciiTable: FC<ToolProps> = () => (
  <Table
    colWidths={colWidths}
    tool={AsciiTable}
    headers={headers}
    rows={rows}
    search={search}
    onCellClick={copyCell}
    onRowEnter={copyChar}
  />
);

registerTool({
  component: AsciiTable,
  name: "AsciiTable",
  description: "ASCII table.",
});
