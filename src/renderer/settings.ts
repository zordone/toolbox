import { FC, useState } from "react";
import { getToolByComponent, Tool, ToolProps } from "./toolStore";

export type SettingType = "float" | "integer" | "text" | "boolean";

export interface Setting {
  initial: number | string | boolean;
  key: string;
  title: string;
  type: SettingType;
}

export type SettingsRecord = Record<string, number | boolean | string>;

const PREFIX = "settings";

const getKey = (toolName: string) => [PREFIX, toolName].join("-");

// save settings to local storage
export const saveSettings = (tool: Tool, values: object) => {
  const key = getKey(tool.name);
  localStorage.setItem(key, JSON.stringify(values));
};

// readonly useState initialised with the saved setting or the initial values
export const useSettings = <T extends SettingsRecord>(
  toolOrComp: Tool | FC<ToolProps>,
): T => {
  const tool =
    "component" in toolOrComp ? toolOrComp : getToolByComponent(toolOrComp);
  if (!tool) {
    throw new Error("useSettings: Can't find tool!");
  }

  const [settings] = useState<T>(() => {
    const key = getKey(tool.name);
    const saved = JSON.parse(localStorage.getItem(key) ?? "{}") as T;
    if (!tool.settings?.length) {
      return {} as T;
    }
    return Object.fromEntries(
      tool.settings.map(({ key, initial }) => [key, saved[key] ?? initial]),
    ) as T;
  });

  return settings;
};
