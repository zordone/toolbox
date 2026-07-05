import React, { FC, useCallback } from "react";
import { usePersistedState } from "../persistedState";
import Formatter from "../templates/Formatter";
import { registerTool, ToolProps } from "../toolStore";
import { message } from "../utils";

const reUrl = /(https?:\/\/\S+)/g;

const convertTsvToMarkdown = (value: string): string => {
  const rows = value
    // format links
    .replace(reUrl, (url) => `[Link](${url})`)
    // split to rows
    .split("\n")
    // split rows to cells
    .map((row) => row.split("\t"));
  const columnCount = Math.max(...rows.map((row) => row.length));
  // fill in the undefined cells
  const table = rows.map((row) =>
    Array.from({ length: columnCount }, (_, index) => row[index] ?? "")
  );
  const widths = Array.from({ length: columnCount }, (_, index) =>
    Math.max(3, ...table.map((row) => row[index].length))
  );
  const [header, ...body] = table;
  const divider = widths.map((width) => "-".repeat(width));

  return (
    [header, divider, ...body]
      // pad cells to max widths
      .map(
        (row) =>
          `| ${row.map((cell, index) => cell.padEnd(widths[index])).join(" | ")} |`
      )
      .join("\n")
  );
};

const SheetsToMarkdown: FC<ToolProps> = ({ pasted }) => {
  const [markdown, setMarkdown] = usePersistedState(
    SheetsToMarkdown,
    "markdown",
    ""
  );

  const onValidate = useCallback((value: string) => {
    if (!value.includes("\t")) return { value, error: null };
    try {
      const markdown = convertTsvToMarkdown(value);
      return { value: markdown, error: null };
    } catch (err) {
      return { value: "", error: message(err) };
    }
  }, []);

  return (
    <Formatter
      mode="markdown"
      name="Markdown"
      onValidate={onValidate}
      pasted={pasted}
      setState={setMarkdown}
      state={markdown}
      title="Paste your Google Sheets data"
    />
  );
};

registerTool({
  component: SheetsToMarkdown,
  name: "SheetsToMarkdown",
  description: "Google Sheets to Markdown table converter.",
});
