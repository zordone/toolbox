import React, { FC, useCallback } from "react";
import { usePersistedState } from "../persistedState";
import { SettingsRecord, useSettings } from "../settings";
import Formatter from "../templates/Formatter";
import { registerTool, ToolProps } from "../toolStore";
import { formatJson, message } from "../utils";

interface Settings extends SettingsRecord {
  detectTypes: boolean;
  excludeEmpty: boolean;
}

const isBoolean = (value: string) =>
  ["true", "false"].includes(value.toLowerCase());
const isNumber = (value: string) =>
  !isNaN(Number(value)) && !isNaN(parseFloat(value));
const isDate = (value: string) => !isNaN(Date.parse(value));

const convertTsvToJson = (value: string, settings: Settings): string => {
  const { detectTypes, excludeEmpty } = settings;
  const [header, ...rows] = value.split("\n").map((line) => line.split("\t"));

  const table = rows.map((row) =>
    Object.fromEntries(
      row.map((cell, index) => {
        let parsedCell: string | boolean | number | undefined = cell;

        if (excludeEmpty && cell === "") {
          parsedCell = undefined;
        } else if (detectTypes) {
          if (isBoolean(cell)) {
            parsedCell = cell.toLowerCase() === "true";
          } else if (isNumber(cell)) {
            parsedCell = parseFloat(cell);
          } else if (isDate(cell)) {
            parsedCell = new Date(cell).toISOString();
          }
        }

        return [header[index] || `#${index}`, parsedCell];
      }),
    ),
  );

  return formatJson(table);
};

const SheetsToJson: FC<ToolProps> = ({ pasted }) => {
  const [json, setJson] = usePersistedState(SheetsToJson, "json", "");
  const settings = useSettings<Settings>(SheetsToJson);

  const onValidate = useCallback(
    (value: string) => {
      if (!value.includes("\t")) return { value, error: null };
      try {
        const json = convertTsvToJson(value, settings);
        return { value: json, error: null };
      } catch (err) {
        return { value: "", error: message(err) };
      }
    },
    [settings],
  );

  return (
    <Formatter
      mode="json"
      name="JSON"
      onValidate={onValidate}
      pasted={pasted}
      setState={setJson}
      state={json}
      title="Paste your Google Sheets data"
    />
  );
};

registerTool({
  component: SheetsToJson,
  name: "SheetsToJson",
  description: "Google Sheets to JSON converter.",
  settings: [
    {
      key: "detectTypes",
      title: "Auto-detect types",
      type: "boolean",
      initial: true,
    },
    {
      key: "excludeEmpty",
      title: "Exclude empty cells",
      type: "boolean",
      initial: true,
    },
  ],
});
