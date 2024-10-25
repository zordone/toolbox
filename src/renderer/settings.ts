import { FC, useState } from "react";
import { getToolByComponent, Tool } from "./toolStore";

export type SettingType = "float" | "integer" | "text" | "boolean";

export interface Setting {
  initial: number | string | boolean;
  key: string;
  title: string;
  type: SettingType;
}

const PREFIX = "settings";

const getKey = (toolName: string) => [PREFIX, toolName].join("-");

// save settings to local storage
export const saveSettings = (tool: Tool, values: object) => {
  const key = getKey(tool.name);
  localStorage.setItem(key, JSON.stringify(values));
};

// readonly useState initialised with the saved setting or the initial values
export const useSettings = (toolOrComp: Tool | FC) => {
  const tool =
    "component" in toolOrComp ? toolOrComp : getToolByComponent(toolOrComp);
  if (!tool) {
    throw new Error("useSettings: Can't find tool!");
  }

  const [settings] = useState(() => {
    const key = getKey(tool.name);
    const saved = JSON.parse(localStorage.getItem(key) || "{}");
    return Object.fromEntries(
      tool.settings.map(({ key, initial }) => [key, saved[key] ?? initial])
    );
  });

  return settings;
};
