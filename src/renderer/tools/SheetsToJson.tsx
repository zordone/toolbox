import React, { FC, useCallback } from "react";
import { usePersistedState } from "../persistedState";
import { useSettings } from "../settings";
import Formatter from "../templates/Formatter";
import { registerTool, ToolProps } from "../toolStore";
import { formatJson } from "../utils";

// TODO: type safe useSettings
interface MySettings {
  detectTypes: boolean;
  excludeEmpty: boolean;
}

const isBoolean = (value: string) =>
  ["true", "false"].includes(value.toLowerCase());
const isNumber = (value: string) => !isNaN(parseFloat(value));

const convertTsvToJson = (value: string, settings: MySettings): string => {
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
          }
        }

        return [header[index] || `#${index}`, parsedCell];
      })
    )
  );

  return formatJson(table);
};

const SheetsToJson: FC<ToolProps> = ({ pasted }) => {
  const [json, setJson] = usePersistedState(SheetsToJson, "json", "");
  const settings = useSettings(SheetsToJson) as MySettings;

  const onValidate = useCallback(
    (value: string) => {
      if (!value.includes("\t")) return { value, error: null };
      try {
        const json = convertTsvToJson(value, settings);
        return { value: json, error: null };
      } catch (ex) {
        return { value: "", error: ex.message };
      }
    },
    [settings]
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
      readOnly
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
