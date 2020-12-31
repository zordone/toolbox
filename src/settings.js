import { useState } from "react";

const PREFIX = "settings";

const getKey = (toolName) => [PREFIX, toolName].join("-");

// save settings to local storage
export const saveSettings = (tool, values) => {
  const key = getKey(tool.name);
  localStorage.setItem(key, JSON.stringify(values));
};

// readonly useState initialised with the saved setting or the initial values
export const useSettings = (toolOrComp) => {
  const meta = toolOrComp.meta || toolOrComp;

  const [settings] = useState(() => {
    const key = getKey(meta.name);
    return JSON.parse(localStorage.getItem(key) || "{}");
  });

  return settings;
};
