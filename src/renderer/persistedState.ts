import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Tool } from "./toolStore";

const PREFIX = "state";

const getKey = (toolName: string, stateKey: string) =>
  [PREFIX, toolName, stateKey].join("-");

type JsonValue = unknown;

// useState persisted into local storage
export const usePersistedState = <TState>(
  toolComp: FC,
  stateKey: string,
  defaultValue: TState,
  // the defaults are for JSON serializable types only.
  // otherwise, it's required to pass in a proper onSerialize and onDeserialize functions.
  onSerialize: (value: TState) => JsonValue = (value) =>
    value as unknown as JsonValue,
  onDeserialize: (value: JsonValue) => TState = (value) =>
    value as unknown as TState,
): [TState, Dispatch<SetStateAction<TState>>] => {
  const toolName = toolComp?.displayName;
  if (!toolName) {
    throw new Error("usePersistedState: No tool name!");
  }
  const key = getKey(toolName, stateKey);
  const [state, setState] = useState<TState>(() => {
    const stored = localStorage.getItem(key);
    if (stored === null) {
      return defaultValue;
    }
    return onDeserialize(JSON.parse(stored)) || defaultValue;
  });
  useEffect(() => {
    if (state !== undefined) {
      localStorage.setItem(key, JSON.stringify(onSerialize(state)));
    } else {
      localStorage.removeItem(key);
    }
  }, [key, state, onSerialize]);
  return [state, setState];
};

const setToArray = <T>(set: Set<T>): T[] => Array.from(set);
const arrayToSet = <T>(array: T[]): Set<T> => array && new Set(array);

// useState persisted into local storage - for Set
export const usePersistedStateSet = <T>(
  toolComp: FC,
  stateKey: string,
  defaultValue: Set<T>,
) =>
  usePersistedState(toolComp, stateKey, defaultValue, setToArray, arrayToSet);

// clear all state persisted by a given tool
export const clearPersistedStateFor = (tool: Tool) => {
  const toolName = tool?.name;
  const compPrefix = getKey(toolName, "");
  Object.keys(localStorage)
    .filter((key) => key.startsWith(compPrefix))
    .forEach((key) => {
      localStorage.removeItem(key);
    });
};
