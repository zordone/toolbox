import { useState, useEffect } from "react";
import { identity } from "./utils";

const PREFIX = "state";

const getKey = (toolName, stateKey) => [PREFIX, toolName, stateKey].join("-");

// useState persisted into local storage
export const usePersistedState = (
  toolComp,
  stateKey,
  defaultValue,
  onSerialize = identity,
  onDeserialize = identity
) => {
  const toolName = toolComp?.meta.name;
  if (!toolName) {
    throw new Error("usePersistedState: No tool name!");
  }
  if (typeof stateKey !== "string" || !stateKey) {
    throw new Error("usePersistedState: No state key!");
  }
  const key = getKey(toolName, stateKey);
  const [state, setState] = useState(
    () => onDeserialize(JSON.parse(localStorage.getItem(key))) || defaultValue
  );
  useEffect(() => {
    if (state !== undefined) {
      localStorage.setItem(key, JSON.stringify(onSerialize(state)));
    } else {
      localStorage.removeItem(key);
    }
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
  const compPrefix = getKey(toolName, "");
  Object.keys(localStorage)
    .filter((key) => key.startsWith(compPrefix))
    .forEach((key) => {
      localStorage.removeItem(key);
    });
};
