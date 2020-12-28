import { useState, useEffect } from "react";
import { identity } from "./utils";

const PREFIX = "state";

// useState persisted into local storage
export const usePersistedState = (
  toolComp,
  stateKey,
  defaultValue,
  onSerialize = identity,
  onDeserialize = identity
) => {
  const toolName = toolComp?.displayName;
  if (!toolName) {
    throw new Error("usePersistedState: No tool name!");
  }
  if (typeof stateKey !== "string" || !stateKey) {
    throw new Error("usePersistedState: No state key!");
  }
  const key = [PREFIX, toolName, stateKey].join("-");
  const [state, setState] = useState(
    () => onDeserialize(JSON.parse(localStorage.getItem(key))) || defaultValue
  );
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(onSerialize(state)));
  }, [key, state, onSerialize]);
  return [state, setState];
};

const setToArray = (set) => Array.from(set);
const arrayToSet = (array) => array && new Set(array);

// useState persisted into local storage - for Set
export const usePersistedStateSet = (toolComp, stateKey, defaultValue) =>
  usePersistedState(toolComp, stateKey, defaultValue, setToArray, arrayToSet);

// clear all state persisted by a given tool
export const clearPersistedStateFor = (tool) => {
  const toolName = tool?.name;
  const compPrefix = [PREFIX, toolName, ""].join("-");
  Object.keys(localStorage)
    .filter((key) => key.startsWith(compPrefix))
    .forEach((key) => {
      localStorage.removeItem(key);
    });
};
